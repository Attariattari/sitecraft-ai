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
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
