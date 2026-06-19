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

            // Block restricted users from Dashboard
            if (decodedPayload.status === "restricted") {
                return NextResponse.redirect(new URL("/restricted", request.url));
            }
            if (decodedPayload.status === "suspended") {
                const url = new URL("/login", request.url);
                url.searchParams.set("error", "account_suspended");
                return NextResponse.redirect(url);
            }
        } catch (error) {
            return NextResponse.redirect(new URL("/login", request.url));
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

            if (decodedPayload.status === "restricted") {
                return NextResponse.redirect(new URL("/restricted", request.url));
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
                if (decodedPayload.status === "restricted") {
                    return NextResponse.redirect(new URL("/restricted", request.url));
                }
            } catch (e) {}
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
    ],
};