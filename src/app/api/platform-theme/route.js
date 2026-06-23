import { NextResponse } from "next/server";
import {
  FALLBACK_PLATFORM_THEME,
  getPlatformThemeForGuest,
} from "@/lib/platformThemeResolver";

/**
 * GET /api/platform-theme
 * 
 * Public endpoint - Returns the current Super Admin default platform theme
 * Used by guests and logged-in users without custom preference
 */
export async function GET(req) {
  try {
    const { source, theme } = await getPlatformThemeForGuest();
    
    return NextResponse.json({
      success: true,
      source,
      theme,
    });
  } catch (error) {
    console.error("GET platform-theme error:", error);
    return NextResponse.json(
      {
        success: true,
        source: "fallback",
        theme: FALLBACK_PLATFORM_THEME,
      },
      { status: 200 }
    );
  }
}
