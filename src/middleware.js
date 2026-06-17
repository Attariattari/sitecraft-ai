import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get("sitecraft_token");
  const isAuthenticated = !!authCookie;

  // Protect Dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect Admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Decode JWT payload (without verification, as edge doesn't support jsonwebtoken)
      // Verification is done on backend API / SSR
      const payloadBase64 = authCookie.value.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      if (
        decodedPayload.role !== "admin" &&
        decodedPayload.role !== "super-admin"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      // If token is malformed
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  // Prevent authenticated users from accessing auth pages
  const authRoutes = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ];
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
};
