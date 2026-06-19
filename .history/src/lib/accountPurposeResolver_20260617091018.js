import { siteCraftPersonalInfoCategories } from "./data";

/**
 * Gets the user's account purpose with fallback
 * Priority:
 * 1. currentUser.accountPurpose from /api/auth/me
 * 2. saved localStorage category if user is not available
 * 3. default fallback: portfolio
 */
export function getUserAccountPurpose(user) {
  if (user?.accountPurpose) {
    return user.accountPurpose;
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("sitecraft_personal_info");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.selectedCategory) {
          return data.selectedCategory;
        }
      }
    } catch (err) {
      console.error("Error reading localStorage:", err);
    }
  }

  // Default fallback
  return "portfolio";
}

/**
 * Gets the category configuration for a given accountPurpose
 */
export function getAccountPurposeConfig(accountPurpose) {
  const purpose = accountPurpose || "portfolio";
  const config = siteCraftPersonalInfoCategories.find((cat) => cat.id === purpose);
  return config || siteCraftPersonalInfoCategories.find((cat) => cat.id === "portfolio");
}

/**
 * Gets the human-readable label for an account purpose
 */
export function getAccountPurposeLabel(accountPurpose) {
  const config = getAccountPurposeConfig(accountPurpose);
  return config?.label || "Portfolio";
}

/**
 * Gets dashboard copy (welcome message, titles, etc.) for a purpose
 */
export function getDashboardCopy(accountPurpose) {
  const config = getAccountPurposeConfig(accountPurpose);
  return config?.dashboardCopy || getDefaultDashboardCopy("portfolio");
}

/**
 * Gets category-specific templates (filters templates by category)
 */
export function getCategoryTemplates(accountPurpose, templates) {
  if (!templates || !Array.isArray(templates)) {
    return [];
  }
  return templates.filter((t) => t.category === accountPurpose);
}

/**
 * Gets category-specific Personal Info sections
 */
export function getCategoryPersonalInfoSections(accountPurpose) {
  const config = getAccountPurposeConfig(accountPurpose);
  return config?.sections || [];
}

/**
 * Gets recommended themes for a purpose
 */
export function getRecommendedThemesForPurpose(accountPurpose) {
  const purposeThemeMap = {
    portfolio: ["emerald", "modernDark", "royalBlue"],
    business: ["modernDark", "classicNavy", "goldenBrown"],
    salon: ["premiumPurple", "lavenderDream", "roséGold"],
    ecommerce: ["emerald", "modernDark", "vibrantPink"],
    restaurant: ["goldenBrown", "coralSunset", "teakwood"],
    clinic: ["classicNavy", "emerald", "minimalistGray"],
    realEstate: ["goldenBrown", "oceanBlue", "modernDark"],
    agency: ["cosmicGalaxy", "premiumPurple", "modernDark"],
    school: ["oceanBlue", "emerald", "mintyFresh"],
    landingPage: ["vibrantPink", "oceanBlue", "cosmicGalaxy"],
  };

  return purposeThemeMap[accountPurpose] || purposeThemeMap.portfolio;
}

/**
 * Gets AI context for generation prompt
 */
export function getAIContextForPurpose(accountPurpose) {
  const config = getAccountPurposeConfig(accountPurpose);
  return {
    label: config?.aiContextLabel || "Portfolio",
    purpose: config?.purpose || "Personal portfolio",
    description: config?.description || "",
  };
}

/**
 * Gets empty state message for a purpose
 */
export function getEmptyStateMessage(accountPurpose) {
  const label = getAccountPurposeLabel(accountPurpose);
  return `No ${label.toLowerCase()} websites yet.`;
}

/**
 * Gets CTA text for a purpose
 */
export function getGenerateCTAText(accountPurpose) {
  const purposeCTAMap = {
    portfolio: "Generate Portfolio",
    business: "Generate Business Website",
    salon: "Generate Salon Website",
    ecommerce: "Generate Store",
    restaurant: "Generate Restaurant Website",
    clinic: "Generate Clinic Website",
    realEstate: "Generate Property Website",
    agency: "Generate Agency Website",
    school: "Generate School Website",
    landingPage: "Generate Landing Page",
  };

  return purposeCTAMap[accountPurpose] || purposeCTAMap.portfolio;
}

/**
 * Default dashboard copy template (fallback)
 */
