import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    // Graceful fallback for development/build if needed, but error at runtime in production
    if (process.env.NODE_ENV === "production" && !process.env.CI) {
        console.warn(
            "⚠️ JWT_SECRET is missing. Proceeding with fallback for build phase.",
        );
    }
}

const secret = JWT_SECRET || "fallback_dev_secret_only";

export function signAuthToken(user) {
    const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        accountPurpose: user.accountPurpose,
        sessionVersion: user.sessionVersion ? ? 0,
        isRootSuperAdmin: user.isRootSuperAdmin ? ? false,
        status: user.status ? ? "active",
    };

    return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyAuthToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

if (!isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
}

try {
    const payloadBase64 = authCookie.value.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // Block restricted/suspended users from Dashboard
    if (decodedPayload.status !== "active") {
        const url = new URL("/login", request.url);
        url.searchParams.set("error", "account_restricted");
        return NextResponse.redirect(url);
    }
} catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
}
}