import "server-only";

export function trimPrompt(value, max = 2000) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function publicAIContextOnly(context = {}) {
  const { activePlans, activeCategories, comingSoonCategories, availableFeatures, comingSoonFeatures, pricingSummary, howItWorks } = context;
  return { activePlans, activeCategories, comingSoonCategories, availableFeatures, comingSoonFeatures, pricingSummary, howItWorks };
}
