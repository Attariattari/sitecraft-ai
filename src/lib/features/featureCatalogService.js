import dbConnect from "@/lib/dbConnect";
import Feature from "@/models/Feature";
import {
  DEFAULT_PLANS,
  PLAN_SLUGS,
  PUBLIC_PLAN_SLUGS,
  formatLimitValue,
} from "@/lib/plans/planEntitlements";

export const FEATURE_CATEGORIES = [
  "ai_generation",
  "themes_templates",
  "dashboard_management",
  "seo_growth",
  "security_auth",
  "admin_controls",
  "agency_tools",
  "billing_plans",
  "media_content",
  "publishing",
];

export const FEATURE_STATUSES = ["available", "in_progress", "coming_soon"];

const labelByPlan = {
  free: "Basic",
  basic: "Standard",
  pro: "Advanced",
  agency: "Full",
};

const planFeature = (featureKey, limitKey, fallback = {}) =>
  PLAN_SLUGS.reduce((acc, slug) => {
    const plan = DEFAULT_PLANS.find((item) => item.slug === slug);
    const included = featureKey
      ? Boolean(plan?.features?.[featureKey])
      : Boolean(fallback[slug]);
    const limit =
      limitKey && plan?.limits ? plan.limits[limitKey] : undefined;

    acc[slug] = {
      included,
      label: included ? labelByPlan[slug] : "Upgrade",
      limitText: included
        ? limitKey
          ? formatLimitValue(limit, "High limit")
          : "Included"
        : "Not included",
    };
    return acc;
  }, {});

