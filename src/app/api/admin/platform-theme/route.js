import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import PlatformThemeSetting from "@/models/PlatformThemeSetting";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

/**
 * GET /api/admin/platform-theme
 * 
 * Super Admin only - Get current platform theme setting
 */
export async function GET(req) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    await dbConnect();
    const setting = await PlatformThemeSetting.getOrCreate();

    return NextResponse.json({
      success: true,
      setting,
    });
  } catch (error) {
    console.error("GET admin platform-theme error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/platform-theme
 * 
 * Super Admin only - Update global platform theme setting
 * Request body:
 * {
 *   lightThemeId: "white-gray",
 *   darkThemeId: "dark-slate",
 *   defaultMode: "light" | "dark" | "system",
 *   allowUserOverride: boolean
 * }
 */
export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    await dbConnect();
    const body = await req.json();

    const updated = await PlatformThemeSetting.updateSetting(body, user.id);

    // Emit realtime event for all clients
    try {
      await realtimeEmitter.emitToAll(
        REALTIME_EVENTS.PLATFORM_THEME.UPDATED,
        {
          title: "Platform Theme Updated",
          message: "The default platform theme has been updated.",
          setting: {
            lightThemeId: updated.lightThemeId,
            darkThemeId: updated.darkThemeId,
            defaultMode: updated.defaultMode,
            allowUserOverride: updated.allowUserOverride,
          },
        }
      );
    } catch (error) {
      console.warn("Failed to emit realtime event:", error);
      // Don't fail the request if realtime fails
    }

    return NextResponse.json({
      success: true,
      setting: updated,
      message: "Platform theme updated successfully",
    });
  } catch (error) {
    console.error("PATCH admin platform-theme error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
