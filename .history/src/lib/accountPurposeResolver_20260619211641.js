import { siteCraftPersonalInfoCategories, siteCraftTemplates } from "./data";
import { getPurposeLimitByPlan } from "./purposeLimits";

export const ACCOUNT_PURPOSES = [
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

const FALLBACK_PURPOSE = "portfolio";

/**
 * Resolves the primary account purpose from the user object.
 */
export function getUserPrimaryPurpose(user) {
  if (
    user &&
    user.primaryPurpose &&
    ACCOUNT_PURPOSES.includes(user.primaryPurpose)
  ) {
    return user.primaryPurpose;
  }
  return (user && user.accountPurpose) || FALLBACK_PURPOSE;
}

/**
 * Returns all selected purposes for a user.
 */
export function getUserSelectedPurposes(user) {
  if (
    user &&
    Array.isArray(user.selectedPurposes) &&
    user.selectedPurposes.length > 0
  ) {
    return user.selectedPurposes;
  }
  const primary = getUserPrimaryPurpose(user);
  return [primary];
}

/**
 * Legacy support for components still using getUserAccountPurpose
 */
export function getUserAccountPurpose(user) {
  return getUserPrimaryPurpose(user);
}

/**
 * Returns the category configuration object from data.js
 */
export function getAccountPurposeConfig(accountPurpose) {
  const category = siteCraftPersonalInfoCategories.find(
    (c) => c.id === accountPurpose,
  );
  return (
    category ||
    siteCraftPersonalInfoCategories.find((c) => c.id === FALLBACK_PURPOSE)
  );
}

/**
 * Returns the display label for the account purpose
 */
export function getAccountPurposeLabel(accountPurpose) {
  const config = getAccountPurposeConfig(accountPurpose);
  return (config && config.label) || accountPurpose;
}

/**
 * Returns the dashboard copy configuration
 */
export function getDashboardCopy(accountPurpose) {
  const config = getAccountPurposeConfig(accountPurpose);
  const label = (config && config.label) || accountPurpose;
  return (
    (config && config.dashboardCopy) || {
      welcomeTitle: `Build your ${label} website`,
      welcomeSubtitle: `Manage your ${label.toLowerCase()} details, services, and websites.`,
      generateTitle: `Generate Your ${label} Website`,
      generateSubtitle: `Create a stunning website for your ${label.toLowerCase()} needs.`,
      personalInfoTitle: `${label} Information`,
      personalInfoSubtitle: "Keep your details up to date.",
      emptyWebsiteMessage: `No ${label.toLowerCase()} websites yet.`,
    }
  );
}

/**
 * Returns highly recommended themes based on the specific account purpose
 */
export function getRecommendedThemesForPurpose(accountPurpose) {
  const purposeThemes = {
    portfolio: [
      "emerald",
      "modernDark",
      "minimalBlack",
      "premiumPurple",
      "cleanMint",
      "pureMonochrome",
    ],
    business: [
      "warmBusiness",
      "corporateSlate",
      "emerald",
      "royalBlue",
      "financeEmerald",
    ],
    salon: [
      "fashionRose",
      "creativeGradient",
      "luxuryGold",
      "premiumPurple",
      "emerald",
    ],
    ecommerce: [
      "modernDark",
      "emerald",
      "royalBlue",
      "fashionRose",
      "creativeGradient",
    ],
    restaurant: [
      "restaurantWarm",
      "luxuryGold",
      "warmBusiness",
      "natureOrganic",
      "pureMonochrome",
    ],
    clinic: [
      "medicalClean",
      "cleanMint",
      "corporateSlate",
      "emerald",
      "natureOrganic",
    ],
    realEstate: [
      "realEstateElite",
      "luxuryGold",
      "corporateSlate",
      "royalBlue",
      "warmBusiness",
    ],
    agency: [
      "creativeStudio",
      "techNeon",
      "modernDark",
      "creativeGradient",
      "premiumPurple",
    ],
    school: [
      "educationCalm",
      "corporateSlate",
      "royalBlue",
      "natureOrganic",
      "cleanMint",
    ],
    landingPage: [
      "startupCoral",
      "techNeon",
      "emerald",
      "modernDark",
      "premiumPurple",
    ],
  };

  return purposeThemes[accountPurpose] || purposeThemes.portfolio;
}

/**
 * Returns templates related to a specific category, prioritizing them
 */
export function getCategoryTemplates(accountPurpose) {
  const allTemplates = siteCraftTemplates || [];
  const primary = allTemplates.filter((t) => t.category === accountPurpose);
  const others = allTemplates.filter((t) => t.category !== accountPurpose);
  return [...primary, ...others];
}

/**
 * Returns the plan-based purpose status for the UI
 */
export function getPurposeStatus(user) {
  const limit = getPurposeLimitByPlan((user && user.plan) || "free");
  const selected = getUserSelectedPurposes(user);
  return {
    limit,
    selectedCount: selected.length,
    isLimitReached: selected.length >= limit && limit !== Infinity,
  };
}
