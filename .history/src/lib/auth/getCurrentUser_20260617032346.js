import { cookies } from "next/headers";
import { verifyAuthToken } from "./tokens";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("sitecraft_token") ? .value;

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

        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan,
            accountPurpose: user.accountPurpose,
            isEmailVerified: user.isEmailVerified,
        };
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}