import { NextResponse } from "next/server";
import { getAvailableThemes } from "@/lib/themes/themeService";

/**
 * Public API to fetch available themes based on context.
 * Enforces active and unlocked status.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const context = searchParams.get("context") || "generate";

    const themes = await getAvailableThemes(context);

    return NextResponse.json({
      success: true,
      themes,
    });
  } catch (error) {
    console.error("API Get available themes error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
