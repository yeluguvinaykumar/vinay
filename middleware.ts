import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PATHS = ["/admin", "/api/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public API routes that should never be blocked
  if (pathname === "/api/auth/login" || pathname === "/api/auth/logout") {
    return NextResponse.next();
  }

  // Let API routes self-guard (they call requireAdmin internally),
  // but still protect page routes below.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isAdminPath = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isAdminPath && !request.cookies.get("vinay_token")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/api/admin/:path*"],
};
