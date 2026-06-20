import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { signAuthToken } from "@/lib/auth/tokens";
import { isRootSuperAdminEmail } from "@/lib/auth/rootSuperAdmin";
import getBaseUrl from "@/lib/getBaseUrl";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        const cookieStore = await cookies();
        const storedState = cookieStore.get("google_oauth_state") ? .value || null;

        // clear state cookie
        if (cookieStore.get("google_oauth_state")) {
            cookieStore.delete("google_oauth_state");
        }

        if (!code || !state || !storedState || state !== storedState) {
            console.warn("Google OAuth state mismatch or missing code");
            return NextResponse.redirect(`${getBaseUrl()}/login`);
        }

        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

        const baseUrl = getBaseUrl();
        const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;

        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            console.error("Google OAuth secrets not configured");
            return NextResponse.redirect(`${baseUrl}/login`);
        }

        // Exchange code for tokens
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenRes.ok) {
            const errorText = await tokenRes.text();
            console.error("Failed to exchange Google code", errorText);
            return NextResponse.redirect(`${baseUrl}/login`);
        }

        const tokenJson = await tokenRes.json();
        const accessToken = tokenJson.access_token;

        // Fetch userinfo
        const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!profileRes.ok) {
            console.error("Failed to fetch Google profile", await profileRes.text());
            return NextResponse.redirect(`${baseUrl}/login`);
        }

        const profile = await profileRes.json();
        const email = profile.email && profile.email.toLowerCase();
        const emailVerified = !!profile.email_verified;
        const googleId = profile.sub;
        const name = profile.name || "";
        const avatar = profile.picture || "";

        if (!email || !emailVerified) {
            console.warn("Google account missing verified email");
            return NextResponse.redirect(`${baseUrl}/login`);
        }

        await dbConnect();

        // Root super admin handling
        if (isRootSuperAdminEmail(email)) {
            const existingRoot = await User.findOne({ email });

            // If root user already exists, require OTP verification
            if (existingRoot && existingRoot.isRootSuperAdmin) {
                return NextResponse.redirect(`${baseUrl}/verify-super-admin?email=${encodeURIComponent(email)}`);
            }

            // If no users exist, allow creation of initial root via Google
            const usersCount = await User.countDocuments();
            if (usersCount === 0) {
                const newRoot = await User.create({
                    name: name || "Root Super Admin",
                    email,
                    role: "super-admin",
                    isRootSuperAdmin: true,
                    status: "active",
                    isEmailVerified: true,
                    emailVerifiedAt: new Date(),
                    accountPurpose: "agency",
                    plan: "agency",
                    credits: 999999,
                    authProvider: "google",
                    googleId,
                    avatarUrl: avatar,
                });

                const token = signAuthToken(newRoot);
                const cs = await cookies();
                cs.set("sitecraft_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60,
                });

                return NextResponse.redirect(`${baseUrl}/dashboard`);
            }
        }

        // Normal user flow
        let user = await User.findOne({
            $or: [{ googleId }, { email }]
        });

        if (user) {
            // If account is restricted/suspended, redirect to restricted page
            if (user.status && (user.status === "restricted" || user.status === "suspended")) {
                return NextResponse.redirect(`${baseUrl}/restricted`);
            }

            // Link googleId and update details if needed
            let changed = false;
            if (!user.googleId) {
                user.googleId = googleId;
                changed = true;
            }
            if (!user.avatarUrl && avatar) {
                user.avatarUrl = avatar;
                changed = true;
            }

            // If they don't have a password (pure social) or authProvider is default, 
            // set it to google. If they have a password, they are still 'credentials' but linked.
            if (!user.password && user.authProvider !== "google") {
                user.authProvider = "google";
                changed = true;
            }

            user.lastLoginAt = new Date();
            if (changed) await user.save();

            const token = signAuthToken(user);
            const cs = await cookies();
            cs.set("sitecraft_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60,
            });

            // Redirect logic
            if (!user.accountPurpose) {
                return NextResponse.redirect(`${baseUrl}/dashboard/personal-info`);
            }
            return NextResponse.redirect(`${baseUrl}/dashboard`);
        }

        // Create new user (Signup flow via Google)
        const newUser = await User.create({
            name: name || "",
            email,
            googleId,
            authProvider: "google",
            avatarUrl: avatar,
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
            role: "user",
            plan: "free",
            credits: 10,
            accountPurpose: "", // Will trigger redirect to personal-info
            lastLoginAt: new Date(),
            status: "active",
            sessionVersion: 0,
        });

        const token = signAuthToken(newUser);
        const cs = await cookies();
        cs.set("sitecraft_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return NextResponse.redirect(`${baseUrl}/dashboard/personal-info`);
    } catch (err) {
        console.error("Google callback error:", err);
        const baseUrl = getBaseUrl();
        return NextResponse.redirect(`${baseUrl}/login`);
    }
}