import "server-only";

const FIELD_LABELS = { fullName: "Full name", headline: "Headline", bio: "Bio", email: "Email" };

export const CATEGORY_SCHEMAS = {
  portfolio: {
    slug: "portfolio",
    label: "Portfolio",
    requiredFields: ["fullName", "headline", "bio", "email"],
    optionalFields: ["phone", "location", "profileImage", "coverImage", "skills", "tools", "projects", "services", "experience", "education", "certifications", "socialLinks", "testimonials", "website"],
    pages: ["home", "about", "skills", "projects", "services", "blog", "contact"],
    optionalPages: ["experience", "education", "testimonials", "certifications"],
    sections: ["hero", "intro", "skillsPreview", "featuredProjects", "servicesPreview", "bio", "skills", "projects", "services", "blog", "contact", "experience", "education", "testimonials", "cta"],
    templateTypes: ["developer", "freelancer", "resume", "personal-brand", "service"],
    aiContext: "Portfolio websites for professionals, developers, freelancers, creators, and personal brands.",
    fallbackLabels: FIELD_LABELS,
  },
};

function firstString(...values) {
  for (const value of values) if (typeof value === "string" && value.trim()) return value.trim();
  return "";
}

function cleanArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (!item || typeof item !== "object") return null;
      const title = firstString(item.title, item.name, item.skill, item.company, item.degree, item.label);
      const description = firstString(item.description, item.summary, item.details, item.bio);
      return { ...item, title, name: firstString(item.name, title), description, technologies: Array.isArray(item.technologies) ? item.technologies.filter(Boolean) : item.techStack || [] };
    })
    .filter((item) => {
      if (!item) return false;
      if (typeof item === "string") return Boolean(item);
      return Object.values(item).some((entry) => Array.isArray(entry) ? entry.length > 0 : typeof entry === "string" ? entry.trim() : Boolean(entry));
    });
}

function cleanSocialLinks(value = {}) {
  return Object.fromEntries(Object.entries(value || {}).filter(([, link]) => typeof link === "string" && link.trim()));
}

export function getCategorySchema(category = "portfolio") {
  return CATEGORY_SCHEMAS[category] || null;
}

export function normalizePersonalInfoForCategory(personalInfo = {}, category = "portfolio") {
  const shared = personalInfo.sharedInfo || {};
  const purpose = personalInfo.purposeInfo?.[category] || {};
  if (category !== "portfolio") return { profile: {}, professional: {}, portfolio: {} };

  const fullName = firstString(shared.fullName, shared.displayName, purpose.fullName, purpose.displayName);
  const headline = firstString(purpose.headline, purpose.professionalTitle, purpose.whatIDo, shared.profession, shared.headline);
  const bio = firstString(shared.bio, purpose.bio, purpose.aboutMe, purpose.aboutText, purpose.careerObjective, purpose.shortBio);
  const email = firstString(shared.email, purpose.email);
  const logo = firstString(shared.websiteLogo, shared.brandLogo, shared.businessLogo, purpose.websiteLogo, purpose.brandLogo, purpose.businessLogo);

  const profile = {
    fullName,
    headline,
    bio,
    profileImage: firstString(shared.profileImage, purpose.profileImage),
    brandLogo: logo,
    websiteLogo: logo,
    coverImage: firstString(shared.coverImage, purpose.coverImage),
    location: firstString(shared.location, purpose.location),
    email,
    phone: firstString(shared.phone, purpose.phone, shared.whatsapp),
    website: firstString(shared.websiteUrl, shared.website, purpose.website, purpose.websiteUrl),
    socialLinks: cleanSocialLinks({ ...(shared.socialLinks || {}), ...(purpose.socialLinks || {}) }),
  };

  const professional = {
    skills: cleanArray(purpose.skills || shared.skills),
    tools: cleanArray(purpose.tools || shared.tools),
    experience: cleanArray(purpose.experience || shared.experience),
    education: cleanArray(purpose.education || shared.education),
    certifications: cleanArray(purpose.certifications || shared.certifications),
    services: cleanArray(purpose.services || shared.services),
    projects: cleanArray(purpose.projects || shared.projects),
    testimonials: cleanArray(purpose.testimonials || shared.testimonials),
  };

  const portfolio = {
    heroTitle: firstString(purpose.heroTitle, fullName),
    heroSubtitle: firstString(purpose.heroSubtitle, headline),
    aboutText: firstString(purpose.aboutText, bio),
    primaryCTA: firstString(purpose.primaryCTA, "View My Work"),
    secondaryCTA: firstString(purpose.secondaryCTA, "Contact Me"),
    featuredProjects: cleanArray(purpose.featuredProjects || professional.projects).slice(0, 3),
    serviceHighlights: cleanArray(purpose.serviceHighlights || professional.services).slice(0, 3),
    contactMessage: firstString(purpose.contactMessage, "Let's talk about your next project."),
  };

  return { profile, professional, portfolio };
}

export function getMissingRequiredFields(personalInfo = {}, category = "portfolio", requiredFields) {
  const schema = getCategorySchema(category);
  const required = requiredFields?.length ? requiredFields : schema?.requiredFields || [];
  const normalized = normalizePersonalInfoForCategory(personalInfo, category);
  return required.filter((field) => {
    const value = normalized.profile?.[field] || normalized.professional?.[field] || normalized.portfolio?.[field];
    return !value || (Array.isArray(value) && value.length === 0);
  });
}

export function getRequiredFieldLabel(field) {
  return FIELD_LABELS[field] || field;
}
