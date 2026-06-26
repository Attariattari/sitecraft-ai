import dbConnect from "@/lib/dbConnect";
import { getPublicAvailability } from "@/lib/public/publicAvailability";
import KnowledgeBase from "@/models/KnowledgeBase";

export const KNOWLEDGE_CATEGORIES = [
  "General",
  "AI Website Generation",
  "Plans & Pricing",
  "Themes & Templates",
  "Categories & Industries",
  "Dashboard",
  "Security",
  "Coming Soon",
];

export const KNOWLEDGE_STATUSES = ["published", "draft", "archived"];
export const KNOWLEDGE_VISIBILITIES = ["public", "admin_only", "ai_only"];
export const KNOWLEDGE_REVIEW_STATUSES = ["verified", "needs_review", "outdated"];
export const KNOWLEDGE_SOURCE_TYPES = [
  "faq",
  "pricing",
  "feature",
  "category",
  "theme",
  "template",
  "policy",
  "how_it_works",
  "roadmap",
  "general",
];

export const defaultKnowledgeEntries = [
  {
    title: "What is SiteCraft AI?",
    question: "What is SiteCraft AI?",
    answer:
      "SiteCraft AI helps users generate a website foundation from guided inputs such as purpose, profile information, templates, and themes.",
    category: "General",
    sourceType: "general",
    tags: ["sitecraft", "overview", "ai"],
    priority: 100,
  },
  {
    title: "How does SiteCraft AI work?",
    question: "How does SiteCraft AI work?",
    answer:
      "SiteCraft AI uses a guided workflow to collect website purpose, profile information, template direction, and theme choices, then generates a starting website foundation for review.",
    category: "AI Website Generation",
    sourceType: "how_it_works",
    tags: ["workflow", "generation"],
    priority: 95,
  },
  {
    title: "Which plans are available?",
    question: "Which plans are available?",
    answer:
      "The active public plans are Free, Basic, and Pro. Plan limits and included features are shown on the pricing page.",
    category: "Plans & Pricing",
    sourceType: "pricing",
    tags: ["plans", "pricing", "free", "basic", "pro"],
    priority: 92,
  },
  {
    title: "Is Agency plan available?",
    question: "Is Agency plan available?",
    answer:
      "Agency tools are planned for future releases and are not currently available as an active public plan.",
    category: "Coming Soon",
    sourceType: "roadmap",
    tags: ["agency", "future", "roadmap"],
    priority: 100,
  },
  {
    title: "Which category is available now?",
    question: "Which category is available now?",
    answer:
      "SiteCraft AI is launching with selected website categories. The current available categories come from platform availability data, and more categories are being released step by step.",
    category: "Categories & Industries",
    sourceType: "category",
    tags: ["categories", "available", "portfolio"],
    priority: 90,
  },
  {
    title: "Are more categories coming soon?",
    question: "Are more categories coming soon?",
    answer:
      "Yes. More website categories are planned and will be released step by step after they are confirmed available.",
    category: "Categories & Industries",
    sourceType: "roadmap",
    tags: ["categories", "coming soon"],
    priority: 84,
  },
  {
    title: "What is the difference between template and theme?",
    question: "What is the difference between template and theme?",
    answer:
      "Templates control page structure and section flow. Themes control the generated website's visual style, colors, and overall design feel.",
    category: "Themes & Templates",
    sourceType: "template",
    tags: ["templates", "themes", "design"],
    priority: 90,
  },
  {
    title: "How many themes are included in each plan?",
    question: "How many themes are included in each plan?",
    answer:
      "Free includes 1 theme, Basic includes 4 themes, and Pro includes 10 themes, subject to the currently active theme inventory.",
    category: "Themes & Templates",
    sourceType: "theme",
    tags: ["themes", "plans", "limits"],
    priority: 86,
  },
  {
    title: "Are unlimited websites available?",
    question: "Are unlimited websites available?",
    answer:
      "SiteCraft AI uses clear plan limits instead of open-ended usage, so users can understand exactly what each plan includes.",
    category: "Plans & Pricing",
    sourceType: "pricing",
    tags: ["limits", "pricing", "usage"],
    priority: 100,
  },
  {
    title: "Can I create a portfolio website now?",
    question: "Can I create a portfolio website now?",
    answer:
      "Portfolio website generation is available when the Portfolio category is active and selectable in current platform availability data.",
    category: "Categories & Industries",
    sourceType: "category",
    tags: ["portfolio", "category"],
    priority: 88,
  },
  {
    title: "What features are coming soon?",
    question: "What features are coming soon?",
    answer:
      "Roadmap features can include advanced editing, custom domains, analytics, team collaboration, agency workspace, white label, and website export when their catalog status is not available yet.",
    category: "Coming Soon",
    sourceType: "roadmap",
    tags: ["roadmap", "features"],
    priority: 82,
  },
  {
    title: "What can I manage from dashboard?",
    question: "What can I manage from dashboard?",
    answer:
      "The dashboard is the workspace for generated sites, profile and personal information, plan-aware features, media workflows, settings, and related account areas.",
    category: "Dashboard",
    sourceType: "feature",
    tags: ["dashboard", "management"],
    priority: 80,
  },
  {
    title: "Is my account secure?",
    question: "Is my account secure?",
    answer:
      "SiteCraft AI protects accounts with authentication, email verification, sessions, and role-aware access for protected areas.",
    category: "Security",
    sourceType: "policy",
    tags: ["security", "authentication"],
    priority: 78,
  },
  {
    title: "How do pricing plans work?",
    question: "How do pricing plans work?",
    answer:
      "Plans define access to website capacity, themes, templates, AI credits, and feature availability. The pricing page shows current public plan limits.",
    category: "Plans & Pricing",
    sourceType: "pricing",
    tags: ["pricing", "limits", "plans"],
    priority: 83,
  },
];

