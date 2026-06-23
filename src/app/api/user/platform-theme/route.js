import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

/**
 * GET /api/user/platform-theme
 * 
 * Get logged-in user's platform theme preference
 */
export async function GET(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const dbUser = await User.findById(user.id).select("preferences.platformTheme");
    
    const platformTheme = dbUser?.preferences?.platformTheme || null;

    return NextResponse.json({
      success: true,
      theme: platformTheme,
      platformTheme,
    });
  } catch (error) {
    console.error("GET user platform-theme error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/platform-theme
 * 
 * Update logged-in user's platform theme preference
 * Request body:
 * {
 *   mode: "light" | "dark"
 * }
 */
export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();
    
    const { mode } = body;
    
    if (!["light", "dark"].includes(mode)) {
      return NextResponse.json(
        { success: false, message: "Invalid theme mode" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $set: { "preferences.platformTheme.mode": mode },
        $unset: {
          "preferences.platformTheme.lightThemeId": "",
          "preferences.platformTheme.darkThemeId": "",
        },
      },
      { new: true }
    ).select("preferences.platformTheme");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      platformTheme: updatedUser.preferences?.platformTheme,
    });
  } catch (error) {
    console.error("PATCH user platform-theme error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