function getDefaultDashboardCopy(purpose) {
  const copyMap = {
    portfolio: {
      welcomeTitle: "Build your professional portfolio",
      welcomeSubtitle: "Manage your projects, skills, services, and portfolio websites.",
      generateTitle: "Generate Your Portfolio Website",
      generateSubtitle: "Create a stunning portfolio to showcase your work.",
      personalInfoTitle: "Portfolio Information",
      personalInfoSubtitle: "Keep your professional details up to date.",
      emptyWebsiteMessage: "No portfolio websites yet.",
      statsLabels: {
        total: "Portfolio Websites",
        published: "Published Portfolios",
        draft: "Draft Portfolios",
      },
    },
    business: {
      welcomeTitle: "Build your business website",
      welcomeSubtitle: "Manage your services, testimonials, and business websites.",
      generateTitle: "Generate Your Business Website",
      generateSubtitle: "Create a professional website for your business.",
      personalInfoTitle: "Business Information",
      personalInfoSubtitle: "Keep your business details current.",
      emptyWebsiteMessage: "No business websites yet.",
      statsLabels: {
        total: "Business Websites",
        published: "Published Sites",
        draft: "Draft Sites",
      },
    },
    salon: {
      welcomeTitle: "Build your salon website",
      welcomeSubtitle: "Manage services, pricing, staff, gallery, offers, and booking-ready websites.",
      generateTitle: "Generate Your Salon Website",
      generateSubtitle: "Create a beautiful website to attract clients.",
      personalInfoTitle: "Salon Information",
      personalInfoSubtitle: "Manage your salon details and services.",
      emptyWebsiteMessage: "No salon websites yet.",
      statsLabels: {
        total: "Salon Websites",
        published: "Published Salons",
        draft: "Draft Salons",
      },
    },
    ecommerce: {
      welcomeTitle: "Build your online store",
      welcomeSubtitle: "Manage products, categories, policies, offers, and store-ready websites.",
      generateTitle: "Generate Your Store Website",
      generateSubtitle: "Create an online store to sell your products.",
      personalInfoTitle: "Store Information",
      personalInfoSubtitle: "Manage your store and product details.",
      emptyWebsiteMessage: "No store websites yet.",
      statsLabels: {
        total: "Store Websites",
        published: "Published Stores",
        draft: "Draft Stores",
      },
    },
    restaurant: {
      welcomeTitle: "Build your restaurant website",
      welcomeSubtitle: "Manage menus, reservations, offers, and restaurant websites.",
      generateTitle: "Generate Your Restaurant Website",
      generateSubtitle: "Create a website to showcase your restaurant.",
      personalInfoTitle: "Restaurant Information",
      personalInfoSubtitle: "Keep your restaurant details updated.",
      emptyWebsiteMessage: "No restaurant websites yet.",
      statsLabels: {
        total: "Restaurant Websites",
        published: "Published Restaurants",
        draft: "Draft Restaurants",
      },
    },
    clinic: {
      welcomeTitle: "Build your clinic website",
      welcomeSubtitle: "Manage services, staff, doctors, appointments, and clinic websites.",
      generateTitle: "Generate Your Clinic Website",
      generateSubtitle: "Create a professional website for your clinic.",
      personalInfoTitle: "Clinic Information",
      personalInfoSubtitle: "Manage your clinic details and staff.",
      emptyWebsiteMessage: "No clinic websites yet.",
      statsLabels: {
        total: "Clinic Websites",
        published: "Published Clinics",
        draft: "Draft Clinics",
      },
    },
    realEstate: {
      welcomeTitle: "Build your real estate website",
      welcomeSubtitle: "Manage properties, listings, agents, and real estate websites.",
      generateTitle: "Generate Your Real Estate Website",
      generateSubtitle: "Create a website to showcase your properties.",
      personalInfoTitle: "Real Estate Information",
      personalInfoSubtitle: "Keep your property listings updated.",
      emptyWebsiteMessage: "No real estate websites yet.",
      statsLabels: {
        total: "Real Estate Websites",
        published: "Published Sites",
        draft: "Draft Sites",
      },
    },
    agency: {
      welcomeTitle: "Build your agency website",
      welcomeSubtitle: "Manage services, portfolio, team, clients, and agency websites.",
      generateTitle: "Generate Your Agency Website",
      generateSubtitle: "Create a professional website for your agency.",
      personalInfoTitle: "Agency Information",
      personalInfoSubtitle: "Manage your agency details and portfolio.",
      emptyWebsiteMessage: "No agency websites yet.",
      statsLabels: {
        total: "Agency Websites",
        published: "Published Agencies",
        draft: "Draft Agencies",
      },
    },
    school: {
      welcomeTitle: "Build your school website",
      welcomeSubtitle: "Manage programs, faculty, admissions, events, and school websites.",
      generateTitle: "Generate Your School Website",
      generateSubtitle: "Create an informative website for your school.",
      personalInfoTitle: "School Information",
      personalInfoSubtitle: "Keep your school information current.",
      emptyWebsiteMessage: "No school websites yet.",
      statsLabels: {
        total: "School Websites",
        published: "Published Schools",
        draft: "Draft Schools",
      },
    },
    landingPage: {
      welcomeTitle: "Build your landing page",
      welcomeSubtitle: "Create high-converting landing pages for campaigns and offers.",
      generateTitle: "Generate Your Landing Page",
      generateSubtitle: "Create a high-converting landing page.",
      personalInfoTitle: "Campaign Information",
      personalInfoSubtitle: "Manage your campaign details.",
      emptyWebsiteMessage: "No landing pages yet.",
      statsLabels: {
        total: "Landing Pages",
        published: "Published Pages",
        draft: "Draft Pages",
      },
    },
  };

  return copyMap[purpose] || copyMap.portfolio;
}
