export const PLAN_SLUGS = ["free", "basic", "pro", "agency"];
export const PUBLIC_PLAN_SLUGS = ["free", "basic", "pro"];

export const FEATURE_KEYS = [
  "aiWebsiteGeneration",
  "advancedAIGeneration",
  "personalInfoSystem",
  "purposeBasedGeneration",
  "templateAccess",
  "themeAccess",
  "aiThemeSuggestion",
  "platformThemeToggle",
  "websitePreview",
  "websitePublishing",
  "customDomain",
  "seoCenter",
  "analytics",
  "mediaUpload",
  "removeBranding",
  "exportWebsite",
  "teamCollaboration",
  "agencyWorkspace",
  "prioritySupport",
  "whiteLabel",
  "advancedSupport",
];

export const LIMIT_KEYS = [
  "websites",
  "themes",
  "templates",
  "aiCreditsPerMonth",
  "storageMB",
  "customDomains",
  "teamMembers",
  "projects",
  "supportTickets",
  "mediaUploads",
];

const baseFeatures = {
  aiWebsiteGeneration: false,
  advancedAIGeneration: false,
  personalInfoSystem: false,
  purposeBasedGeneration: false,
  templateAccess: false,
  themeAccess: false,
  aiThemeSuggestion: false,
  platformThemeToggle: false,
  websitePreview: false,
  websitePublishing: false,
  customDomain: false,
  seoCenter: false,
  analytics: false,
  mediaUpload: false,
  removeBranding: false,
  exportWebsite: false,
  teamCollaboration: false,
  agencyWorkspace: false,
  prioritySupport: false,
  whiteLabel: false,
  advancedSupport: false,
};

export const DEFAULT_PLANS = [
  {
    name: "Free",
    slug: "free",
    description: "For testing SiteCraft AI and creating a simple first website.",
    bestFor: "Trying the platform",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "USD",
    isPopular: false,
    isActive: true,
    isPublic: true,
    isPurchasable: true,
    status: "active",
    comingSoon: false,
    ctaType: "signup",
    sortOrder: 1,
    ctaLabel: "Start Free",
    badge: "Start here",
    features: {
      ...baseFeatures,
      aiWebsiteGeneration: true,
      personalInfoSystem: true,
      templateAccess: true,
      themeAccess: true,
      websitePreview: true,
      websitePublishing: true,
    },
    limits: {
      websites: 1,
      themes: 1,
      templates: 3,
      aiCreditsPerMonth: 50,
      storageMB: 100,
      customDomains: 0,
      teamMembers: 1,
      projects: 1,
      supportTickets: 1,
      mediaUploads: 20,
    },
    highlights: [
      "Basic AI website generation",
      "1 website",
      "1 theme",
      "Limited templates",
      "Basic personal info system",
      "Basic preview",
      "Basic dashboard",
      "Standard support",
      "SiteCraft branding enabled",
    ],
  },
  {
    name: "Basic",
    slug: "basic",
    description: "For personal brands, freelancers, and small businesses.",
    bestFor: "Personal brands and small businesses",
    priceMonthly: 12,
    priceYearly: 120,
    currency: "USD",
    isPopular: false,
    isActive: true,
    isPublic: true,
    isPurchasable: true,
    status: "active",
    comingSoon: false,
    ctaType: "checkout",
    sortOrder: 2,
    ctaLabel: "Upgrade to Basic",
    badge: "Personal",
    features: {
      ...baseFeatures,
      aiWebsiteGeneration: true,
      personalInfoSystem: true,
      purposeBasedGeneration: true,
      templateAccess: true,
      themeAccess: true,
      websitePreview: true,
      websitePublishing: true,
      seoCenter: true,
      mediaUpload: true,
    },
    limits: {
      websites: 3,
      themes: 4,
      templates: 10,
      aiCreditsPerMonth: 300,
      storageMB: 500,
      customDomains: 1,
      teamMembers: 1,
      projects: 3,
      supportTickets: 3,
      mediaUploads: 100,
    },
    highlights: [
      "Standard AI website generation",
      "Up to 3 websites",
      "4 themes",
      "More templates",
      "Full personal info system",
      "Purpose-based website generation",
      "Website preview and management",
      "Basic SEO metadata",
      "Cloudinary media upload",
      "Dashboard settings",
      "Standard support",
    ],
  },
  {
    name: "Pro",
    slug: "pro",
    description:
      "For serious creators, freelancers, growing businesses, and professionals who need more website capacity and stronger tools.",
    bestFor:
      "Professionals who want more websites, more themes, stronger AI usage, and growth-ready tools",
    priceMonthly: 29,
    priceYearly: 290,
    currency: "USD",
    isPopular: true,
    isActive: true,
    isPublic: true,
    isPurchasable: true,
    status: "active",
    comingSoon: false,
    ctaType: "checkout",
    sortOrder: 3,
    ctaLabel: "Upgrade to Pro",
    badge: "Best value",
    features: {
      ...baseFeatures,
      aiWebsiteGeneration: true,
      advancedAIGeneration: true,
      personalInfoSystem: true,
      purposeBasedGeneration: true,
      templateAccess: true,
      themeAccess: true,
      aiThemeSuggestion: true,
      websitePreview: true,
      websitePublishing: true,
      seoCenter: true,
      mediaUpload: true,
      removeBranding: true,
      prioritySupport: true,
      advancedSupport: true,
    },
    limits: {
      websites: 10,
      themes: 10,
      templates: 25,
      aiCreditsPerMonth: 1000,
      storageMB: 2000,
      customDomains: 5,
      teamMembers: 3,
      projects: 10,
      supportTickets: 10,
      mediaUploads: 500,
    },
    highlights: [
      "Advanced AI website generation",
      "Up to 10 websites",
      "10 themes",
      "Higher template access",
      "AI theme suggestion",
      "Advanced personal info system",
      "More media storage",
      "SEO center basic",
      "Priority support",
      "Advanced dashboard features",
    ],
  },
  {
    name: "Agency",
    slug: "agency",
    description: "Future workspace, team collaboration, and client workflow tools.",
    bestFor: "Future agency and client workflows",
    priceMonthly: 79,
    priceYearly: 790,
    currency: "USD",
    isPopular: false,
    isActive: false,
    isPublic: false,
    isPurchasable: false,
    status: "future",
    comingSoon: true,
    ctaType: "none",
    sortOrder: 4,
    ctaLabel: "Coming Later",
    badge: "Future",
    features: {
      ...baseFeatures,
      teamCollaboration: true,
      agencyWorkspace: true,
      whiteLabel: true,
    },
    limits: {
      websites: 25,
      themes: 15,
      templates: 40,
      aiCreditsPerMonth: 3000,
      storageMB: 10240,
      customDomains: 10,
      teamMembers: 10,
      projects: 25,
      supportTickets: 25,
      mediaUploads: 1000,
    },
    highlights: [
      "Future agency workspace",
      "Future team collaboration",
      "Future client workflow tools",
      "Future white label option",
    ],
  },
];

