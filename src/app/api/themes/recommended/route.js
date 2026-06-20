import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import PersonalInfo from "@/models/PersonalInfo";
import ThemeRecommendation from "@/models/ThemeRecommendation";
import { getRecommendedThemesForUser } from "@/lib/ai/themeRecommendationService";
import { getAllowedThemeCount } from "@/lib/themes/themePlanLimits";

/**
 * GET /api/themes/recommended
 * 
 * Get AI-recommended themes for the current user based on their plan and purpose
 * 
 * Query params:
 * - purpose: selected purpose (optional, uses user's primary purpose if not provided)
 * 
 * Response:
 * {
 *   success: true,
 *   plan: "free",
 *   limit: 1,
 *   selectedPurpose: "portfolio",
 *   themes: [...],
 *   source: "ai" | "fallback" | "cache"
 * }
 */
export async function GET(req) {
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

    const { searchParams } = new URL(req.url);
    const purpose = searchParams.get("purpose") || user.primaryPurpose || "portfolio";

    // 2. Get user's personal info if available
    let personalInfo = null;
    try {
      personalInfo = await PersonalInfo.findOne({ userId: user.id }).lean();
    } catch (error) {
      console.error("Failed to fetch personal info:", error);
    }

    // 3. Get recommended themes
    const result = await getRecommendedThemesForUser(
      user.id,
      user,
      purpose,
      personalInfo?.sharedInfo,
      ThemeRecommendation
    );

    // 4. Format response
    return NextResponse.json({
      success: true,
      plan: user.plan || "free",
      limit: getAllowedThemeCount(user),
      selectedPurpose: purpose,
      themes: result.themes,
      source: result.source,
    });
  } catch (error) {
    console.error("API Get recommended themes error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
