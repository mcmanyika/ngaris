import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/firebase/session-constants";

/**
 * Lightweight gate for /admin and /contractor routes (Edge-safe).
 * Full session + role checks happen in protected layouts via Admin SDK.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasSession = Boolean(sessionValue && sessionValue.length > 20);

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminPublic =
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname === "/admin/register" ||
    pathname.startsWith("/admin/register/") ||
    pathname === "/admin/pending" ||
    pathname.startsWith("/admin/pending/");

  const isContractorRoute = pathname.startsWith("/contractor");
  const isContractorPublic =
    pathname === "/contractor/apply" ||
    pathname.startsWith("/contractor/apply/") ||
    pathname === "/contractor/login" ||
    pathname.startsWith("/contractor/login/");

  if (isAdminRoute && !isAdminPublic && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isContractorRoute && !isContractorPublic && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/contractor/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request });
}
