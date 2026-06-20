/**
 * Theme Plan Limits Utility
 * Centralized plan-based theme visibility and limit logic
 */

const PLAN_LIMITS = {
  free: 1,
  basic: 4,
  pro: 10,
  agency: Infinity,
};

/**
 * Get the theme limit for a user plan
 * @param {string} plan - User subscription plan
 * @returns {number} - Maximum number of themes user can see
 */
export function getThemeLimitByPlan(plan) {
  return PLAN_LIMITS[plan] || 1;
}

/**
 * Apply plan limit to a list of themes
 * @param {Array} themes - Array of theme objects
 * @param {string} plan - User subscription plan
 * @returns {Array} - Sliced themes based on plan limit
 */
export function applyThemePlanLimit(themes, plan) {
  if (!Array.isArray(themes)) {
    return [];
  }

  const limit = getThemeLimitByPlan(plan);
  if (limit === Infinity) {
    return themes;
  }

  return themes.slice(0, limit);
}

/**
 * Check if a user can access a specific theme
 * @param {Object} user - User object with plan and _id
 * @param {Object} theme - Theme object with themeId
 * @param {Array} userAccessibleThemeIds - List of theme IDs user can access
 * @returns {boolean} - Whether user can access the theme
 */
export function canUserAccessTheme(user, theme, userAccessibleThemeIds = []) {
  if (!user || !theme) {
    return false;
  }

  // Agency users can access all themes
  if (user.plan === "agency") {
    return true;
  }

  // Non-agency users can only access themes in their accessible list
  return userAccessibleThemeIds.includes(theme.themeId || theme._id?.toString());
}

/**
 * Get allowed theme count for a user
 * @param {Object} user - User object with plan
 * @returns {number} - Number of themes user is allowed to see
 */
export function getAllowedThemeCount(user) {
  if (!user || !user.plan) {
    return 1;
  }

  return getThemeLimitByPlan(user.plan);
}

/**
 * Filter themes to only allowed/available ones for user-facing contexts
 * @param {Array} themes - Array of theme objects
 * @returns {Array} - Filtered themes (active, available, not locked)
 */
export function filterAllowedThemes(themes) {
  if (!Array.isArray(themes)) {
    return [];
  }

  return themes.filter((theme) => {
    return (
      theme.isActive === true &&
      theme.isAvailable === true &&
      theme.isLocked !== true
    );
  });
}

/**
 * Get plan display label
 * @param {string} plan - User subscription plan
 * @returns {string} - Display label
 */
export function getPlanLabel(plan) {
  const labels = {
    free: "Free",
    basic: "Basic",
    pro: "Pro",
    agency: "Agency",
  };
  return labels[plan] || "Unknown";
}

/**
 * Get theme limit description for UI display
 * @param {string} plan - User subscription plan
 * @returns {string} - Human-readable limit description
 */
export function getThemeLimitDescription(plan) {
  const limit = getThemeLimitByPlan(plan);
  if (limit === Infinity) {
    return `You can access all available themes.`;
  }
  return `You can access ${limit} AI-recommended theme${limit === 1 ? "" : "s"} on the ${getPlanLabel(plan)} plan.`;
}
