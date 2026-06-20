import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { isThemeSelectable } from "@/lib/themes/themeService";

/**
 * GET /api/user/theme-preference
 * 
 * Get the user's theme preference
 * 
 * Response:
 * {
 *   success: true,
 *   themeId: "emerald"
 * }
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
    const dbUser = await User.findById(user.id).select("preferences.defaultThemeId");
    
    const themeId = dbUser?.preferences?.defaultThemeId || "";

    return NextResponse.json({
      success: true,
      themeId,
    });
  } catch (error) {
    console.error("GET theme preference error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/theme-preference
 * 
 * Set the user's default theme preference for future generated websites
 * 
 * Request body:
 * {
 *   themeId: "emerald"
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   user: {...}
 * }
 */
export async function PATCH(req) {
  try {
    // 1. Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { themeId } = body;

    if (!themeId || typeof themeId !== "string") {
      return NextResponse.json(
        { success: false, message: "Theme ID is required" },
        { status: 400 }
      );
    }

    // 2. Validate theme is selectable (active, available, not locked)
    const isSelectable = await isThemeSelectable(themeId);
    if (!isSelectable) {
      return NextResponse.json(
        {
          success: false,
          message: "This theme is not available for your current plan.",
        },
        { status: 400 }
      );
    }

    // 3. Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        "preferences.defaultThemeId": themeId,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 4. Return updated user
    return NextResponse.json({
      success: true,
      user: updatedUser.toJSON ? updatedUser.toJSON() : updatedUser.toObject(),
    });
  } catch (error) {
    console.error("PATCH theme preference error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/theme-preference
 * 
 * Clear the user's default theme preference
 */
export async function DELETE(req) {
  try {
    // 1. Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // 2. Clear default theme
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        "preferences.defaultThemeId": "",
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Return updated user
    return NextResponse.json({
      success: true,
      user: updatedUser.toJSON ? updatedUser.toJSON() : updatedUser.toObject(),
    });
  } catch (error) {
    console.error("DELETE theme preference error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
