import { generateGeminiJSON } from "@/lib/ai/geminiService";
import { filterAllowedThemes, applyThemePlanLimit } from "@/lib/themes/themePlanLimits";

/**
 * Generate a hash of available themes for cache invalidation
 */
function generateThemesHash(themes) {
  if (!Array.isArray(themes)) return "";
  const ids = themes.map((t) => t.themeId).sort().join("|");
  return require("crypto")
    .createHash("md5")
    .update(ids)
    .digest("hex");
}

/**
 * Fallback theme ranking when AI fails or is disabled
 */
function fallbackThemeRanking(availableThemes, selectedPurpose) {
  const themes = [...availableThemes];

  // Sort by: purpose match → admin sortOrder → manual priority score
  themes.sort((a, b) => {
    // 1. Match recommended purposes
    const aMatches = a.recommendedPurposes?.includes(selectedPurpose) ? 1 : 0;
    const bMatches = b.recommendedPurposes?.includes(selectedPurpose) ? 1 : 0;
    if (aMatches !== bMatches) return bMatches - aMatches;

    // 2. Admin sort order
    const aSort = a.sortOrder || 0;
    const bSort = b.sortOrder || 0;
    if (aSort !== bSort) return aSort - bSort;

    // 3. Manual priority score
    const aPriority = a.manualPriorityScore || 0;
    const bPriority = b.manualPriorityScore || 0;
    if (aPriority !== bPriority) return bPriority - aPriority;

    return 0;
  });

  return {
    recommendedThemeIds: themes.map((t) => t.themeId),
    reasoning: {
      method: "fallback",
      rules: [
        "Purpose match",
        "Admin sort order",
        "Manual priority score",
      ],
    },
    fallbackUsed: true,
  };
}

/**
 * Build AI prompt for theme recommendations
 */
function buildThemeRecommendationPrompt(
  selectedPurpose,
  availableThemes,
  personalInfo,
  userPlan
) {
  const themeSummary = availableThemes
    .map(
      (t) => `
- ${t.name} (ID: ${t.themeId}):
  Description: ${t.description || "No description"}
  Colors: Primary ${t.colors?.primary || "N/A"}, Secondary ${t.colors?.secondary || "N/A"}
  Recommended for: ${t.recommendedPurposes?.join(", ") || "General use"}
  Manual Priority: ${t.manualPriorityScore || 0}
`
    )
    .join("\n");

  const sharedInfo = personalInfo?.sharedInfo || {};
  const purposeInfo = personalInfo?.purposeInfo?.[selectedPurpose] || {};

  return `You are an expert theme designer and UX specialist. Your task is to recommend the best website themes from a curated list based on the user's specific needs and preferences.

USER CONTEXT:
- Subscription Plan: ${userPlan} (limits how many themes to recommend)
- Selected Purpose/Category: ${selectedPurpose}
- Business/Personal Info:
  - Name: ${sharedInfo.displayName || sharedInfo.fullName || "Not provided"}
  - Location: ${sharedInfo.location || "Not provided"}
  - Bio: ${sharedInfo.bio || "Not provided"}
  - Brand Logo: ${sharedInfo.brandLogo ? "Yes" : "No"}
  - Website URL: ${sharedInfo.websiteUrl || "Not provided"}
  - Social Links: ${Object.entries(sharedInfo.socialLinks || {})
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(", ") || "None"}

PURPOSE-SPECIFIC INFO:
${JSON.stringify(purposeInfo, null, 2)}

AVAILABLE THEMES:
${themeSummary}

INSTRUCTIONS:
1. Analyze which themes best match the user's purpose and personal information
2. Consider the theme descriptions, colors, and recommended purposes
3. Rank themes by suitability for the ${selectedPurpose} category
4. Prioritize themes with manual priority scores (indicates admin preference)
5. Return theme IDs in order of recommendation (best first)

IMPORTANT:
- Only recommend from the available themes listed above
- Never invent theme IDs not in the list
- Return your response as valid JSON matching this exact structure:
{
  "recommendedThemeIds": ["themeId1", "themeId2", ...],
  "reasoning": {
    "topThemeReason": "Why the first theme is best",
    "secondaryConsiderations": "Why other themes ranked as they did",
    "personalInfoApplied": "How user's personal info influenced recommendations"
  }
}

Respond with ONLY the JSON, no additional text.`;
}

/**
 * Call Gemini API to get AI-powered theme recommendations
 */
async function getAIThemeRecommendations(
  availableThemes,
  selectedPurpose,
  personalInfo,
  userPlan
) {
  if (!availableThemes || availableThemes.length === 0) {
    return null;
  }

  try {
    const prompt = buildThemeRecommendationPrompt(
      selectedPurpose,
      availableThemes,
      personalInfo,
      userPlan
    );

    const result = await generateGeminiJSON(prompt);

    if (!result.success) {
      console.warn("Gemini recommendation failed:", result);
      return null;
    }

    const data = result.data;

    // Validate AI response
    if (
      !Array.isArray(data.recommendedThemeIds) ||
      data.recommendedThemeIds.length === 0
    ) {
      console.warn("Invalid AI response structure");
      return null;
    }

    // Validate all returned theme IDs exist in available themes
    const availableIds = availableThemes.map((t) => t.themeId);
    const validIds = data.recommendedThemeIds.filter((id) =>
      availableIds.includes(id)
    );

    if (validIds.length === 0) {
      console.warn("AI returned no valid theme IDs");
      return null;
    }

    return {
      recommendedThemeIds: validIds,
      reasoning: data.reasoning || {},
      fallbackUsed: false,
    };
  } catch (error) {
    console.error("Error calling Gemini for theme recommendations:", error);
    return null;
  }
}

/**
 * Main function to recommend themes for a user
 * @param {Object} options - Configuration object
 * @param {Object} options.user - User object with plan, _id
 * @param {Array} options.availableThemes - Themes available for selection
 * @param {Object} options.personalInfo - User's personal info
 * @param {string} options.selectedPurpose - User's selected purpose
 * @param {boolean} options.skipAI - Skip AI and use fallback
 * @returns {Object} - Recommendation result with theme IDs
 */
export async function recommendThemesForUser({
  user,
  availableThemes,
  personalInfo,
  selectedPurpose,
  skipAI = false,
}) {
  // Safety: ensure we only work with allowed themes
  const allowedThemes = filterAllowedThemes(availableThemes);

  if (allowedThemes.length === 0) {
    return {
      recommendedThemeIds: [],
      reasoning: { error: "No themes available" },
      fallbackUsed: false,
      source: "error",
    };
  }

  // Try AI recommendation if not skipped
  if (!skipAI) {
    const aiResult = await getAIThemeRecommendations(
      allowedThemes,
      selectedPurpose,
      personalInfo,
      user?.plan
    );

    if (aiResult) {
      return {
        ...aiResult,
        source: "ai",
        availableThemeHash: generateThemesHash(allowedThemes),
      };
    }
  }

  // Fallback to deterministic ranking
  const fallbackResult = fallbackThemeRanking(allowedThemes, selectedPurpose);

  return {
    ...fallbackResult,
    source: "fallback",
    availableThemeHash: generateThemesHash(allowedThemes),
  };
}
