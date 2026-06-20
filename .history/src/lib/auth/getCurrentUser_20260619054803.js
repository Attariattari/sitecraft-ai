import { cookies } from "next/headers";
import { verifyAuthToken } from "./tokens";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get("sitecraft_token");
        const token = cookie ? cookie.value : null;

        if (!token) {
            return null;
        }

        const decoded = verifyAuthToken(token);
        if (!decoded) {
            return null;
        }

        await dbConnect();
        const user = await User.findById(decoded.userId).select("-password -__v");

        if (!user) {
            return null;
        }

        // Security Check: Invalidate session if version mismatch
        // This happens when a user is restricted or their session is revoked
        if (user.sessionVersion !== (decoded.sessionVersion || 0)) {
            return null;
        }

        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan,
            credits: user.credits,
            accountPurpose: user.accountPurpose,
            profileImage: user.profileImage,
            profile: user.profile,
            preferences: user.preferences,
            isEmailVerified: user.isEmailVerified,
            emailVerifiedAt: user.emailVerifiedAt,
            isRootSuperAdmin: user.isRootSuperAdmin ? ? false,
            status: user.status,
            sessionVersion: user.sessionVersion ? ? 0,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
        };
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}