export function normalizeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function sanitizeKnowledgeInput(body = {}) {
  const title = String(body.title || "").trim();
  const question = String(body.question || "").trim();
  const status = KNOWLEDGE_STATUSES.includes(body.status) ? body.status : "draft";
  const visibility = KNOWLEDGE_VISIBILITIES.includes(body.visibility)
    ? body.visibility
    : "public";
  const reviewStatus = KNOWLEDGE_REVIEW_STATUSES.includes(body.reviewStatus)
    ? body.reviewStatus
    : "needs_review";
  const sourceType = KNOWLEDGE_SOURCE_TYPES.includes(body.sourceType)
    ? body.sourceType
    : "general";
  const category = String(body.category || "General").trim();
  const isPublicFAQ = Boolean(body.isPublicFAQ);
  const isAIAccessible = Boolean(body.isAIAccessible);

  return {
    title,
    slug: normalizeSlug(body.slug || question || title),
    question,
    answer: String(body.answer || "").trim(),
    category,
    tags: sanitizeList(body.tags),
    status,
    visibility,
    priority: Number(body.priority || 0),
    sourceType,
    relatedPlans: sanitizeList(body.relatedPlans),
    relatedFeatures: sanitizeList(body.relatedFeatures),
    relatedCategories: sanitizeList(body.relatedCategories),
    relatedTemplates: sanitizeList(body.relatedTemplates),
    relatedThemes: sanitizeList(body.relatedThemes),
    isAIAccessible,
    isPublicFAQ,
    isFeatured: Boolean(body.isFeatured),
    sortOrder: Number(body.sortOrder || 0),
    lastReviewedAt: body.lastReviewedAt ? new Date(body.lastReviewedAt) : undefined,
    reviewStatus,
  };
}

export function validateKnowledgePayload(payload) {
  if (!payload.title) return "Title is required.";
  if (!payload.answer) return "Answer is required.";
  if (!payload.category) return "Category is required.";
  if (!payload.slug) return "Slug is required.";
  if (payload.isPublicFAQ && (!payload.question || !payload.answer)) {
    return "Public FAQ entries must include a question and answer.";
  }
  if (payload.visibility === "admin_only" && (payload.isPublicFAQ || payload.isAIAccessible)) {
    return "Admin-only entries cannot be public FAQ or AI accessible.";
  }
  if (payload.isAIAccessible && payload.status !== "published") {
    return "AI accessible entries must be published.";
  }
  if (payload.isAIAccessible && payload.reviewStatus === "outdated") {
    return "Outdated entries cannot be AI accessible.";
  }
  return "";
}

