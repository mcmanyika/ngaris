import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminAuth } from "@/lib/firebase/admin";
import {
  createProviderApplication,
  getProviderByOwnerUid,
} from "@/lib/firebase/providers";
import { ensureUserProfile } from "@/lib/firebase/profiles";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
  createSessionCookie,
} from "@/lib/firebase/session";
import { notifyAdminsOfProviderApplication } from "@/lib/notifications/provider-notify";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { providerApplyFormSchema } from "@/lib/validations/provider";

const bodySchema = providerApplyFormSchema.extend({
  idToken: z.string().min(100).max(16000),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`provider-apply:${ip}`, 8, 15 * 60 * 1000);

  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many applications. Please try again later." },
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
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.companyWebsite.length > 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(parsed.data.idToken, false);

    const existing = await getProviderByOwnerUid(decoded.uid);
    if (existing) {
      return NextResponse.json(
        { error: "An application already exists for this account." },
        { status: 409 },
      );
    }

    const years =
      parsed.data.yearsExperience.trim().length > 0
        ? Number.parseInt(parsed.data.yearsExperience, 10)
        : undefined;

    const provider = await createProviderApplication({
      ownerUid: decoded.uid,
      application: {
        fullName: parsed.data.fullName,
        companyName: parsed.data.companyName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        city: parsed.data.city,
        trade: parsed.data.trade,
        yearsExperience:
          years !== undefined && Number.isFinite(years) ? years : undefined,
        about: parsed.data.about,
      },
    });

    await ensureUserProfile({
      uid: decoded.uid,
      email: decoded.email ?? parsed.data.email.toLowerCase(),
      fullName: parsed.data.fullName,
      roles: ["contractor"],
      status: "pending",
      providerId: provider.id,
    });

    await notifyAdminsOfProviderApplication({
      providerId: provider.id,
      companyName: parsed.data.companyName,
      contactName: parsed.data.fullName,
      email: parsed.data.email,
      trade: parsed.data.trade,
      city: parsed.data.city,
    });

    const { sessionCookie, email } = await createSessionCookie(
      parsed.data.idToken,
    );

    const response = NextResponse.json({
      ok: true,
      providerId: provider.id,
      email,
      destination: "/contractor",
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
    console.error("[api/providers/apply] failed", error);

    const misconfigured =
      error instanceof Error &&
      (error.message.includes("Firebase Admin") ||
        error.message.includes("FIREBASE_"));

    return NextResponse.json(
      {
        error: misconfigured
          ? "Applications are not configured yet."
          : "Unable to submit your application. Please try again.",
      },
      { status: misconfigured ? 503 : 502 },
    );
  }
}
