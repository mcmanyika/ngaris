import "server-only";

import { cookies } from "next/headers";

import { getAdminAuth } from "@/lib/firebase/admin";
import { awaitRequestIo } from "@/lib/firebase/request-io";
import { SESSION_COOKIE_NAME } from "@/lib/firebase/session-constants";

export { SESSION_COOKIE_NAME };
export const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export type SessionUser = {
  uid: string;
  email: string | null;
};

export async function createSessionCookie(idToken: string) {
  const auth = getAdminAuth();
  // checkRevoked=false avoids false failures during fresh sign-in.
  const decoded = await auth.verifyIdToken(idToken, false);

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });

  return {
    sessionCookie,
    uid: decoded.uid,
    email: decoded.email ?? null,
  };
}

/** Only call from Route Handlers / Server Actions — not RSC layouts. */
export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getVerifiedSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const sessionCookie = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie || sessionCookie.length < 20) return null;

  // Firebase verifySessionCookie uses Date.now() for expiry.
  await awaitRequestIo();

  try {
    const decoded = await getAdminAuth().verifySessionCookie(
      sessionCookie,
      false,
    );
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
    };
  } catch (error) {
    console.error("[firebase/session] verifySessionCookie failed", error);
    // Do not mutate cookies here — RSC layouts cannot set cookies.
    return null;
  }
}
