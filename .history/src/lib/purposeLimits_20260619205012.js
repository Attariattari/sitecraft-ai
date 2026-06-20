export const PLAN_LIMITS = {
  free: 1,
  basic: 2,
  pro: 4,
  agency: Infinity,
};

export const SUPPORTED_PURPOSES = [
  "portfolio",
  "business",
  "salon",
  "ecommerce",
  "restaurant",
  "clinic",
  "realEstate",
  "agency",
  "school",
  "landingPage",
];

/**
 * Returns the maximum number of purposes allowed for a given plan.
 */
export function getPurposeLimitByPlan(plan = "free") {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

/**
 * Checks if a user can select more purposes or update their selection.
 */
export function canSelectPurpose(user, nextPurposesCount) {
  const limit = getPurposeLimitByPlan(user.plan);
  return nextPurposesCount <= limit;
}

/**
 * Returns the allowed purpose count for a user based on their plan.
 */
export function getAllowedPurposeCount(user) {
  return getPurposeLimitByPlan(user.plan);
}

/**
 * Normalizes user purposes for migration and consistency.
 */
export function normalizeUserPurposes(user) {
  let primary = user.primaryPurpose || user.accountPurpose || "";
  let selected = user.selectedPurposes || [];

  if (primary && !selected.includes(primary)) {
    selected = [primary, ...selected];
  }

  // Enforce plan limits
  const limit = getPurposeLimitByPlan(user.plan);
  if (selected.length > limit) {
    selected = selected.slice(0, limit);
    if (!selected.includes(primary)) {
      primary = selected[0] || "";
    }
  }

  return { primary, selected };
}

/**
 * Checks if a specific purpose is allowed for a user.
 */
export function isPurposeAllowedForUser(user, purpose) {
  if (!user || !purpose) return false;
  const selected = user.selectedPurposes || [];
  return selected.includes(purpose);
}
