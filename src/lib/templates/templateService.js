import "server-only";
import dbConnect from "@/lib/dbConnect";
import Template from "@/models/Template";
import { getAllTemplates } from "@/lib/templateRegistry";
import { PORTFOLIO_TEMPLATE_SEEDS } from "@/lib/templates/portfolioTemplates";
import { getPlanLimits, normalizeActivePlanSlug } from "@/lib/plans/planEntitlements";
import { getOrSetCache, safeCacheKey } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";

export const COMING_SOON_TEMPLATES = [
  {
    slug: "business-website-templates",
    name: "Business Website Templates",
    category: "business",
    purpose: "Small businesses and service providers",
    shortDescription: "Structured pages for services, trust, contact, and local business positioning.",
    status: "coming_soon",
  },
  {
    slug: "salon-beauty-templates",
    name: "Salon Website Templates",
    category: "business",
    purpose: "Beauty, salon, and appointment-style websites",
    shortDescription: "Service lists, gallery, offers, and contact structures for beauty brands.",
    status: "planned",
  },
  {
    slug: "restaurant-templates",
    name: "Restaurant Templates",
    category: "restaurant",
    purpose: "Menus, locations, offers, and contact details",
    shortDescription: "Restaurant structures are planned and will remain disabled until released.",
    status: "coming_soon",
  },
  {
    slug: "clinic-templates",
    name: "Clinic Templates",
    category: "clinic",
    purpose: "Professional service information and appointment-style structure",
    shortDescription: "Trust-forward clinic layouts are planned for future category support.",
    status: "planned",
  },
  {
    slug: "real-estate-templates",
    name: "Real Estate Templates",
    category: "realestate",
    purpose: "Property and agent-focused website structures",
    shortDescription: "Listing, neighborhood, and inquiry layouts are planned for a later release.",
    status: "planned",
  },
  {
    slug: "ecommerce-templates",
    name: "E-commerce Templates",
    category: "ecommerce",
    purpose: "Future product-based layouts",
    shortDescription: "Product presentation templates are planned and not active yet.",
    status: "coming_soon",
  },
  {
    slug: "school-templates",
    name: "School Templates",
    category: "school",
    purpose: "Programs, admissions, faculty, and contact structures",
    shortDescription: "Educational website templates are planned for future category support.",
    status: "planned",
  },
  {
    slug: "landing-page-templates",
    name: "Landing Page Templates",
    category: "landing-page",
    purpose: "Product or service promotion",
    shortDescription: "Campaign, offer, and lead-capture structures are planned.",
    status: "coming_soon",
  },
];

function registryToTemplate(template) {
  const isPremium = Boolean(template.isPremium);
  return {
    name: template.name,
    slug: template.key || template.slug,
    description: template.description,
    shortDescription: template.description,
    category: template.category || "portfolio",
    purpose: "AI portfolio website generation",
    previewImage: "/templates/template-preview.svg",
    thumbnailImage: "/templates/template-preview.svg",
    galleryImages: [],
    sections: template.supportedSections || [],
    pages: [],
    dataBindings: {},
    requiredFields: [],
    optionalFields: [],
    bestFor: isPremium ? "Creative professionals and portfolio-heavy brands" : "Developers, freelancers, and personal brands",
    recommendedThemes: template.supportedThemes || [],
    status: "active",
    availablePlans: isPremium ? ["pro"] : ["free", "basic", "pro"],
    isFeatured: template.key === "portfolio-modern",
    isPublic: true,
    isPremium,
    componentKey: template.component || "",
    supportedThemes: template.supportedThemes || [],
    sortOrder: template.order || 0,
    order: template.order || 0,
  };
}

