import "server-only";
import { normalizePersonalInfoForCategory } from "@/lib/templates/categorySchemas";

export function resolvePath(source, path) {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((value, key) => (value && value[key] !== undefined ? value[key] : undefined), source);
}

export function hasRenderableContent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasRenderableContent);
  if (typeof value === "object") return Object.values(value).some(hasRenderableContent);
  return Boolean(value);
}

function pageHasData(sections = [], sectionData = {}) {
  return sections.some((section) => hasRenderableContent(sectionData[section]));
}

function resolveSectionData(template, normalized) {
  const data = {};
  for (const [target, source] of Object.entries(template?.dataBindings || {})) {
    const [section, key] = target.split(".");
    if (!section || !key) continue;
    const value = resolvePath(normalized, source);
    if (value === undefined || value === null) continue;
    data[section] = { ...(data[section] || {}), [key]: value };
  }

  data.hero = {
    ...(data.hero || {}),
    socialLinks: normalized.profile?.socialLinks || {},
    location: normalized.profile?.location || "",
  };
  data.intro = {
    title: normalized.profile?.headline,
    description: normalized.profile?.bio,
  };
  data.cta = {
    title: normalized.portfolio?.contactMessage || "Ready to connect?",
    primaryCTA: normalized.portfolio?.secondaryCTA || "Contact Me",
    email: normalized.profile?.email,
  };
  data.contact = {
    ...(data.contact || {}),
    services: normalized.professional?.services || [],
  };
  data.bio = {
    ...(data.bio || {}),
    experience: normalized.professional?.experience || [],
    education: normalized.professional?.education || [],
    certifications: normalized.professional?.certifications || [],
    socialLinks: normalized.profile?.socialLinks || {},
    location: normalized.profile?.location || "",
  };
  data.blog = {
    title: "Insights",
    description: "Articles and updates designed to support discoverability and content growth.",
  };

  return data;
}

export function renderTemplate({ template, personalInfo, pageSlug = "home" }) {
  const category = template?.category || "portfolio";
  const normalized = normalizePersonalInfoForCategory(personalInfo, category);
  const sectionData = resolveSectionData(template, normalized);
  const pages = (template?.pages || []).filter((page) => {
    if (page.enabled === false) return false;
    if (!page.optional) return true;
    return pageHasData(page.sections, sectionData);
  });
  const activePage = pages.find((page) => page.slug === pageSlug) || pages.find((page) => page.slug === "home");
  const sections = (activePage?.sections || [])
    .map((section) => ({
      type: section,
      data: sectionData[section] || {},
      layoutStyle: template?.layoutStyle || "balanced",
    }))
    .filter((section) => hasRenderableContent(section.data));

  return {
    category,
    template: {
      name: template?.name || "",
      slug: template?.slug || "",
      layoutStyle: template?.layoutStyle || "balanced",
    },
    page: activePage,
    pages,
    sections,
    profile: normalized.profile,
    professional: normalized.professional,
    portfolio: normalized.portfolio,
  };
}
