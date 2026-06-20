import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import Theme from "@/models/Theme";
import dbConnect from "@/lib/dbConnect";
import { getThemeUsage, invalidateAllThemeRecommendations } from "@/lib/themes/themeService";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

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

    // Invalidate recommendation cache when theme availability changes
    if (body.hasOwnProperty("isAvailable") || body.hasOwnProperty("isActive") || body.hasOwnProperty("isLocked")) {
      await invalidateAllThemeRecommendations();
      
      // Emit realtime event to all users
      try {
        await realtimeEmitter.emitToAll(
          REALTIME_EVENTS.THEME.LIST_REFRESH,
          {
            title: "Theme Availability Changed",
            message: "Theme availability has been updated. Your theme list was refreshed.",
            themeId,
          }
        );
      } catch (error) {
        console.error("Failed to emit realtime event:", error);
      }
    }

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