export function serializeTemplate(template) {
  const plain = template?.toObject ? template.toObject() : template;
  if (!plain) return null;
  const status = plain.status || (plain.isActive === false ? "draft" : "active");
  return {
    id: plain._id?.toString?.() || plain.id || plain.slug,
    name: plain.name,
    slug: plain.slug || plain.key,
    description: plain.description || "",
    shortDescription: plain.shortDescription || plain.description || "",
    category: plain.category || "portfolio",
    purpose: plain.purpose || "",
    previewImage: plain.previewImage || "/templates/template-preview.svg",
    thumbnailImage: plain.thumbnailImage || plain.previewImage || "/templates/template-preview.svg",
    galleryImages: plain.galleryImages || [],
    pages: plain.pages || [],
    sections: plain.sections?.length ? plain.sections : plain.supportedSections || [],
    dataBindings: plain.dataBindings || {},
    requiredFields: plain.requiredFields || [],
    optionalFields: plain.optionalFields || [],
    bestFor: plain.bestFor || "",
    recommendedThemes: plain.recommendedThemes?.length ? plain.recommendedThemes : plain.supportedThemes || [],
    status,
    availablePlans: plain.availablePlans?.length ? plain.availablePlans : plain.isPremium ? ["pro"] : ["free", "basic", "pro"],
    isFeatured: Boolean(plain.isFeatured),
    isPublic: plain.isPublic !== false,
    isPremium: Boolean(plain.isPremium),
    layoutStyle: plain.layoutStyle || "balanced",
    sortOrder: plain.sortOrder || plain.order || 0,
  };
}

async function seedTemplatesIfEmpty() {
  const count = await Template.countDocuments({});
  if (count === 0) {
    await Template.insertMany([...PORTFOLIO_TEMPLATE_SEEDS, ...getAllTemplates().map(registryToTemplate)]);
    return;
  }

  const existingSlugs = new Set(
    (await Template.find({ slug: { $in: PORTFOLIO_TEMPLATE_SEEDS.map((template) => template.slug) } }).select("slug").lean())
      .map((template) => template.slug),
  );
  const missing = PORTFOLIO_TEMPLATE_SEEDS.filter((template) => !existingSlugs.has(template.slug));
  if (missing.length) await Template.insertMany(missing);
}

export async function getPublicTemplates({ status = "", category = "", plan = "", search = "", featured = "" } = {}) {
  await dbConnect();
  await seedTemplatesIfEmpty();

  const key = safeCacheKey(["public", "templates", status || "all", category, plan, search, featured]);
  return getOrSetCache(key, serverEnv.CACHE_PUBLIC_TTL_SECONDS, async () => {
    const query = {
      isPublic: true,
      status: { $in: ["active", "coming_soon", "planned"] },
    };
    if (status && ["active", "coming_soon", "planned"].includes(status)) query.status = status;
    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;

    let templates = (await Template.find(query).sort({ sortOrder: 1, order: 1, createdAt: -1 }).lean()).map(serializeTemplate);

    if (!templates.some((template) => template.status !== "active") && (!status || status !== "active")) {
      templates = [...templates, ...COMING_SOON_TEMPLATES.map(serializeTemplate)];
    }

    if (plan && ["free", "basic", "pro"].includes(plan)) {
      templates = templates.filter((template) => template.status !== "active" || template.availablePlans.includes(plan));
    }

    const term = String(search || "").trim().toLowerCase();
    if (term) {
      templates = templates.filter((template) => {
        const text = [
          template.name,
          template.category,
          template.bestFor,
          template.description,
          template.shortDescription,
          ...(template.pages || []).flatMap((page) => [page.name, ...(page.sections || [])]),
          ...(template.sections || []),
        ].join(" ").toLowerCase();
        return text.includes(term);
      });
    }

    return templates;
  });
}

export async function getActiveTemplateBySlug(slug) {
  if (!slug) return null;
  await dbConnect();
  await seedTemplatesIfEmpty();
  const template = await Template.findOne({
    slug: String(slug).toLowerCase(),
    status: "active",
    isPublic: true,
  }).lean();
  return serializeTemplate(template);
}

export function isTemplateAllowedForPlan(template, planSlug) {
  if (!template || template.status !== "active") return false;
  const normalized = normalizeActivePlanSlug(planSlug);
  const planLimit = getPlanLimits(normalized).templates;
  if (!template.availablePlans?.includes(normalized)) return false;
  if (planLimit === -1) return true;
  return true;
}
