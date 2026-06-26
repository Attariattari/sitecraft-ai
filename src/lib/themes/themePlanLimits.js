/**
 * Theme Plan Limits
 * Determines how many themes a user can access based on their plan
 */

import { getPlanLimits, getUserPlanSlug } from "@/lib/plans/planEntitlements";

/**
 * Get the number of themes allowed for a user's plan
 */
export function getThemeLimitByPlan(plan) {
  const limit = getPlanLimits(plan).themes;
  return limit || 1;
}

/**
 * Apply plan limit to themes array
 * Returns only the allowed number of themes based on user plan
 */
export function applyThemePlanLimit(themes, plan) {
  if (!Array.isArray(themes)) return [];
  
  const limit = getThemeLimitByPlan(plan);
  return themes.slice(0, limit);
}

/**
 * Get the allowed theme count for a user
 */
export function getAllowedThemeCount(user) {
  if (!user) return 1;
  return getThemeLimitByPlan(getUserPlanSlug(user));
}

/**
 * Check if user can access a specific theme
 * Based on plan and position in recommended list
 */
export function canUserAccessTheme(user, themeId, recommendedThemeIds = []) {
  if (!user) return false;
  
  const plan = getUserPlanSlug(user);
  const limit = getThemeLimitByPlan(plan);
  
  // Check if theme is in recommended list and within limit
  const themeIndex = recommendedThemeIds.indexOf(themeId);
  if (themeIndex === -1) return false; // Not in recommended list
  
  return themeIndex < limit;
}

/**
 * Format plan limit for display
 */
export function formatThemeLimitForDisplay(plan) {
  const limit = getThemeLimitByPlan(plan);
  
  const displays = {
    free: "1 AI-recommended theme",
    basic: "4 AI-recommended themes",
    pro: "10 AI-recommended themes",
  };
  
  return displays[plan] || `${limit} AI-recommended themes`;
}
