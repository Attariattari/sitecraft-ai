import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { signAuthToken } from "@/lib/auth/tokens";
import { isRootSuperAdminEmail } from "@/lib/auth/rootSuperAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import { uploadRemoteImageToCloudinary } from "@/lib/cloudinary";

export async function GET(req) {
    const baseUrl = getBaseUrl();
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        const cookieStore = await cookies();
        const storedState = cookieStore.get("google_oauth_state") ? .value || null;

        if (cookieStore.get("google_oauth_state")) {
            cookieStore.delete("google_oauth_state");
        }

        if (!code || !state || !storedState || state !== storedState) {
            console.warn("Google OAuth state mismatch or missing code");
            return NextResponse.redirect(`${baseUrl}/login`);
        }

        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
        const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;

        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            console.error("Google OAuth secrets not configured");
            return NextResponse.redirect(`${baseUrl}/login`);
        }

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
            console.error("Failed to exchange Google code");
            return NextResponse.redirect(`${baseUrl}/login`);
        }

        const tokenJson = await tokenRes.json();
        const accessToken = tokenJson.access_token;

        const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!profileRes.ok) {
            return NextResponse.redirect(`${baseUrl}/login`);
        }

        const profile = await profileRes.json();
        const email = profile.email && profile.email.toLowerCase();
        const emailVerified = !!profile.email_verified;
        const googleId = profile.sub;
        const name = profile.name || "";
        const avatar = profile.picture || "";

        if (!email || !emailVerified) {
            return NextResponse.redirect(`${baseUrl}/login`);
        }

        await dbConnect();

        let user = await User.findOne({ email });
        const isRoot = isRootSuperAdminEmail(email);

        if (!user) {
            const usersCount = await User.countDocuments();
            user = new User({
                name: name,
                email,
                avatarUrl: avatar,
                googleId: googleId,
                authProvider: 'google',
                isEmailVerified: true,
                status: 'active',
                plan: isRoot ? 'agency' : (usersCount === 0 ? 'agency' : 'free'),
                role: (isRoot || usersCount === 0) ? 'super-admin' : 'user',
                isRootSuperAdmin: isRoot || usersCount === 0,
                credits: (isRoot || usersCount === 0) ? 999999 : 10,
                primaryPurpose: '',
                selectedPurposes: [],
                accountPurpose: '',
            });
            await user.save(); // OK — new user, no existing token yet
        } else {
            // Existing user handling
            if (user.status === "restricted" || user.status === "suspended") {
                return NextResponse.redirect(`${baseUrl}/restricted`);
            }

            if (!user.googleId) {
                // Use atomic update to avoid triggering pre-save hooks on existing user
                await User.findByIdAndUpdate(
                    user._id, { $set: { googleId, authProvider: "google", ...(!user.avatarUrl && avatar ? { avatarUrl: avatar } : {}) } }, { runValidators: false }
                );
                user.googleId = googleId; // keep local ref in sync
            }
        }

        // Upload to Cloudinary if needed
        if (user && (!user.profileImage || !user.profileImage.url) && avatar) {
            try {
                const result = await uploadRemoteImageToCloudinary(avatar, `users/${user._id}/avatar`);
                if (result) {
                    await User.findByIdAndUpdate(
                        user._id, {
                            $set: {
                                profileImage: {
                                    url: result.secure_url,
                                    publicId: result.public_id,
                                    uploadedAt: new Date()
                                }
                            }
                        }, { runValidators: false }
                    );
                    user.profileImage = { url: result.secure_url }; // keep local ref in sync
                }
            } catch (e) {
                console.warn("Cloudinary upload failed on login", e.message);
            }
        }

        // Re-fetch the latest user from DB to get fresh data for the token
        const freshUser = await User.findById(user._id);
        const token = signAuthToken(freshUser || user);
        const cs = await cookies();
        cs.set("sitecraft_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        if ((freshUser || user).isRootSuperAdmin && (freshUser || user).role === 'super-admin') {
            const finalUser = freshUser || user;
            if (!finalUser.primaryPurpose) {
                await User.findByIdAndUpdate(
                    finalUser._id, { $set: { primaryPurpose: 'agency', selectedPurposes: ['agency'], accountPurpose: 'agency' } }, { runValidators: false }
                );
            }
            return NextResponse.redirect(`${baseUrl}/dashboard`);
        }

        const finalPurpose = (freshUser || user).primaryPurpose;
        const finalSelected = (freshUser || user).selectedPurposes;
        if (!finalPurpose || !finalSelected || finalSelected.length === 0) {
            return NextResponse.redirect(`${baseUrl}/auth/account-purpose?from=google`);
        }

        return NextResponse.redirect(`${baseUrl}/dashboard`);
    } catch (err) {
        console.error("Google callback error:", err);
        return NextResponse.redirect(`${baseUrl}/login`);
    }
}