export const COMPARISON_ROWS = [
  { label: "AI website generation", key: "aiWebsiteGeneration", type: "feature" },
  { label: "Websites included", key: "websites", type: "limit" },
  { label: "Themes included", key: "themes", type: "limit" },
  { label: "Templates included", key: "templates", type: "limit" },
  { label: "AI credits/month", key: "aiCreditsPerMonth", type: "limit" },
  { label: "Personal Info system", key: "personalInfoSystem", type: "feature" },
  { label: "Purpose-based generation", key: "purposeBasedGeneration", type: "feature" },
  { label: "Website preview", key: "websitePreview", type: "feature" },
  { label: "Website publishing", key: "websitePublishing", type: "feature" },
  { label: "SEO tools", key: "seoCenter", type: "feature" },
  { label: "Media uploads", key: "mediaUpload", type: "feature" },
  { label: "Remove branding", key: "removeBranding", type: "feature" },
  { label: "Priority support", key: "prioritySupport", type: "feature" },
];

export function normalizePlanSlug(planSlug) {
  return PLAN_SLUGS.includes(planSlug) ? planSlug : "free";
}

export function normalizeActivePlanSlug(planSlug) {
  const slug = normalizePlanSlug(planSlug);
  return PUBLIC_PLAN_SLUGS.includes(slug) ? slug : "pro";
}

export function getPublicPlans() {
  return DEFAULT_PLANS.filter((plan) => plan.isActive && plan.isPublic);
}

export function getActivePlans() {
  return DEFAULT_PLANS.filter((plan) => plan.isActive);
}

export function getPurchasablePlans() {
  return DEFAULT_PLANS.filter(
    (plan) => plan.isActive && plan.isPublic && plan.isPurchasable,
  );
}

export function canUserSelectPlan(planSlug) {
  return getPurchasablePlans().some((plan) => plan.slug === planSlug);
}

export function getPlanBySlug(planSlug) {
  const slug = normalizeActivePlanSlug(planSlug);
  return DEFAULT_PLANS.find((plan) => plan.slug === slug) || DEFAULT_PLANS[0];
}

export function getInternalPlanBySlug(planSlug) {
  const slug = normalizePlanSlug(planSlug);
  return DEFAULT_PLANS.find((plan) => plan.slug === slug) || DEFAULT_PLANS[0];
}

