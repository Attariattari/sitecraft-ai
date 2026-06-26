export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function getCategoryAccessText(activeCategoriesCount) {
  if (activeCategoriesCount <= 0) {
    return "Website categories are being prepared for public access.";
  }

  if (activeCategoriesCount === 1) {
    return "Currently available category: Portfolio.";
  }

  return `Currently available: ${pluralize(activeCategoriesCount, "category", "categories")}.`;
}

export function getTemplateAccessText(plan, activeTemplateCount) {
  if (activeTemplateCount <= 0) return "Templates are being prepared for release.";

  if (plan.slug === "free") {
    return `Access selected starter templates. Currently available: ${pluralize(activeTemplateCount, "active template")}.`;
  }

  if (plan.slug === "basic") {
    return `Access more available templates. Currently available: ${pluralize(activeTemplateCount, "active template")}.`;
  }

  return `Access all ${pluralize(activeTemplateCount, "currently active template")}. More templates will be included as they are released.`;
}

export function getThemeAccessText(plan, activeThemeCount) {
  const limit = plan.limits?.themes || 1;
  const visibleCount = Math.min(limit, activeThemeCount);

  if (activeThemeCount <= 0) return `Up to ${limit} themes as they are released.`;

  if (activeThemeCount < limit) {
    return `Up to ${limit} themes as more themes are released. Currently available: ${pluralize(activeThemeCount, "theme")}.`;
  }

  return `${visibleCount} ${visibleCount === 1 ? "theme" : "themes"} available on this plan.`;
}

export function getComingSoonText(type) {
  const labels = {
    categories: "More website categories are coming soon.",
    templates: "More templates are being released step by step.",
    themes: "More themes will be added as they are released.",
    features: "Advanced tools are planned for future releases.",
  };

  return labels[type] || "More capabilities are planned for future releases.";
}
