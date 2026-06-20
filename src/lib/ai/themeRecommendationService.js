/**
 * Theme Recommendation Service
 * Handles AI and fallback theme recommendations
 */

import { generateGeminiJSON } from "./geminiService";
import { getAvailableThemes } from "@/lib/themes/themeService";
import { applyThemePlanLimit } from "@/lib/themes/themePlanLimits";
import Theme from "@/models/Theme";
import dbConnect from "@/lib/dbConnect";
import crypto from "crypto";

/**
 * Calculate hash of available theme IDs
 * Used to detect when theme availability changes
 */
export function calculateThemeHash(themeIds) {
  if (!Array.isArray(themeIds)) return "";
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(themeIds.sort()))
    .digest("hex");
}

/**
 * Get fallback theme ranking based on purpose and admin priority
 */
export function getFallbackThemeRanking(availableThemes, purpose) {
  // Sort by:
  // 1. recommendedPurposes match
  // 2. sortOrder (admin priority)
  // 3. Name

  return availableThemes.sort((a, b) => {
    const aPurposeMatch = a.recommendedPurposes
      ? a.recommendedPurposes.includes(purpose)
      : false;
    const bPurposeMatch = b.recommendedPurposes
      ? b.recommendedPurposes.includes(purpose)
      : false;

    // Priority: purpose match
    if (aPurposeMatch && !bPurposeMatch) return -1;
    if (!aPurposeMatch && bPurposeMatch) return 1;

    // Secondary: sortOrder
    const aSort = a.sortOrder || 0;
    const bSort = b.sortOrder || 0;
    if (aSort !== bSort) return aSort - bSort;

    // Tertiary: name
    return (a.name || "").localeCompare(b.name || "");
  });
}

/**
 * Validate AI-recommended theme IDs
 * Ensures all returned themes are available
 */
export function validateAIRecommendations(themeIds, availableThemeIds) {
  if (!Array.isArray(themeIds)) return [];

  // Filter out invalid theme IDs
  return themeIds.filter((id) => availableThemeIds.includes(id));
}

/**
 * Generate AI-powered theme recommendations
 * Prompts Gemini to rank themes based on user info
 */
export async function generateAIRecommendations(
  availableThemes,
  purpose,
  personalInfo,
  userInfo
) {
  if (!Array.isArray(availableThemes) || availableThemes.length === 0) {
    return { themeIds: [], reasoning: "", source: "fallback" };
  }

  try {
    // Build theme descriptions for Gemini
    const themeDescriptions = availableThemes
      .map(
        (t) =>
          `- ${t.themeId}: ${t.name} (${t.description || "Professional theme"})`
      )
      .join("\n");

    // Build user context
    const userContext = {
      purpose: purpose || "portfolio",
      personalInfo: {
        profession: personalInfo?.profession || userInfo?.role || "Professional",
        bio: personalInfo?.bio || userInfo?.name || "",
        company: personalInfo?.company || "",
        location: personalInfo?.location || "",
      },
    };

    // Create prompt for Gemini
    const prompt = `You are a design expert. Rank these themes for a ${userContext.purpose} website based on the user's profile.

Available themes:
${themeDescriptions}

User Profile:
- Purpose: ${userContext.purpose}
- Profession: ${userContext.personalInfo.profession}
- Bio: ${userContext.personalInfo.bio}
- Company: ${userContext.personalInfo.company}
- Location: ${userContext.personalInfo.location}

Return a JSON object with:
{
  "themeIds": ["themeId1", "themeId2", "themeId3"],
  "reasoning": "Brief explanation why these themes suit the user"
}

Rank up to 10 themes. Include only valid themeIds from the list above. Put best-fit themes first.`;

    const result = await generateGeminiJSON(prompt, 1);

    if (!result.success || !result.data?.themeIds) {
      console.log("AI recommendation failed, using fallback");
      return { themeIds: [], reasoning: "", source: "fallback" };
    }

    // Validate returned theme IDs
    const validatedIds = validateAIRecommendations(
      result.data.themeIds,
      availableThemes.map((t) => t.themeId)
    );

    return {
      themeIds: validatedIds,
      reasoning: result.data.reasoning || "",
      source: "ai",
    };
  } catch (error) {
    console.error("AI recommendation error:", error);
    return { themeIds: [], reasoning: "", source: "fallback" };
  }
}

/**
 * Get recommended themes for a user
 * Checks cache, generates AI recommendation if needed, applies plan limit
 */
export async function getRecommendedThemesForUser(
  userId,
  user,
  selectedPurpose,
  personalInfo,
  ThemeRecommendation
) {
  await dbConnect();

  const plan = user?.plan || "free";
  const purpose = selectedPurpose || user?.primaryPurpose || "portfolio";

  // 1. Get available themes from database
  const availableThemes = await getAvailableThemes("dashboard");
  if (availableThemes.length === 0) {
    return {
      themes: [],
      source: "fallback",
      limit: 1,
      cacheHit: false,
    };
  }

  const availableThemeIds = availableThemes.map((t) => t.themeId);
  const themeHash = calculateThemeHash(availableThemeIds);

  // 2. Check cache
  const cachedRec = await ThemeRecommendation.findOne({
    userId,
    selectedPurpose: purpose,
    plan,
    availableThemeHash: themeHash,
    expiresAt: { $gt: new Date() },
  }).lean();

  if (cachedRec) {
    // Validate cached theme IDs
    const validCachedIds = cachedRec.recommendedThemeIds.filter((id) =>
      availableThemeIds.includes(id)
    );

    if (validCachedIds.length > 0) {
      const recommendedThemes = availableThemes.filter((t) =>
        validCachedIds.includes(t.themeId)
      );

      return {
        themes: applyThemePlanLimit(recommendedThemes, plan),
        source: "cache",
        limit: plan === "agency" ? Infinity : parseInt(plan, 10),
        cacheHit: true,
      };
    }
  }

  // 3. Generate AI recommendation
  const aiResult = await generateAIRecommendations(
    availableThemes,
    purpose,
    personalInfo,
    user
  );

  let recommendedThemeIds = aiResult.themeIds;

  // 4. Fallback ranking if AI returned empty
  if (recommendedThemeIds.length === 0) {
    const fallbackThemes = getFallbackThemeRanking(availableThemes, purpose);
    recommendedThemeIds = fallbackThemes.map((t) => t.themeId);
  }

  // 5. Save to cache
  try {
    await ThemeRecommendation.findOneAndUpdate(
      {
        userId,
        selectedPurpose: purpose,
        plan,
      },
      {
        userId,
        selectedPurpose: purpose,
        plan,
        recommendedThemeIds,
        reasoning: aiResult.reasoning || "",
        source: aiResult.source,
        availableThemeHash: themeHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Failed to cache theme recommendation:", error);
  }

  // 6. Get full theme objects and apply plan limit
  const recommendedThemes = availableThemes.filter((t) =>
    recommendedThemeIds.includes(t.themeId)
  );

  return {
    themes: applyThemePlanLimit(recommendedThemes, plan),
    source: aiResult.source,
    limit: plan === "agency" ? Infinity : parseInt(plan, 10),
    cacheHit: false,
  };
}

/**
 * Invalidate theme recommendation cache
 * Called when theme availability changes or user updates info
 */
export async function invalidateThemeRecommendationCache(
  userId,
  ThemeRecommendation
) {
  try {
    await ThemeRecommendation.deleteMany({ userId });
  } catch (error) {
    console.error("Failed to invalidate theme recommendation cache:", error);
  }
}
