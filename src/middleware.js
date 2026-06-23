import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const authCookie = request.cookies.get("sitecraft_token");
    const isAuthenticated = !!authCookie;

    // Routes specifically allowed for restricted users
    const restrictedAllowedRoutes = ["/restricted", "/restricted/request-review"];
    const isRestrictedRoute = restrictedAllowedRoutes.some((route) =>
        pathname.startsWith(route),
    );

    // Protect Dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!isAuthenticated) {
            const url = new URL("/login", request.url);
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }

        try {
            const payloadBase64 = authCookie.value.split(".")[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));

            // Check token expiry from payload (exp is in seconds)
            const exp = decodedPayload.exp;
            const nowSec = Math.floor(Date.now() / 1000);
            const tokenExpired = exp && Number(exp) > 0 ? Number(exp) <= nowSec : false;

            // If token expired or malformed, treat as guest -> redirect to login
            if (tokenExpired) {
                const url = new URL("/login", request.url);
                url.searchParams.set("redirect", pathname);
                return NextResponse.redirect(url);
            }

            // Allow the configured root super-admin to bypass accidental restriction
            const ROOT_SUPER = process.env.ROOT_SUPER_ADMIN_EMAIL
                ? process.env.ROOT_SUPER_ADMIN_EMAIL.toLowerCase().trim()
                : null;
            const isRootEmail = decodedPayload.email && ROOT_SUPER && decodedPayload.email.toLowerCase() === ROOT_SUPER;
            const isRootFlag = decodedPayload.isRootSuperAdmin === true;

            // Block restricted users from Dashboard (unless root super-admin)
            if (decodedPayload.status === "restricted" && !isRootEmail && !isRootFlag) {
                return NextResponse.redirect(new URL("/restricted", request.url));
            }
            if (decodedPayload.status === "suspended") {
                return NextResponse.redirect(new URL("/suspended", request.url));
            }
        } catch (error) {
            // Malformed token -> treat as guest
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
            const payloadBase64 = authCookie.value.split(".")[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));

            // If token expired -> guest -> redirect to login
            const exp = decodedPayload.exp;
            const nowSec = Math.floor(Date.now() / 1000);
            const tokenExpired = exp && Number(exp) > 0 ? Number(exp) <= nowSec : false;
            if (tokenExpired) {
                const url = new URL("/login", request.url);
                url.searchParams.set("redirect", pathname);
                return NextResponse.redirect(url);
            }

            const ROOT_SUPER2 = process.env.ROOT_SUPER_ADMIN_EMAIL
                ? process.env.ROOT_SUPER_ADMIN_EMAIL.toLowerCase().trim()
                : null;
            const isRootEmail2 = decodedPayload.email && ROOT_SUPER2 && decodedPayload.email.toLowerCase() === ROOT_SUPER2;
            const isRootFlag2 = decodedPayload.isRootSuperAdmin === true;

            if (decodedPayload.status === "restricted" && !isRootEmail2 && !isRootFlag2) {
                return NextResponse.redirect(new URL("/restricted", request.url));
            }

            if (decodedPayload.status === "suspended") {
                return NextResponse.redirect(new URL("/suspended", request.url));
            }

            if (
                decodedPayload.role !== "admin" &&
                decodedPayload.role !== "super-admin"
            ) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }

            if (decodedPayload.status !== "active") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch (error) {
            const url = new URL("/login", request.url);
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }
    }

    // Allow restricted users to access their review pages
    if (isRestrictedRoute) {
        return NextResponse.next();
    }

    // verify-super-admin must stay accessible
    if (pathname.startsWith("/verify-super-admin")) {
        return NextResponse.next();
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
            try {
                const payloadBase64 = authCookie.value.split(".")[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));

                // If token expired -> treat as guest: allow access to auth pages
                const exp = decodedPayload.exp;
                const nowSec = Math.floor(Date.now() / 1000);
                const tokenExpired = exp && Number(exp) > 0 ? Number(exp) <= nowSec : false;
                if (tokenExpired) {
                    return NextResponse.next();
                }

                const ROOT_SUPER3 = process.env.ROOT_SUPER_ADMIN_EMAIL
                    ? process.env.ROOT_SUPER_ADMIN_EMAIL.toLowerCase().trim()
                    : null;
                const isRootEmail3 = decodedPayload.email && ROOT_SUPER3 && decodedPayload.email.toLowerCase() === ROOT_SUPER3;
                const isRootFlag3 = decodedPayload.isRootSuperAdmin === true;
                if (decodedPayload.status === "restricted" && !isRootEmail3 && !isRootFlag3) {
                    return NextResponse.redirect(new URL("/restricted", request.url));
                }
                if (decodedPayload.status === "suspended") {
                    return NextResponse.redirect(new URL("/suspended", request.url));
                }
            } catch (e) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/verify-super-admin",
        "/login",
        "/signup",
        "/verify-email",
        "/forgot-password",
        "/reset-password",
        "/restricted/:path*",
        "/suspended/:path*",
    ],
};
