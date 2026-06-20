import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { name, profile, preferences } = body;

    await dbConnect();
    const dbUser = await User.findById(user.id);

    if (name) dbUser.name = name;

    if (profile) {
      dbUser.profile = {
        ...dbUser.profile.toObject(),
        ...profile,
      };
    }

    if (preferences) {
      dbUser.preferences = {
        ...dbUser.preferences.toObject(),
        ...preferences,
      };
    }

    await dbUser.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: dbUser._id,
        name: dbUser.name,
        profile: dbUser.profile,
        preferences: dbUser.preferences,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
