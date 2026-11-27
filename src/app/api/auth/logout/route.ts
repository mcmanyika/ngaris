import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/firebase/session-constants";

function clearCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

function safeNextPath(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next");
  if (
    next &&
    (next.startsWith("/admin/login") ||
      next.startsWith("/contractor/login") ||
      next === "/admin/login" ||
      next === "/contractor/login")
  ) {
    return next;
  }
  return "/admin/login";
}

/** Clears the session cookie then sends the user to login. Safe from RSC redirects. */
export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL(safeNextPath(request), request.url));
  clearCookie(response);
  return response;
}

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearCookie(response);
  return response;
}
