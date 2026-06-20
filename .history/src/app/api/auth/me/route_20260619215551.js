import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth/tokens";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

function safeUserPayload(user, loginProvider = "credentials") {
    if (!user) return null;

    // Determine display profile based on session loginProvider
    let displayName = user.name;
    let displayImage = user.profileImage ? .url || user.avatarUrl || null;
    let displaySource = "fallback";

    if (loginProvider === "google" && user.googleProfile ? .name) {
        displayName = user.googleProfile.name;
        displayImage = user.googleProfile.cloudinaryImage ? .url || user.googleProfile.picture || displayImage;
        displaySource = "google";
    } else if (loginProvider === "credentials") {
        // If we have a specific manual profile, use it; otherwise top-level
        if (user.manualProfile ? .name) {
            displayName = user.manualProfile.name;
            displayImage = user.manualProfile.profileImage ? .url || displayImage;
        }
        displaySource = "manual";
    }

    return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan || "free",
        accountPurpose: user.accountPurpose,
        primaryPurpose: user.primaryPurpose,
        selectedPurposes: user.selectedPurposes || [],
        profileImage: user.profileImage,
        profile: user.profile,
        preferences: user.preferences,
        isRootSuperAdmin: user.isRootSuperAdmin || false,
        status: user.status,
        isEmailVerified: user.isEmailVerified || false,
        sessionVersion: user.sessionVersion || 0,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        // Linking & Provider Info
        loginProvider,
        lastLoginProvider: user.lastLoginProvider,
        authProviders: user.authProviders,
        googleProfile: user.googleProfile,
        manualProfile: user.manualProfile,
        displayProfile: {
            name: displayName,
            imageUrl: displayImage,
            source: displaySource,
        },
    };
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get("sitecraft_token");
        const token = cookie ? cookie.value : null;

        if (!token) {
            return NextResponse.json({
                success: true,
                authenticated: false,
                authState: "guest",
                user: null,
            });
        }

        const decoded = verifyAuthToken(token);
        if (!decoded) {
            return NextResponse.json({
                success: true,
                authenticated: false,
                authState: "guest",
                user: null,
            });
        }

        await dbConnect();
        const user = await User.findById(decoded.userId).select("-password -__v");
        if (!user) {
            return NextResponse.json({
                success: true,
                authenticated: false,
                authState: "guest",
                user: null,
            });
        }

        // If DB sessionVersion mismatch, treat as guest (token invalidated)
        const tokenVersion =
            decoded.sessionVersion !== undefined ? decoded.sessionVersion : 0;
        const dbVersion = user.sessionVersion || 0;
        if (dbVersion !== tokenVersion) {
            return NextResponse.json({
                success: true,
                authenticated: false,
                authState: "guest",
                user: null,
            });
        }

        // Restricted or suspended from DB
        if (user.status === "restricted") {
            return NextResponse.json({
                success: true,
                authenticated: true,
                authState: "restricted",
                user: safeUserPayload(user, decoded.loginProvider),
            });
        }
        if (user.status === "suspended") {
            return NextResponse.json({
                success: true,
                authenticated: true,
                authState: "suspended",
                user: safeUserPayload(user, decoded.loginProvider),
            });
        }

        // Otherwise authenticated
        return NextResponse.json({
            success: true,
            authenticated: true,
            authState: "authenticated",
            user: safeUserPayload(user, decoded.loginProvider),
        });
    } catch (error) {
        console.error("Auth me error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 }, );
    }
}