export const defaultFeatures = [
  {
    title: "AI Website Generation",
    slug: "ai-website-generation",
    featureKey: "aiWebsiteGeneration",
    shortDescription: "Generate a website foundation from purpose, profile, template, and theme inputs.",
    longDescription: "SiteCraft AI helps users move from a blank page to a structured website foundation with content direction, sections, and design-aware starting points.",
    category: "ai_generation",
    icon: "WandSparkles",
    status: "available",
    badge: "Core",
    isPopular: true,
    isHighlighted: true,
    plans: planFeature("aiWebsiteGeneration"),
    benefits: ["Generate a professional website foundation faster.", "Avoid starting from a blank page."],
    useCases: ["Creators launching fast", "Small businesses testing ideas"],
    ctaLabel: "Start Generating",
    ctaHref: "/generate",
    sortOrder: 1,
  },
  {
    title: "Purpose-Based Website Builder",
    slug: "purpose-based-website-builder",
    featureKey: "purposeBasedGeneration",
    shortDescription: "Use website purpose to guide generation, fields, templates, and content structure.",
    longDescription: "Purpose-aware generation keeps each workflow aligned with the visitor journey a portfolio, business, school, restaurant, or landing page needs.",
    category: "ai_generation",
    icon: "Grid3X3",
    status: "available",
    plans: planFeature("purposeBasedGeneration", null, { free: true, basic: true, pro: true, agency: true }),
    benefits: ["Creates more relevant website foundations."],
    useCases: ["Service websites", "Portfolios", "Landing pages"],
    sortOrder: 2,
  },
  {
    title: "Smart Personal Info System",
    slug: "smart-personal-info-system",
    featureKey: "personalInfoSystem",
    shortDescription: "Reuse global and purpose-specific information across website generation.",
    longDescription: "Personal information fields help generated websites feel less generic and reduce repeated input for returning users.",
    category: "dashboard_management",
    icon: "Fingerprint",
    status: "available",
    plans: planFeature("personalInfoSystem"),
    benefits: ["Improves personalization.", "Reduces repeated setup work."],
    sortOrder: 3,
  },
  {
    title: "Template Selection",
    slug: "template-selection",
    featureKey: "templateAccess",
    shortDescription: "Choose professional template structures matched to website purpose.",
    longDescription: "Templates guide page structure and section order while themes control visual identity.",
    category: "themes_templates",
    icon: "LayoutTemplate",
    status: "available",
    plans: planFeature("templateAccess", "templates"),
    benefits: ["Start from stronger layouts."],
    sortOrder: 4,
  },
  {
    title: "Dynamic Theme Engine",
    slug: "dynamic-theme-engine",
    featureKey: "themeAccess",
    shortDescription: "Apply plan-aware generated-site themes without changing the platform UI theme.",
    longDescription: "Website themes control generated website styling while the SiteCraft AI app follows the platform theme.",
    category: "themes_templates",
    icon: "Palette",
    status: "available",
    plans: planFeature("themeAccess", "themes"),
    benefits: ["Unlock more design flexibility as plans grow."],
    sortOrder: 5,
  },
  {
    title: "AI Theme Suggestion",
    slug: "ai-theme-suggestion",
    featureKey: "aiThemeSuggestion",
    shortDescription: "Recommend better-fit visual styles from website purpose and intent.",
    longDescription: "AI theme suggestions are designed to reduce design guesswork for advanced plan users.",
    category: "themes_templates",
    icon: "Sparkles",
    status: "in_progress",
    badge: "Pro Feature",
    plans: planFeature("aiThemeSuggestion"),
    benefits: ["Pick polished styles with less trial and error."],
    sortOrder: 6,
  },
  {
    title: "User Dashboard",
    slug: "user-dashboard",
    shortDescription: "Manage websites, profile, personal information, settings, and account areas.",
    longDescription: "The dashboard gives users one place to keep website work organized after generation.",
    category: "dashboard_management",
    icon: "LayoutDashboard",
    status: "available",
    plans: planFeature(null, null, { free: true, basic: true, pro: true, agency: true }),
    benefits: ["Centralizes ongoing website management."],
    sortOrder: 7,
  },
  {
    title: "Website Preview",
    slug: "website-preview",
    featureKey: "websitePreview",
    shortDescription: "Preview generated websites before publishing or continuing edits.",
    category: "publishing",
    icon: "PanelTop",
    status: "available",
    plans: planFeature("websitePreview"),
    benefits: ["Review the result before sharing."],
    sortOrder: 8,
  },
  {
    title: "Website Publishing",
    slug: "website-publishing",
    featureKey: "websitePublishing",
    shortDescription: "Publish generated websites through the SiteCraft AI workflow.",
    category: "publishing",
    icon: "Rocket",
    status: "available",
    plans: planFeature("websitePublishing"),
    benefits: ["Move from draft to public presence."],
    sortOrder: 9,
  },
  {
    title: "Protected Platform Theme System",
    slug: "protected-platform-theme-system",
    featureKey: "platformThemeToggle",
    shortDescription: "Keep the product interface consistent through protected platform settings.",
    category: "admin_controls",
    icon: "SlidersHorizontal",
    status: "available",
    publicVisible: false,
    pricingVisible: false,
    plans: planFeature("platformThemeToggle", null, { agency: true }),
    benefits: ["Keeps the product interface brand-consistent."],
    sortOrder: 10,
  },
  {
    title: "Protected Category Operations",
    slug: "protected-category-operations",
    shortDescription: "Keep purpose categories organized through protected platform operations.",
    category: "admin_controls",
    icon: "Tags",
    status: "available",
    publicVisible: false,
    pricingVisible: false,
    plans: planFeature(null, null, { agency: true }),
    benefits: ["Control which website purposes users can select."],
    sortOrder: 11,
  },
  {
    title: "Protected Theme Operations",
    slug: "protected-theme-operations",
    shortDescription: "Keep generated website themes organized through protected platform operations.",
    category: "admin_controls",
    icon: "Paintbrush",
    status: "available",
    publicVisible: false,
    pricingVisible: false,
    plans: planFeature(null, null, { agency: true }),
    benefits: ["Operate theme inventory professionally."],
    sortOrder: 12,
  },
  {
    title: "Secure Authentication",
    slug: "secure-authentication",
    shortDescription: "Protect accounts with verification, sessions, and role-aware access.",
    category: "security_auth",
    icon: "ShieldCheck",
    status: "available",
    plans: planFeature(null, null, { free: true, basic: true, pro: true, agency: true }),
    benefits: ["Separates public, user, and admin access."],
    sortOrder: 13,
  },
  {
    title: "Google OAuth",
    slug: "google-oauth",
    shortDescription: "Let users sign in with Google alongside email authentication.",
    category: "security_auth",
    icon: "KeyRound",
    status: "available",
    plans: planFeature(null, null, { free: true, basic: true, pro: true, agency: true }),
    benefits: ["Faster sign-in for users."],
    sortOrder: 14,
  },
  {
    title: "Cloudinary Media Support",
    slug: "cloudinary-media-support",
    featureKey: "mediaUpload",
    shortDescription: "Support managed profile and website media upload workflows.",
    category: "media_content",
    icon: "CloudUpload",
    status: "available",
    plans: planFeature("mediaUpload", "mediaUploads"),
    benefits: ["Adds room for richer website content."],
    sortOrder: 15,
  },
  {
    title: "SEO Metadata",
    slug: "seo-metadata",
    featureKey: "seoCenter",
    shortDescription: "Use SEO-ready page metadata and growth-oriented content structure.",
    category: "seo_growth",
    icon: "Search",
    status: "available",
    plans: planFeature("seoCenter"),
    benefits: ["Improve discoverability foundations."],
    sortOrder: 16,
  },
  {
    title: "Custom Domains",
    slug: "custom-domains",
    featureKey: "customDomain",
    shortDescription: "Connect professional domain names as plan limits allow.",
    category: "publishing",
    icon: "Globe2",
    status: "in_progress",
    badge: "Pro Feature",
    plans: planFeature("customDomain", "customDomains"),
    benefits: ["Use a professional website address."],
    sortOrder: 17,
  },
  {
    title: "Website Analytics",
    slug: "website-analytics",
    featureKey: "analytics",
    shortDescription: "Track website performance and growth signals.",
    category: "seo_growth",
    icon: "BarChart3",
    status: "in_progress",
    badge: "Pro Feature",
    plans: planFeature("analytics"),
    benefits: ["Understand what is working after launch."],
    sortOrder: 18,
  },
  {
    title: "Advanced Website Editor",
    slug: "advanced-website-editor",
    featureKey: "advancedAIGeneration",
    shortDescription: "Go deeper than initial generation with advanced editing workflows.",
    category: "dashboard_management",
    icon: "PencilRuler",
    status: "in_progress",
    badge: "Pro Feature",
    plans: planFeature("advancedAIGeneration"),
    benefits: ["Refine generated sites with more control."],
    sortOrder: 19,
  },
  {
    title: "Team Collaboration",
    slug: "team-collaboration",
    featureKey: "teamCollaboration",
    shortDescription: "Invite teammates into shared website workflows.",
    category: "agency_tools",
    icon: "Users",
    status: "coming_soon",
    badge: "Future Agency Tools",
    plans: planFeature("teamCollaboration", "teamMembers"),
    benefits: ["Coordinate client and team work."],
    sortOrder: 20,
  },
  {
    title: "Agency Workspace",
    slug: "agency-workspace",
    featureKey: "agencyWorkspace",
    shortDescription: "Manage client projects and multi-site agency workflows.",
    category: "agency_tools",
    icon: "BriefcaseBusiness",
    status: "coming_soon",
    badge: "Future Agency Tools",
    plans: planFeature("agencyWorkspace", "projects"),
    benefits: ["Scale website work across clients."],
    sortOrder: 21,
  },
  {
    title: "White Label Option",
    slug: "white-label-option",
    featureKey: "whiteLabel",
    shortDescription: "Prepare agency-ready branded delivery options.",
    category: "agency_tools",
    icon: "BadgeCheck",
    status: "coming_soon",
    badge: "Future Agency Tools",
    plans: planFeature("whiteLabel"),
    benefits: ["Support branded client delivery."],
    sortOrder: 22,
  },
  {
    title: "Priority Support",
    slug: "priority-support",
    featureKey: "prioritySupport",
    shortDescription: "Get faster support access on higher plans.",
    category: "billing_plans",
    icon: "Headphones",
    status: "available",
    badge: "Pro Feature",
    plans: planFeature("prioritySupport", "supportTickets"),
    benefits: ["Get help faster as work grows."],
    sortOrder: 23,
  },
  {
    title: "Website Export",
    slug: "website-export",
    featureKey: "exportWebsite",
    shortDescription: "Export website output for portable workflows.",
    category: "publishing",
    icon: "Download",
    status: "coming_soon",
    badge: "Future Agency Tools",
    plans: planFeature("exportWebsite"),
    benefits: ["Create portable delivery options."],
    sortOrder: 24,
  },
];

function normalizeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split("\n").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function sanitizeFeatureInput(body = {}) {
  const title = String(body.title || "").trim();
  const slug = normalizeSlug(body.slug || title);
  const plans = PLAN_SLUGS.reduce((acc, plan) => {
    const source = body.plans?.[plan] || {};
    acc[plan] = {
      included: Boolean(source.included),
      label: String(source.label || "").trim(),
      limitText: String(source.limitText || "").trim(),
    };
    return acc;
  }, {});

  return {
    title,
    slug,
    featureKey: String(body.featureKey || "").trim(),
    shortDescription: String(body.shortDescription || "").trim(),
    longDescription: String(body.longDescription || "").trim(),
    category: FEATURE_CATEGORIES.includes(body.category) ? body.category : "ai_generation",
    icon: String(body.icon || "Sparkles").trim(),
    status: FEATURE_STATUSES.includes(body.status) ? body.status : "coming_soon",
    publicVisible: Boolean(body.publicVisible),
    pricingVisible: Boolean(body.pricingVisible),
    dashboardVisible: Boolean(body.dashboardVisible),
    sortOrder: Number(body.sortOrder || 0),
    badge: String(body.badge || "").trim(),
    isPopular: Boolean(body.isPopular),
    isHighlighted: Boolean(body.isHighlighted),
    plans,
    limits: body.limits && typeof body.limits === "object" ? body.limits : {},
    benefits: sanitizeList(body.benefits),
    useCases: sanitizeList(body.useCases),
    ctaLabel: String(body.ctaLabel || "").trim(),
    ctaHref: String(body.ctaHref || "").trim(),
  };
}

