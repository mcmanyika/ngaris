import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminAuth } from "@/lib/firebase/admin";
import {
  ensureUserProfile,
  isAllowlistedEmail,
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
  fullName: z.string().trim().min(2).max(120),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`auth-register:${ip}`, 10, 15 * 60 * 1000);

  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Try again shortly." },
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
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(parsed.data.idToken, false);
    const email = decoded.email ?? null;
    const allowlisted = isAllowlistedEmail(email);

    const profile = await ensureUserProfile({
      uid: decoded.uid,
      email,
      fullName: parsed.data.fullName,
      roles: allowlisted ? ["admin", "staff"] : ["staff"],
      status: allowlisted ? "active" : "pending",
    });

    const { sessionCookie } = await createSessionCookie(parsed.data.idToken);
    const canAccess = isStaffProfile(profile);

    const response = NextResponse.json({
      ok: true,
      pendingAccess: !canAccess,
      email,
      destination: canAccess ? "/admin" : "/admin/pending",
      message: canAccess
        ? undefined
        : "Account created. An admin must activate access before you can use the dashboard.",
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
    console.error("[api/auth/register] failed", error);

    const misconfigured =
      error instanceof Error &&
      (error.message.includes("Firebase Admin") ||
        error.message.includes("FIREBASE_"));

    return NextResponse.json(
      {
        error: misconfigured
          ? "Registration is not configured yet."
          : "Unable to complete registration. Please try again.",
      },
      { status: misconfigured ? 503 : 502 },
    );
  }
}
