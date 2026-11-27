import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getUserProfile,
  isContractorProfile,
  isStaffProfile,
} from "@/lib/firebase/profiles";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
  createSessionCookie,
} from "@/lib/firebase/session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  idToken: z.string().min(100).max(16000),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`auth-session:${ip}`, 20, 15 * 60 * 1000);

  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session payload." }, { status: 400 });
  }

  try {
    const { sessionCookie, email, uid } = await createSessionCookie(
      parsed.data.idToken,
    );

    const profile = await getUserProfile(uid);
    const isStaff = isStaffProfile(profile);
    const isContractor = isContractorProfile(profile);
    const destination = isStaff
      ? "/admin"
      : isContractor
        ? "/contractor"
        : "/";

    const response = NextResponse.json({
      ok: true,
      email,
      destination,
      isStaff,
      isContractor,
    });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return response;
  } catch (error) {
    console.error("[api/auth/session] create failed", error);

    const message = error instanceof Error ? error.message : String(error);
    const misconfigured =
      message.includes("Firebase Admin") || message.includes("FIREBASE_");
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
        ? (error as { code: string }).code
        : null;

    return NextResponse.json(
      {
        error: misconfigured
          ? "Auth is not configured yet. Check FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY, then restart next dev."
          : code === "auth/id-token-expired"
            ? "Sign-in expired. Try again."
            : code === "auth/argument-error"
              ? "Invalid auth token. Try signing in again."
              : `Unable to create session${code ? ` (${code})` : ""}.`,
      },
      { status: misconfigured ? 503 : 401 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
