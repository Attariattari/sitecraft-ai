import crypto from "crypto";
import { getPublicAvailability } from "@/lib/public/publicAvailability";
import { searchKnowledgeBase } from "@/lib/knowledge/searchKnowledgeBase";
import { getPublicPlans } from "@/lib/plans/planEntitlements";

function compactPlan(plan) {
  return {
    name: plan.name,
    slug: plan.slug,
    priceMonthly: plan.priceMonthly,
    status: plan.status,
    isActive: plan.isActive,
    isPublic: plan.isPublic,
    isPurchasable: plan.isPurchasable,
    limits: plan.limits,
    highlights: plan.highlights,
  };
}

function hashContext(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export async function buildSiteCraftKnowledgeContext(question, { entries } = {}) {
  const [availability, matchedEntries] = await Promise.all([
    getPublicAvailability(),
    entries ? Promise.resolve(entries) : searchKnowledgeBase(question),
  ]);

  const context = {
    product: "SiteCraft AI",
    truthRules: [
      "Active public plans are Free, Basic, and Pro.",
      "Agency tools are planned for future releases and are not currently available as an active public plan.",
      "Do not use the word unlimited.",
      "Only active categories, templates, themes, and features are available now.",
      "Unavailable features are planned, coming soon, or not currently available.",
    ],
    plans: getPublicPlans().map(compactPlan),
    availability: {
      activeCategoriesCount: availability.activeCategoriesCount,
      activeTemplateCount: availability.activeTemplateCount,
      activeThemeCount: availability.activeThemeCount,
      availableCategories: availability.availableCategories,
      comingSoonCategories: availability.comingSoonCategories,
      activeTemplates: availability.activeTemplates.map((template) => ({
        slug: template.slug,
        name: template.name,
        category: template.category,
        status: template.status,
      })),
      activeThemes: availability.activeThemes,
      activeFeatures: availability.activeFeatures.map((feature) => ({
        title: feature.title,
        slug: feature.slug,
        status: feature.status,
        category: feature.category,
      })),
      comingSoonFeatures: availability.comingSoonFeatures.map((feature) => ({
        title: feature.title,
        slug: feature.slug,
        status: feature.status,
        category: feature.category,
      })),
    },
    knowledgeEntries: matchedEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      question: entry.question,
      answer: entry.answer,
      category: entry.category,
      tags: entry.tags,
      sourceType: entry.sourceType,
      reviewStatus: entry.reviewStatus,
    })),
    policies: [
      "Public answers must not expose admin-only knowledge.",
      "Public answers must not include secrets, private user data, payment secrets, internal logs, or API keys.",
    ],
    howItWorks:
      "SiteCraft AI uses guided inputs to generate website foundations with plan-aware templates, themes, and dashboard workflows.",
  };

  return {
    context,
    contextHash: hashContext(context),
    entries: matchedEntries,
    sourceSummary: {
      knowledgeEntries: matchedEntries.length,
      plans: context.plans.map((plan) => plan.name),
      availableCategories: availability.availableCategories.map((category) => category.label),
      activeTemplateCount: availability.activeTemplateCount,
      activeThemeCount: availability.activeThemeCount,
      activeFeatureCount: availability.activeFeatures.length,
      comingSoonFeatureCount: availability.comingSoonFeatures.length,
    },
  };
}
