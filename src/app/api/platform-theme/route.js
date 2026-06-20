import { NextResponse } from "next/server";
import { getPlatformThemeForGuest } from "@/lib/platformThemeResolver";

/**
 * GET /api/platform-theme
 * 
 * Public endpoint - Returns the current Super Admin default platform theme
 * Used by guests and logged-in users without custom preference
 */
export async function GET(req) {
  try {
    const theme = await getPlatformThemeForGuest();
    
    return NextResponse.json({
      success: true,
      theme,
    });
  } catch (error) {
    console.error("GET platform-theme error:", error);
    return NextResponse.json(
      {
        success: true,
        theme: {
          lightThemeId: "white-green-orange",
          darkThemeId: "dark-slate-emerald",
          defaultMode: "system",
          allowUserOverride: true,
        },
      },
      { status: 200 }
    );
  }
}
