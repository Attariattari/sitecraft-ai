import { siteCraftPersonalInfoCategories, siteCraftTemplates } from "./data";

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
 * Resolves the primary account purpose from the user object, fallback to default.
 */
export function getUserAccountPurpose(user) {
  if (
    user &&
    user.accountPurpose &&
    ACCOUNT_PURPOSES.includes(user.accountPurpose)
  ) {
    return user.accountPurpose;
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("sitecraft_personal_info");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed.selectedCategory &&
          ACCOUNT_PURPOSES.includes(parsed.selectedCategory)
        ) {
          return parsed.selectedCategory;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return FALLBACK_PURPOSE;
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
  return config.label;
}

/**
 * Returns the dashboard copy configuration
 */
export function getDashboardCopy(accountPurpose) {
  const config = getAccountPurposeConfig(accountPurpose);
  return (
    config.dashboardCopy || {
      welcomeTitle: "Build your website",
      welcomeSubtitle: "Manage your details, services, and websites.",
      generateTitle: "Generate Your Website",
      generateSubtitle: "Create a stunning website for your needs.",
      personalInfoTitle: "Personal Information",
      personalInfoSubtitle: "Keep your details up to date.",
      emptyWebsiteMessage: "No websites yet.",
    }
  );
}

/**
 * Returns highly recommended themes based on the specific account purpose
 */
export function getRecommendedThemesForPurpose(accountPurpose) {
  // A mapping of categories to best themes
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
  const primary = siteCraftTemplates.filter(
    (t) => t.category === accountPurpose,
  );
  const others = siteCraftTemplates.filter(
    (t) => t.category !== accountPurpose,
  );
  return [...primary, ...others];
}

/**
 * Returns the specific sections and fields for personal info
 */
export function getCategoryPersonalInfoSections(accountPurpose) {
  const config = getAccountPurposeConfig(accountPurpose);
  return config.sections || [];
}
