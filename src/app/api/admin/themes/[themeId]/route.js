import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import Theme from "@/models/Theme";
import dbConnect from "@/lib/dbConnect";
import { getThemeUsage } from "@/lib/themes/themeService";

export async function PATCH(req, { params }) {
  try {
    const { themeId } = await params;
    const body = await req.json();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (user.role !== "super-admin" && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    await dbConnect();

    // Fetch existing theme
    const existingTheme = await Theme.findOne({ themeId });
    if (!existingTheme) {
      return NextResponse.json(
        { success: false, message: "Theme not found" },
        { status: 404 },
      );
    }

    // Protection rule: Block disabling or locking if theme is in use
    const isAttemptingToRestrict =
      (body.hasOwnProperty("isActive") && body.isActive === false) ||
      (body.hasOwnProperty("isAvailable") && body.isAvailable === false) ||
      (body.hasOwnProperty("isLocked") && body.isLocked === true);

    if (isAttemptingToRestrict) {
      const usageCount = await getThemeUsage(themeId);
      if (usageCount > 0) {
        return NextResponse.json(
          {
            success: false,
            message: `This theme is currently used by ${usageCount} existing website${usageCount > 1 ? "s" : ""} and cannot be locked or disabled.`,
            usageCount,
          },
          { status: 400 },
        );
      }
    }

    const updatedTheme = await Theme.findOneAndUpdate(
      { themeId },
      { $set: body },
      { new: true, runValidators: true },
    );

    return NextResponse.json({
      success: true,
      theme: updatedTheme,
    });
  } catch (error) {
    console.error("Admin API Update theme error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