export function serializeKnowledgeEntry(entry) {
  const plain = entry.toObject ? entry.toObject() : entry;
  return {
    id: plain._id ? plain._id.toString() : plain.id,
    title: plain.title,
    slug: plain.slug,
    question: plain.question || "",
    answer: plain.answer,
    category: plain.category,
    tags: plain.tags || [],
    status: plain.status,
    visibility: plain.visibility,
    priority: Number(plain.priority || 0),
    sourceType: plain.sourceType,
    relatedPlans: plain.relatedPlans || [],
    relatedFeatures: plain.relatedFeatures || [],
    relatedCategories: plain.relatedCategories || [],
    relatedTemplates: plain.relatedTemplates || [],
    relatedThemes: plain.relatedThemes || [],
    isAIAccessible: Boolean(plain.isAIAccessible),
    isPublicFAQ: Boolean(plain.isPublicFAQ),
    isFeatured: Boolean(plain.isFeatured),
    sortOrder: Number(plain.sortOrder || 0),
    lastReviewedAt: plain.lastReviewedAt,
    reviewStatus: plain.reviewStatus,
    createdBy: plain.createdBy || "",
    updatedBy: plain.updatedBy || "",
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

function labels(items) {
  return items.map((item) => item.label || item.name || item.title || item.slug).filter(Boolean);
}

function planLimitText(plans, limitKey, label) {
  return plans
    .map((plan) => {
      const value = Number(plan.limits?.[limitKey] || 0);
      return `${plan.name}: ${value} ${label}${value === 1 ? "" : "s"}`;
    })
    .join(", ");
}

function makeDynamicFaq({ question, answer, category, sourceType, priority, tags = [] }) {
  const slug = `dynamic-${normalizeSlug(question)}`;
  return {
    id: slug,
    title: question,
    slug,
    question,
    answer,
    category,
    tags,
    status: "published",
    visibility: "public",
    priority,
    sourceType,
    relatedPlans: [],
    relatedFeatures: [],
    relatedCategories: [],
    relatedTemplates: [],
    relatedThemes: [],
    isAIAccessible: true,
    isPublicFAQ: true,
    isFeatured: false,
    sortOrder: 0,
    lastReviewedAt: null,
    reviewStatus: "verified",
    createdBy: "system",
    updatedBy: "system",
    createdAt: null,
    updatedAt: null,
  };
}

async function getDynamicPublicFaqEntries() {
  const availability = await getPublicAvailability();
  const planNames = availability.publicPlans.map((plan) => plan.name).join(", ");
  const availableCategories = labels(availability.availableCategories);
  const comingSoonCategories = labels(availability.comingSoonCategories);
  const activeFeatures = labels(availability.activeFeatures);
  const inProgressFeatures = labels(
    availability.comingSoonFeatures.filter((feature) => feature.status === "in_progress"),
  );
  const comingSoonFeatures = labels(
    availability.comingSoonFeatures.filter((feature) => feature.status === "coming_soon"),
  );
  const themeLimits = planLimitText(availability.publicPlans, "themes", "theme");
  const templateLimits = planLimitText(availability.publicPlans, "templates", "template");
  const websiteLimits = planLimitText(availability.publicPlans, "websites", "website");
  const creditLimits = planLimitText(availability.publicPlans, "aiCreditsPerMonth", "AI credit");

  const entries = [
    makeDynamicFaq({
      question: "What is SiteCraft AI?",
      answer:
        "SiteCraft AI helps users create a website foundation with AI-assisted generation, guided inputs, templates, themes, and dashboard workflows.",
      category: "General",
      sourceType: "general",
      priority: 100,
      tags: ["overview", "sitecraft"],
    }),
    makeDynamicFaq({
      question: "Who is SiteCraft AI for?",
      answer:
        "SiteCraft AI is useful for creators, personal brands, freelancers, students, professionals, and small businesses that want a guided starting point for a website.",
      category: "General",
      sourceType: "general",
      priority: 92,
      tags: ["users", "audience"],
    }),
    makeDynamicFaq({
      question: "How does SiteCraft AI work?",
      answer:
        "SiteCraft AI collects website purpose, profile details, template direction, and theme choices, then creates a website foundation that users can review and manage.",
      category: "AI Website Generation",
      sourceType: "how_it_works",
      priority: 98,
      tags: ["generation", "workflow"],
    }),
    makeDynamicFaq({
      question: "Can AI generate my full website instantly?",
      answer:
        "SiteCraft AI generates a strong website foundation. Users should still review content, details, and design choices before publishing or sharing a site.",
      category: "AI Website Generation",
      sourceType: "how_it_works",
      priority: 90,
      tags: ["ai", "generation"],
    }),
    makeDynamicFaq({
      question: "Which plan is best for me?",
      answer:
        "Free is best for trying SiteCraft AI. Basic is best for personal brands, freelancers, and small businesses that need more capacity. Pro is best for professionals who need more websites, more themes, higher AI usage, priority support, and stronger growth features.",
      category: "Plans & Pricing",
      sourceType: "pricing",
      priority: 100,
      tags: ["plans", "recommendation"],
    }),
    makeDynamicFaq({
      question: "Which plans are available?",
      answer: `The active public SiteCraft AI plans are ${planNames}. Agency tools are planned for future releases and are not currently an active public plan.`,
      category: "Plans & Pricing",
      sourceType: "pricing",
      priority: 96,
      tags: ["plans", "pricing"],
    }),
    makeDynamicFaq({
      question: "How many websites are included in each plan?",
      answer: `${websiteLimits}. These limits come from current public plan data.`,
      category: "Plans & Pricing",
      sourceType: "pricing",
      priority: 88,
      tags: ["limits", "websites"],
    }),
    makeDynamicFaq({
      question: "How many AI credits are included in each plan?",
      answer: `${creditLimits}. AI credits represent monthly AI-assisted usage for supported generation workflows.`,
      category: "Plans & Pricing",
      sourceType: "pricing",
      priority: 84,
      tags: ["ai credits", "limits"],
    }),
    makeDynamicFaq({
      question: "Are open-ended websites available?",
      answer:
        "SiteCraft AI uses clear plan limits so users can understand exactly what each plan includes.",
      category: "Plans & Pricing",
      sourceType: "pricing",
      priority: 80,
      tags: ["limits"],
    }),
    makeDynamicFaq({
      question: "What is the difference between templates and themes?",
      answer:
        "Templates control website structure, layout, and section flow. Themes control the visual style, colors, typography, and overall design feel.",
      category: "Themes & Templates",
      sourceType: "template",
      priority: 100,
      tags: ["templates", "themes"],
    }),
    makeDynamicFaq({
      question: "How many templates are active right now?",
      answer: `SiteCraft AI currently has ${availability.activeTemplateCount} active template${availability.activeTemplateCount === 1 ? "" : "s"}. Only active templates are shown as available.`,
      category: "Themes & Templates",
      sourceType: "template",
      priority: 94,
      tags: ["templates", "count"],
    }),
    makeDynamicFaq({
      question: "How many themes are active right now?",
      answer: `SiteCraft AI currently has ${availability.activeThemeCount} active theme${availability.activeThemeCount === 1 ? "" : "s"}. Only active themes are shown as available.`,
      category: "Themes & Templates",
      sourceType: "theme",
      priority: 92,
      tags: ["themes", "count"],
    }),
    makeDynamicFaq({
      question: "How many themes are included in each plan?",
      answer: `${themeLimits}. Actual choices also depend on the current active theme inventory.`,
      category: "Themes & Templates",
      sourceType: "theme",
      priority: 90,
      tags: ["themes", "plans"],
    }),
    makeDynamicFaq({
      question: "How many templates are included in each plan?",
      answer: `${templateLimits}. Actual choices also depend on the current active template inventory.`,
      category: "Themes & Templates",
      sourceType: "template",
      priority: 89,
      tags: ["templates", "plans"],
    }),
    makeDynamicFaq({
      question: "Can I change my theme later?",
      answer:
        "Theme choice is part of the SiteCraft AI workflow and dashboard experience. Available theme options depend on the active theme inventory and the user's plan limits.",
      category: "Themes & Templates",
      sourceType: "theme",
      priority: 82,
      tags: ["themes", "dashboard"],
    }),
    makeDynamicFaq({
      question: "Which website category is available now?",
      answer: availableCategories.length
        ? `Currently available SiteCraft AI category: ${availableCategories.join(", ")}.`
        : "No public website category is currently confirmed as available yet.",
      category: "Categories & Industries",
      sourceType: "category",
      priority: 100,
      tags: ["categories", "available"],
    }),
    makeDynamicFaq({
      question: "Are business websites available?",
      answer:
        "Business websites are not currently available. They are listed as coming soon or planned until platform availability changes.",
      category: "Categories & Industries",
      sourceType: "category",
      priority: 96,
      tags: ["business", "categories"],
    }),
    makeDynamicFaq({
      question: "Can I create a portfolio website now?",
      answer: availableCategories.some((item) => item.toLowerCase().includes("portfolio"))
        ? "Portfolio websites are currently available in SiteCraft AI."
        : "Portfolio websites are not currently confirmed as available yet.",
      category: "Categories & Industries",
      sourceType: "category",
      priority: 95,
      tags: ["portfolio", "categories"],
    }),
    makeDynamicFaq({
      question: "Which categories are coming soon?",
      answer: comingSoonCategories.length
        ? `Categories coming soon or planned include: ${comingSoonCategories.join(", ")}. These are not currently available until their platform status changes.`
        : "No coming soon categories are currently listed in public availability data.",
      category: "Categories & Industries",
      sourceType: "roadmap",
      priority: 86,
      tags: ["categories", "coming soon"],
    }),
    makeDynamicFaq({
      question: "What can I manage from the dashboard?",
      answer:
        "The dashboard supports generated sites, profile and personal information, plan-aware areas, media workflows, settings, notifications, and related account sections.",
      category: "Dashboard",
      sourceType: "feature",
      priority: 94,
      tags: ["dashboard", "management"],
    }),
    makeDynamicFaq({
      question: "Can I manage my sites after generation?",
      answer:
        "Yes. Generated sites are managed from the dashboard, where users can review site work and use available account and management tools.",
      category: "Dashboard",
      sourceType: "feature",
      priority: 86,
      tags: ["dashboard", "sites"],
    }),
    makeDynamicFaq({
      question: "Is my account secure?",
      answer:
        "SiteCraft AI uses authentication, email verification, session checks, and role-aware access for protected areas.",
      category: "Security",
      sourceType: "policy",
      priority: 92,
      tags: ["security", "account"],
    }),
    makeDynamicFaq({
      question: "Does SiteCraft AI expose private user data to public AI answers?",
      answer:
        "No. Public help answers use public-safe platform data and approved knowledge content. Private user data, admin-only fields, secrets, payment secrets, and internal logs are not included.",
      category: "Security",
      sourceType: "policy",
      priority: 88,
      tags: ["privacy", "ai safety"],
    }),
    makeDynamicFaq({
      question: "What features are available now?",
      answer: activeFeatures.length
        ? `Available SiteCraft AI features include: ${activeFeatures.slice(0, 10).join(", ")}.`
        : "No public features are currently listed as available.",
      category: "General",
      sourceType: "feature",
      priority: 83,
      tags: ["features", "available"],
    }),
    makeDynamicFaq({
      question: "What features are coming soon?",
      answer: [
        inProgressFeatures.length ? `In progress: ${inProgressFeatures.join(", ")}` : "",
        comingSoonFeatures.length ? `Coming soon: ${comingSoonFeatures.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(". ")
        .concat(". These features are not live yet and will only be treated as released after their backend status changes."),
      category: "Coming Soon",
      sourceType: "roadmap",
      priority: 100,
      tags: ["features", "roadmap"],
    }),
    makeDynamicFaq({
      question: "Is Agency plan available?",
      answer:
        "Agency tools are planned for future releases and are not currently available as an active public plan.",
      category: "Coming Soon",
      sourceType: "roadmap",
      priority: 98,
      tags: ["agency", "plans"],
    }),
    makeDynamicFaq({
      question: "Are custom domains available now?",
      answer:
        "Custom domain tools are in progress or planned based on feature status. They should not be treated as live until backend availability confirms release.",
      category: "Coming Soon",
      sourceType: "feature",
      priority: 82,
      tags: ["domains", "coming soon"],
    }),
    makeDynamicFaq({
      question: "Are analytics available now?",
      answer:
        "Website analytics are in progress or planned based on feature status. They should not be treated as live until backend availability confirms release.",
      category: "Coming Soon",
      sourceType: "feature",
      priority: 81,
      tags: ["analytics", "coming soon"],
    }),
  ];

  return entries;
}

function mergeFaqEntries(dbEntries, dynamicEntries) {
  const seen = new Set();
  return [...dbEntries, ...dynamicEntries]
    .filter((entry) => {
      const key = normalizeSlug(entry.question || entry.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare) return categoryCompare;
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.question.localeCompare(b.question);
    });
}

export function publicFaqQuery() {
  return {
    status: "published",
    visibility: "public",
    isPublicFAQ: true,
    reviewStatus: { $ne: "outdated" },
  };
}

export function aiKnowledgeQuery() {
  return {
    status: "published",
    visibility: { $in: ["public", "ai_only"] },
    isAIAccessible: true,
    reviewStatus: { $ne: "outdated" },
  };
}

export async function getPublicFaqEntries() {
  await dbConnect();
  const entries = await KnowledgeBase.find(publicFaqQuery())
    .sort({ category: 1, priority: -1, sortOrder: 1, updatedAt: -1 })
    .lean();
  const dbEntries = entries.map(serializeKnowledgeEntry);
  const dynamicEntries = await getDynamicPublicFaqEntries();
  return mergeFaqEntries(dbEntries, dynamicEntries);
}

export async function seedDefaultKnowledgeBase({ createdBy = "system" } = {}) {
  await dbConnect();
  const results = [];

  for (const entry of defaultKnowledgeEntries) {
    const payload = {
      ...entry,
      slug: normalizeSlug(entry.question || entry.title),
      status: "published",
      visibility: "public",
      isAIAccessible: true,
      isPublicFAQ: true,
      reviewStatus: "verified",
      lastReviewedAt: new Date(),
      createdBy,
      updatedBy: createdBy,
    };
    const doc = await KnowledgeBase.findOneAndUpdate(
      { slug: payload.slug },
      { $setOnInsert: payload },
      { upsert: true, new: true, runValidators: true },
    ).lean();
    results.push(serializeKnowledgeEntry(doc));
  }

  return results;
}

export function getKnowledgeStats(entries) {
  const dates = entries.map((entry) => entry.updatedAt).filter(Boolean);
  const lastUpdated = dates.length
    ? dates.sort((a, b) => new Date(b) - new Date(a))[0]
    : null;

  return {
    total: entries.length,
    published: entries.filter((entry) => entry.status === "published").length,
    draft: entries.filter((entry) => entry.status === "draft").length,
    aiAccessible: entries.filter((entry) => entry.isAIAccessible).length,
    publicFAQ: entries.filter((entry) => entry.isPublicFAQ).length,
    needsReview: entries.filter((entry) => entry.reviewStatus === "needs_review").length,
    outdated: entries.filter((entry) => entry.reviewStatus === "outdated").length,
    lastUpdated,
  };
}
