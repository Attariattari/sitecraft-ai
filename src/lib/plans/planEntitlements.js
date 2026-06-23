export const PLAN_SLUGS = ["free", "basic", "pro", "agency"];

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
    description: "For testing SiteCraft AI and creating a basic first website.",
    bestFor: "Trying the platform",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "USD",
    isPopular: false,
    isActive: true,
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
      mediaUploads: 10,
    },
    highlights: [
      "AI website generation basic",
      "1 website",
      "1 theme",
      "Limited templates",
      "Basic personal info system",
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
      "AI website generation",
      "Up to 3 websites",
      "4 themes",
      "More templates",
      "Basic SEO metadata",
      "Cloudinary media upload",
    ],
  },
  {
    name: "Pro",
    slug: "pro",
    description: "For creators, freelancers, agencies starting out, and growing businesses.",
    bestFor: "Serious creators and growing businesses",
    priceMonthly: 29,
    priceYearly: 290,
    currency: "USD",
    isPopular: true,
    isActive: true,
    sortOrder: 3,
    ctaLabel: "Upgrade to Pro",
    badge: "Most popular",
    features: {
      ...baseFeatures,
      aiWebsiteGeneration: true,
      advancedAIGeneration: true,
      personalInfoSystem: true,
      purposeBasedGeneration: true,
      templateAccess: true,
      themeAccess: true,
      aiThemeSuggestion: true,
      platformThemeToggle: true,
      websitePreview: true,
      websitePublishing: true,
      customDomain: true,
      seoCenter: true,
      analytics: true,
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
      storageMB: 2048,
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
      "AI theme suggestion",
      "Custom domains",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    slug: "agency",
    description: "For agencies, teams, and client website work.",
    bestFor: "Agencies and client teams",
    priceMonthly: 79,
    priceYearly: 790,
    currency: "USD",
    isPopular: false,
    isActive: true,
    sortOrder: 4,
    ctaLabel: "Contact Sales",
    badge: "Scale",
    features: {
      ...baseFeatures,
      aiWebsiteGeneration: true,
      advancedAIGeneration: true,
      personalInfoSystem: true,
      purposeBasedGeneration: true,
      templateAccess: true,
      themeAccess: true,
      aiThemeSuggestion: true,
      platformThemeToggle: true,
      websitePreview: true,
      websitePublishing: true,
      customDomain: true,
      seoCenter: true,
      analytics: true,
      mediaUpload: true,
      removeBranding: true,
      exportWebsite: true,
      teamCollaboration: true,
      agencyWorkspace: true,
      prioritySupport: true,
      whiteLabel: true,
      advancedSupport: true,
    },
    limits: {
      websites: -1,
      themes: -1,
      templates: -1,
      aiCreditsPerMonth: 5000,
      storageMB: 10240,
      customDomains: -1,
      teamMembers: 10,
      projects: -1,
      supportTickets: -1,
      mediaUploads: -1,
    },
    highlights: [
      "Unlimited or high-limit websites",
      "All available themes",
      "All templates",
      "Agency workspace",
      "Team collaboration",
      "White label option",
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
  { label: "Custom domain", key: "customDomain", type: "feature" },
  { label: "SEO tools", key: "seoCenter", type: "feature" },
  { label: "Analytics", key: "analytics", type: "feature" },
  { label: "Media uploads", key: "mediaUpload", type: "feature" },
  { label: "Remove branding", key: "removeBranding", type: "feature" },
  { label: "Team collaboration", key: "teamCollaboration", type: "feature" },
  { label: "Agency workspace", key: "agencyWorkspace", type: "feature" },
  { label: "Priority support", key: "prioritySupport", type: "feature" },
  { label: "White label", key: "whiteLabel", type: "feature" },
];

export function normalizePlanSlug(planSlug) {
  return PLAN_SLUGS.includes(planSlug) ? planSlug : "free";
}

export function getPlanBySlug(planSlug) {
  const slug = normalizePlanSlug(planSlug);
  return DEFAULT_PLANS.find((plan) => plan.slug === slug) || DEFAULT_PLANS[0];
}

export function getUserPlanSlug(user) {
  return normalizePlanSlug(user?.subscription?.planSlug || user?.plan);
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
  if (limit === -1) return true;
  if (typeof limit !== "number") return false;
  return Number(currentUsage || 0) < limit;
}

export function getNextPlanForFeature(featureKey, currentPlanSlug = "free") {
  const currentIndex = PLAN_SLUGS.indexOf(normalizePlanSlug(currentPlanSlug));
  const match = DEFAULT_PLANS.find((plan, index) => {
    return index > currentIndex && Boolean(plan.features[featureKey]);
  });
  return match?.slug || "agency";
}

export function getNextPlanForLimit(limitKey, currentPlanSlug = "free", currentUsage = 0) {
  const currentIndex = PLAN_SLUGS.indexOf(normalizePlanSlug(currentPlanSlug));
  const match = DEFAULT_PLANS.find((plan, index) => {
    if (index <= currentIndex) return false;
    const limit = plan.limits[limitKey];
    return limit === -1 || Number(currentUsage || 0) < limit;
  });
  return match?.slug || "agency";
}

export function getUpgradeRequiredMessage(featureKey) {
  const labels = {
    customDomain: "Your current plan does not include custom domains.",
    analytics: "Your current plan does not include analytics.",
    teamCollaboration: "Your current plan does not include team collaboration.",
    agencyWorkspace: "Your current plan does not include agency workspace tools.",
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

export function formatLimitValue(value, allLabel = "Unlimited") {
  if (value === -1) return allLabel;
  if (typeof value === "boolean") return value ? "Included" : "Not included";
  return String(value);
}

export function getPlanComparison() {
  return {
    plans: DEFAULT_PLANS,
    rows: COMPARISON_ROWS.map((row) => ({
      ...row,
      values: DEFAULT_PLANS.reduce((acc, plan) => {
        acc[plan.slug] = row.type === "feature"
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
    sortOrder: plan.sortOrder,
    features: plan.features,
    limits: plan.limits,
    ctaLabel: plan.ctaLabel,
    badge: plan.badge,
    highlights: plan.highlights || [],
  };
}
