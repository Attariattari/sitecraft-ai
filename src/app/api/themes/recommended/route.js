import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getAvailableThemes } from "@/lib/themes/themeService";
import { recommendThemesForUser } from "@/lib/ai/themeRecommendationService";
import {
  applyThemePlanLimit,
  getAllowedThemeCount,
} from "@/lib/themes/themePlanLimits";
import dbConnect from "@/lib/dbConnect";
import ThemeRecommendation from "@/models/ThemeRecommendation";
import PersonalInfo from "@/models/PersonalInfo";

/**
 * GET /api/themes/recommended
 * 
 * Get AI-recommended themes for logged-in user based on their plan and selected purpose.
 * Caches recommendations to avoid calling AI on every page load.
 * 
 * Query Parameters:
 * - purpose: Selected purpose/category (required)
 * - skipCache: Force regenerate recommendation (optional)
 */
export async function GET(req) {
  try {
    const user = await getCurrentUser();

    // Require authenticated user
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const selectedPurpose = searchParams.get("purpose");
    const skipCache = searchParams.get("skipCache") === "true";

    if (!selectedPurpose) {
      return NextResponse.json(
        { success: false, message: "Missing required query parameter: purpose" },
        { status: 400 }
      );
    }

    const userPlan = user.plan || "free";
    const planLimit = getAllowedThemeCount(user);

    // Check for cached recommendation if not skipping cache
    let cachedRec = null;
    if (!skipCache) {
      cachedRec = await ThemeRecommendation.findOne({
        userId: user._id,
        selectedPurpose,
        plan: userPlan,
        expiresAt: { $gt: new Date() },
      }).lean();

      if (cachedRec) {
        return NextResponse.json({
          success: true,
          plan: userPlan,
          limit: planLimit,
          selectedPurpose,
          themes: cachedRec.recommendedThemeIds,
          source: "cache",
          cached: true,
        });
      }
    }

    // Get available themes from database (active, available, not locked)
    const availableThemes = await getAvailableThemes("generate");

    if (availableThemes.length === 0) {
      return NextResponse.json({
        success: true,
        plan: userPlan,
        limit: planLimit,
        selectedPurpose,
        themes: [],
        source: "empty",
        message: "No themes are currently available for your plan.",
      });
    }

    // Get user's personal info for AI recommendation context
    const personalInfo = await PersonalInfo.findOne({ userId: user._id }).lean();

    // Get AI recommendations
    const recommendation = await recommendThemesForUser({
      user,
      availableThemes,
      personalInfo,
      selectedPurpose,
      skipAI: false,
    });

    // Apply plan limit to recommendations
    const limitedThemeIds = applyThemePlanLimit(
      recommendation.recommendedThemeIds,
      userPlan
    );

    // Cache the recommendation
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await ThemeRecommendation.findOneAndUpdate(
      {
        userId: user._id,
        selectedPurpose,
        plan: userPlan,
      },
      {
        $set: {
          recommendedThemeIds: limitedThemeIds,
          reasoning: recommendation.reasoning,
          source: recommendation.source,
          availableThemeHash: recommendation.availableThemeHash,
          expiresAt,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      plan: userPlan,
      limit: planLimit,
      selectedPurpose,
      themes: limitedThemeIds,
      source: recommendation.source,
      cached: false,
    });
  } catch (error) {
    console.error("API themes/recommended error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
