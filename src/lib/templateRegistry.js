/**
 * Template Registry
 * Centralized registry for all available templates
 * This makes it easy to add new templates and categories
 */

export const TEMPLATE_REGISTRY = {
  "portfolio-modern": {
    key: "portfolio-modern",
    name: "Modern Portfolio",
    category: "portfolio",
    component: "ModernPortfolioTemplate",
    supportedSections: [
      "hero",
      "about",
      "skills",
      "services",
      "projects",
      "experience",
      "cta",
      "contact",
    ],
    supportedThemes: [
      "emerald",
      "modernDark",
      "royalBlue",
      "premiumPurple",
      "roséGold",
    ],
    description: "Clean and modern portfolio with smooth animations",
    isPremium: false,
    order: 1,
  },
  "portfolio-minimal": {
    key: "portfolio-minimal",
    name: "Minimal Portfolio",
    category: "portfolio",
    component: "MinimalPortfolioTemplate",
    supportedSections: [
      "hero",
      "about",
      "skills",
      "projects",
      "cta",
      "contact",
    ],
    supportedThemes: [
      "emerald",
      "modernDark",
      "royalBlue",
      "premiumPurple",
      "roséGold",
    ],
    description: "Minimalist design with focus on content",
    isPremium: false,
    order: 2,
  },
  "portfolio-creative": {
    key: "portfolio-creative",
    name: "Creative Portfolio",
    category: "portfolio",
    component: "CreativePortfolioTemplate",
    supportedSections: [
      "hero",
      "about",
      "skills",
      "services",
      "projects",
      "experience",
      "cta",
      "contact",
    ],
    supportedThemes: [
      "emerald",
      "modernDark",
      "royalBlue",
      "premiumPurple",
      "roséGold",
    ],
    description: "Bold and creative portfolio for designers and artists",
    isPremium: true,
    order: 3,
  },
};

/**
 * Get template by key
 */
export function getTemplate(key) {
  return TEMPLATE_REGISTRY[key] || null;
}

/**
 * Get complete template list
 */
export function getAllTemplates() {
  return Object.values(TEMPLATE_REGISTRY).sort((a, b) => a.order - b.order);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category) {
  return Object.values(TEMPLATE_REGISTRY)
    .filter((t) => t.category === category)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get templates that support a specific theme
 */
export function getTemplatesSupportingTheme(themeId) {
  return Object.values(TEMPLATE_REGISTRY).filter((t) =>
    t.supportedThemes.includes(themeId)
  );
}

/**
 * Get supported themes for a template
 */
export function getSupportedThemes(templateKey) {
  const template = getTemplate(templateKey);
  return template ? template.supportedThemes : [];
}
