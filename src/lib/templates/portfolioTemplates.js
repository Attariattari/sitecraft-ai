import { CATEGORY_SCHEMAS } from "@/lib/templates/categorySchemas";

const portfolioSchema = CATEGORY_SCHEMAS.portfolio;

const basePages = [
  { name: "Home", slug: "home", path: "/", sections: ["hero", "intro", "skillsPreview", "featuredProjects", "servicesPreview", "experience", "testimonials", "cta"] },
  { name: "About", slug: "about", path: "/about", sections: ["bio", "experience", "education", "skills", "cta"] },
  { name: "Skills", slug: "skills", path: "/skills", sections: ["skills", "cta"] },
  { name: "Projects", slug: "projects", path: "/projects", sections: ["projects", "cta"] },
  { name: "Services", slug: "services", path: "/services", sections: ["services", "cta"] },
  { name: "Blog", slug: "blog", path: "/blog", sections: ["blog"] },
  { name: "Contact", slug: "contact", path: "/contact", sections: ["contact"] },
  { name: "Experience", slug: "experience", path: "/experience", sections: ["experience"], optional: true },
  { name: "Education", slug: "education", path: "/education", sections: ["education"], optional: true },
  { name: "Testimonials", slug: "testimonials", path: "/testimonials", sections: ["testimonials"], optional: true },
];

const baseBindings = {
  "hero.title": "profile.fullName",
  "hero.subtitle": "profile.headline",
  "hero.description": "profile.bio",
  "hero.image": "profile.profileImage",
  "hero.primaryCTA": "portfolio.primaryCTA",
  "hero.secondaryCTA": "portfolio.secondaryCTA",
  "about.bio": "portfolio.aboutText",
  "about.image": "profile.profileImage",
  "contact.email": "profile.email",
  "contact.phone": "profile.phone",
  "contact.location": "profile.location",
  "contact.socialLinks": "profile.socialLinks",
  "contact.message": "portfolio.contactMessage",
  "projects.items": "professional.projects",
  "projects.featured": "portfolio.featuredProjects",
  "featuredProjects.items": "portfolio.featuredProjects",
  "skills.items": "professional.skills",
  "skills.tools": "professional.tools",
  "skillsPreview.items": "professional.skills",
  "skillsPreview.tools": "professional.tools",
  "services.items": "professional.services",
  "services.featured": "portfolio.serviceHighlights",
  "servicesPreview.items": "portfolio.serviceHighlights",
  "experience.items": "professional.experience",
  "education.items": "professional.education",
  "testimonials.items": "professional.testimonials",
  "certifications.items": "professional.certifications",
};

function makeTemplate(overrides) {
  return {
    category: "portfolio",
    status: "active",
    isPublic: true,
    previewImage: "/templates/template-preview.svg",
    thumbnailImage: "/templates/template-preview.svg",
    galleryImages: [],
    pages: basePages,
    sections: portfolioSchema.sections,
    dataBindings: baseBindings,
    requiredFields: portfolioSchema.requiredFields,
    optionalFields: portfolioSchema.optionalFields,
    recommendedThemes: ["emerald", "ocean", "sunset"],
    ...overrides,
  };
}

export const PORTFOLIO_TEMPLATE_SEEDS = [
  makeTemplate({ name: "Modern Developer Portfolio", slug: "modern-developer-portfolio", shortDescription: "A clean developer portfolio structure for skills, projects, and technical services.", description: "Designed for developers and engineers who want a sharp structure with project proof, skills, services, and a direct contact path.", purpose: "Developer portfolio website generation", bestFor: "Developers, engineers, students, and technical freelancers", availablePlans: ["free", "basic", "pro"], isFeatured: true, layoutStyle: "developer-modern", sortOrder: 1 }),
  makeTemplate({ name: "Creative Freelancer Portfolio", slug: "creative-freelancer-portfolio", shortDescription: "A visual freelancer structure with portfolio work, services, and conversion-focused contact.", description: "Built for creators and freelancers who need a polished portfolio layout that balances personality, work samples, and service clarity.", purpose: "Creative freelancer website generation", bestFor: "Designers, writers, creators, and independent freelancers", availablePlans: ["basic", "pro"], layoutStyle: "creative-freelancer", sortOrder: 2 }),
  makeTemplate({ name: "Minimal Resume Portfolio", slug: "minimal-resume-portfolio", shortDescription: "A crisp resume-style website structure for clear background, skills, and work history.", description: "A minimal layout for professionals who want a focused personal website with readable experience, education, and projects.", purpose: "Resume portfolio website generation", bestFor: "Job seekers, students, consultants, and professionals", availablePlans: ["free", "basic", "pro"], layoutStyle: "minimal-resume", sortOrder: 3 }),
  makeTemplate({ name: "SaaS Style Personal Brand", slug: "saas-style-personal-brand", shortDescription: "A premium personal-brand structure with a SaaS-inspired hero, proof sections, and strong CTAs.", description: "Ideal for founders, consultants, and experts who want a productized personal brand site with services and credibility sections.", purpose: "Personal brand website generation", bestFor: "Founders, consultants, operators, and productized service providers", availablePlans: ["pro"], layoutStyle: "saas-personal-brand", sortOrder: 4 }),
  makeTemplate({ name: "Professional Service Portfolio", slug: "professional-service-portfolio", shortDescription: "A service-led portfolio structure for professionals who sell expertise and need clear inquiry flow.", description: "A trust-forward template for showing services, selected work, background, and contact information without clutter.", purpose: "Professional service website generation", bestFor: "Consultants, specialists, coaches, and service professionals", availablePlans: ["basic", "pro"], layoutStyle: "professional-service", sortOrder: 5 }),
];