function mergeEntitlementTruth(feature) {
  const plain = feature.toObject ? feature.toObject() : feature;
  const plans = { ...(plain.plans || {}) };

  if (plain.featureKey) {
    for (const plan of DEFAULT_PLANS) {
      plans[plan.slug] = {
        ...(plans[plan.slug] || {}),
        included: Boolean(plan.features?.[plain.featureKey]),
      };
    }
  }

  return { ...plain, plans };
}

export function serializeFeature(feature, { publicOnly = false } = {}) {
  const merged = mergeEntitlementTruth(feature);
  const serialized = {
    id: merged._id ? merged._id.toString() : merged.id,
    title: merged.title,
    slug: merged.slug,
    featureKey: merged.featureKey || "",
    shortDescription: merged.shortDescription,
    longDescription: merged.longDescription || "",
    category: merged.category,
    icon: merged.icon,
    status: merged.status,
    publicVisible: Boolean(merged.publicVisible),
    pricingVisible: Boolean(merged.pricingVisible),
    dashboardVisible: Boolean(merged.dashboardVisible),
    sortOrder: Number(merged.sortOrder || 0),
    badge: merged.badge || "",
    isPopular: Boolean(merged.isPopular),
    isHighlighted: Boolean(merged.isHighlighted),
    plans: merged.plans || {},
    limits: merged.limits || {},
    benefits: merged.benefits || [],
    useCases: merged.useCases || [],
    ctaLabel: merged.ctaLabel || "",
    ctaHref: merged.ctaHref || "",
    updatedAt: merged.updatedAt,
    createdAt: merged.createdAt,
    updatedBy: merged.updatedBy || "",
  };

  if (!publicOnly) return serialized;

  const {
    id,
    title,
    slug,
    shortDescription,
    longDescription,
    category,
    icon,
    status,
    badge,
    plans,
    benefits,
    useCases,
    ctaLabel,
    ctaHref,
    sortOrder,
  } = serialized;

  return {
    id,
    title,
    slug,
    description: shortDescription,
    shortDescription,
    longDescription,
    category,
    icon,
    status,
    badge,
    plans: PUBLIC_PLAN_SLUGS.reduce((acc, slug) => {
      acc[slug] = plans?.[slug] || {};
      return acc;
    }, {}),
    benefits,
    useCases,
    ctaLabel,
    ctaHref,
    sortOrder,
  };
}

export async function seedDefaultFeatures({ overwrite = false } = {}) {
  await dbConnect();

  for (const feature of defaultFeatures) {
    await Feature.findOneAndUpdate(
      { slug: feature.slug },
      overwrite ? { $set: feature } : { $setOnInsert: feature },
      { upsert: true, new: true, runValidators: true },
    );
  }

  return { success: true, message: "Default feature catalog is ready." };
}

export async function getAllFeatures() {
  await dbConnect();

  let features = await Feature.find({}).sort({ sortOrder: 1, title: 1 }).lean();
  if (!features.length) {
    await seedDefaultFeatures();
    features = await Feature.find({}).sort({ sortOrder: 1, title: 1 }).lean();
  }

  return features.map((feature) => serializeFeature(feature));
}

export async function getPublicFeatures(filters = {}) {
  await dbConnect();

  if (filters.category === "admin_controls") {
    return [];
  }

  const query = { publicVisible: true, category: { $ne: "admin_controls" } };
  if (FEATURE_CATEGORIES.includes(filters.category)) query.category = filters.category;
  if (FEATURE_STATUSES.includes(filters.status)) query.status = filters.status;

  let features = await Feature.find(query).sort({ category: 1, sortOrder: 1, title: 1 }).lean();
  if (!features.length) {
    await seedDefaultFeatures();
    features = await Feature.find(query).sort({ category: 1, sortOrder: 1, title: 1 }).lean();
  }

  const plan = PLAN_SLUGS.includes(filters.plan) ? filters.plan : "";
  return features
    .map((feature) => serializeFeature(feature, { publicOnly: true }))
    .filter((feature) => (plan ? Boolean(feature.plans?.[plan]?.included) : true));
}