export function getUserPlanSlug(user) {
  return normalizeActivePlanSlug(user?.subscription?.planSlug || user?.plan);
}

export function getPlanLimits(planSlug) {
  return getPlanBySlug(planSlug).limits;
}

export function getPlanFeatures(planSlug) {
  return getPlanBySlug(planSlug).features;
}

export function canUseFeature(user, featureKey) {
  const features = getPlanFeatures(getUserPlanSlug(user));
  return Boolean(features[featureKey]);
}

export function canUseLimit(user, limitKey, currentUsage = 0) {
  const limits = getPlanLimits(getUserPlanSlug(user));
  const limit = limits[limitKey];
  if (typeof limit !== "number") return false;
  return Number(currentUsage || 0) < limit;
}

export function getNextPlanForFeature(featureKey, currentPlanSlug = "free") {
  const plans = getPurchasablePlans();
  const currentIndex = plans.findIndex(
    (plan) => plan.slug === normalizeActivePlanSlug(currentPlanSlug),
  );
  const match = plans.find((plan, index) => {
    return index > currentIndex && Boolean(plan.features[featureKey]);
  });
  return match?.slug || "pro";
}

export function getNextPlanForLimit(limitKey, currentPlanSlug = "free", currentUsage = 0) {
  const plans = getPurchasablePlans();
  const currentIndex = plans.findIndex(
    (plan) => plan.slug === normalizeActivePlanSlug(currentPlanSlug),
  );
  const match = plans.find((plan, index) => {
    if (index <= currentIndex) return false;
    const limit = plan.limits[limitKey];
    return typeof limit === "number" && Number(currentUsage || 0) < limit;
  });
  return match?.slug || "pro";
}

export function getUpgradeRequiredMessage(featureKey) {
  const labels = {
    customDomain: "Custom domain tools are planned for future releases.",
    analytics: "Analytics tools are planned for future releases.",
    teamCollaboration: "Team collaboration tools are planned for future releases.",
    agencyWorkspace: "Advanced workspace tools are planned for future releases.",
    exportWebsite: "Your current plan does not include website export.",
    aiThemeSuggestion: "Your current plan does not include AI theme suggestions.",
  };

  return labels[featureKey] || "Your current plan does not include this feature.";
}

export function requireFeature(user, featureKey) {
  if (canUseFeature(user, featureKey)) {
    return { allowed: true };
  }

  const planSlug = getUserPlanSlug(user);
  return {
    allowed: false,
    code: "PLAN_FEATURE_REQUIRED",
    message: getUpgradeRequiredMessage(featureKey),
    upgradeTo: getNextPlanForFeature(featureKey, planSlug),
  };
}

export function requireLimit(user, limitKey, currentUsage = 0) {
  if (canUseLimit(user, limitKey, currentUsage)) {
    return { allowed: true };
  }

  const planSlug = getUserPlanSlug(user);
  return {
    allowed: false,
    code: "PLAN_LIMIT_REACHED",
    message: `Upgrade to create more ${limitKey}.`,
    upgradeTo: getNextPlanForLimit(limitKey, planSlug, currentUsage),
  };
}

export function formatLimitValue(value, allLabel = "High limit") {
  if (value === -1) return allLabel;
  if (typeof value === "boolean") return value ? "Included" : "Not included";
  return String(value);
}

export function getPlanComparison({ includeFuture = false } = {}) {
  const plans = includeFuture ? DEFAULT_PLANS : getPublicPlans();
  return {
    plans,
    rows: COMPARISON_ROWS.map((row) => ({
      ...row,
      values: plans.reduce((acc, plan) => {
        acc[plan.slug] =
          row.type === "feature"
            ? Boolean(plan.features[row.key])
            : plan.limits[row.key];
        return acc;
      }, {}),
    })),
  };
}

export function serializePublicPlan(plan) {
  return {
    name: plan.name,
    slug: plan.slug,
    description: plan.description,
    bestFor: plan.bestFor,
    priceMonthly: plan.priceMonthly,
    priceYearly: plan.priceYearly,
    currency: plan.currency,
    isPopular: plan.isPopular,
    isActive: plan.isActive,
    isPublic: plan.isPublic ?? true,
    isPurchasable: plan.isPurchasable ?? true,
    status: plan.status || "active",
    comingSoon: Boolean(plan.comingSoon),
    ctaType: plan.ctaType || "checkout",
    sortOrder: plan.sortOrder,
    features: plan.features,
    limits: plan.limits,
    ctaLabel: plan.ctaLabel,
    badge: plan.badge,
    benefits: plan.benefits || [],
    trialDays: plan.trialDays || 0,
    bonusMonths: plan.bonusMonths || 0,
    highlights: plan.highlights || [],
  };
}
