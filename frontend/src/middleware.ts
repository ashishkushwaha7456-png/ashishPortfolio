import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";
import { ANALYTICS_COOKIE, COOKIE_NAME } from "@/constants/site";

/**
 * Runs on the Edge for every non-static request:
 *  1. Guards /admin/** and the mutating /api/admin/** routes.
 *  2. Issues an anonymous, non-identifying session id used for visit counting.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  /* ── Admin pages ───────────────────────────────────────── */
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!session) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  /* Already signed in? Skip the login screen. */
  if (pathname.startsWith("/admin/login") && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  /* ── Admin API ─────────────────────────────────────────── */
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth")) {
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
  }

  const response = NextResponse.next();

  /* ── Anonymous analytics id (no PII, first-party only) ──── */
  if (!request.cookies.get(ANALYTICS_COOKIE)) {
    response.cookies.set(ANALYTICS_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /* Everything except static assets, images and the favicon. */
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|resume|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|pdf|xml|txt|json|webmanifest)$).*)",
  ],
};
