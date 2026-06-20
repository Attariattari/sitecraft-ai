import dbConnect from "@/lib/dbConnect";
import Theme from "@/models/Theme";
import ThemeRecommendation from "@/models/ThemeRecommendation";
import { getThemeLimitByPlan } from "@/lib/themes/themePlanLimits";

/**
 * Validate that a theme is accessible by a user
 * 
 * Checks:
 * 1. Theme exists
 * 2. Theme is active
 * 3. Theme is available
 * 4. Theme is not locked
 * 5. User plan allows this theme
 * 6. Theme is in user's recommended/allowed list (unless Agency plan)
 * 
 * @param {string} themeId - Theme ID to validate
 * @param {Object} user - User object with plan, _id
 * @returns {Object} - { valid: boolean, message: string, theme: Object }
 */
export async function validateThemeForUser(themeId, user) {
  if (!themeId || !user) {
    return {
      valid: false,
      message: "Invalid theme ID or user",
    };
  }

  try {
    await dbConnect();

    // 1. Check if theme exists
    const theme = await Theme.findOne({
      $or: [{ themeId }, { slug: themeId }],
    }).lean();

    if (!theme) {
      return {
        valid: false,
        message: "Theme not found",
      };
    }

    // 2. Check if theme is active
    if (!theme.isActive) {
      return {
        valid: false,
        message: "This theme is currently inactive.",
      };
    }

    // 3. Check if theme is available
    if (!theme.isAvailable) {
      return {
        valid: false,
        message: "This theme is not available for your plan.",
      };
    }

    // 4. Check if theme is locked
    if (theme.isLocked) {
      return {
        valid: false,
        message: `This theme is locked. ${theme.lockedReason || "Coming soon"}`,
      };
    }

    // 5. Agency users can access all themes
    if (user.plan === "agency") {
      return {
        valid: true,
        message: "Valid theme for agency user",
        theme,
      };
    }

    // 6. For non-agency users, check if theme is in their allowed recommendations
    // Get the user's current recommendation for their primary purpose
    const userPrimaryPurpose = user.primaryPurpose || "portfolio";

    const recommendation = await ThemeRecommendation.findOne({
      userId: user._id,
      selectedPurpose: userPrimaryPurpose,
      plan: user.plan,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (
      recommendation &&
      !recommendation.recommendedThemeIds.includes(theme.themeId)
    ) {
      const planLimit = getThemeLimitByPlan(user.plan);
      return {
        valid: false,
        message: `This theme is not available for your current plan. Your ${user.plan} plan includes ${planLimit} recommended theme${planLimit === 1 ? "" : "s"}.`,
      };
    }

    return {
      valid: true,
      message: "Valid theme for user",
      theme,
    };
  } catch (error) {
    console.error("Error validating theme for user:", error);
    return {
      valid: false,
      message: "Error validating theme access",
    };
  }
}

/**
 * Validate theme for website generation API
 * Call this before actually generating/saving a site with a theme
 * 
 * @param {string} themeId - Theme ID to validate
 * @param {Object} user - User object
 * @returns {Object} - Validation result
 */
export async function validateThemeForGeneration(themeId, user) {
  const validation = await validateThemeForUser(themeId, user);

  if (!validation.valid) {
    return validation;
  }

  // Additional checks for generation context
  if (!validation.theme.showInGenerate) {
    return {
      valid: false,
      message: "This theme is not available for website generation.",
    };
  }

  return {
    valid: true,
    message: "Theme is valid for generation",
    theme: validation.theme,
  };
}
