import { getAvailableCategories } from "@/lib/categories/categoryService";
import { defaultFeatures } from "@/lib/features/featureCatalogService";
import { getPublicPlans } from "@/lib/plans/planEntitlements";
import { getOrSetCache } from "@/lib/server/cache/cache";

export async function buildBlogContext() {
  return getOrSetCache("ai:blog-context", 3600, buildBlogContextUncached);
}

async function buildBlogContextUncached() {
  const [categories] = await Promise.all([getAvailableCategories("home")]);
  const availableCategories = categories
    .filter((category) => category.isAvailable && !category.isLocked)
    .map((category) => category.label || category.name);
  const comingSoonCategories = categories
    .filter((category) => !category.isAvailable || category.isLocked)
    .map((category) => category.label || category.name);

  const plans = getPublicPlans().map((plan) => ({
    name: plan.name,
    slug: plan.slug,
    priceMonthly: plan.priceMonthly,
    bestFor: plan.bestFor,
    limits: plan.limits,
    highlights: plan.highlights,
  }));

  const availableFeatures = defaultFeatures
    .filter((feature) => feature.status === "available" && feature.publicVisible !== false)
    .map((feature) => feature.title);
  const comingSoonFeatures = defaultFeatures
    .filter((feature) => feature.status !== "available" && feature.publicVisible !== false)
    .map((feature) => ({
      title: feature.title,
      status: feature.status === "coming_soon" ? "Coming Soon" : "In Progress",
    }));

  return {
    brand: "SiteCraft AI",
    activePlans: plans,
    inactivePlanRules: ["Agency is future only, not active, not public, and not purchasable."],
    activeCategories: availableCategories,
    comingSoonCategories,
    activeTemplatesCount: 3,
    activeThemesCount: 1,
    availableFeatures,
    comingSoonFeatures,
    howItWorks:
      "Users choose a purpose, provide personal or business details, select template and theme direction, then SiteCraft AI generates a website draft that can be previewed and managed from the dashboard.",
    pricingSummary:
      "Public plans are Free, Basic, and Pro. Free is for trying the builder, Basic is for personal brands and small businesses, and Pro is for professionals who need more website capacity and higher AI usage.",
    templateThemeExplanation:
      "Templates guide page structure and section layout. Themes control the visual style, color feel, and typography direction of generated websites.",
    securityTrustRules:
      "Keep public claims accurate, avoid private data, avoid unsupported availability claims, and describe future features as planned or coming soon.",
    hardRules: [
      "Do not say Agency is active.",
      "Do not use unlimited wording.",
      "Do not claim unavailable features are available.",
      "Do not invent customer counts, uptime, awards, case studies, or statistics.",
      "Only Portfolio can be described as available now if category availability is discussed.",
      "Mention custom domains, analytics, editor, white label, or team collaboration only as in progress, planned, or coming soon unless context marks available.",
    ],
  };
}
