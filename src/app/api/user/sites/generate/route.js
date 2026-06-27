import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import GeneratedSite from "@/models/GeneratedSite";
import PersonalInfo from "@/models/PersonalInfo";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";
import { readJson } from "@/lib/server/security/validateRequest";
import { isCategorySelectable } from "@/lib/categories/categoryService";
import { getActiveTemplateBySlug } from "@/lib/templates/templateService";
import { getPlanLimits, getUserPlanSlug, requireFeature } from "@/lib/plans/planEntitlements";
import { canUseTheme, canUseTemplate, getPlanLimitMessage } from "@/lib/server/plans/planEntitlements";
import { checkWebsiteLimit } from "@/lib/server/plans/checkWebsiteLimit";
import { getMissingRequiredFields, getRequiredFieldLabel, normalizePersonalInfoForCategory } from "@/lib/templates/categorySchemas";
import { getAvailableThemes } from "@/lib/themes/themeService";
import { generateUniqueSiteSlug } from "@/lib/server/sites/generateUniqueSiteSlug";
import { invalidateUserCache } from "@/lib/server/cache/cacheInvalidation";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";

const generateSiteSchema = z.object({
  title: z.string().trim().min(2, "Website title is required.").max(120),
  description: z.string().trim().max(500).optional().default(""),
  category: z.string().trim().default("portfolio"),
  targetAudience: z.string().trim().max(180).optional().default(""),
  primaryGoal: z.string().trim().max(180).optional().default(""),
  templateSlug: z.string().trim().min(1, "Template is required."),
  themeSlug: z.string().trim().min(1, "Theme is required."),
  selectedPages: z.array(z.string().trim()).optional().default([]),
  contactVisibility: z.object({
    email: z.boolean().optional().default(true),
    phone: z.boolean().optional().default(false),
    location: z.boolean().optional().default(false),
    socialLinks: z.boolean().optional().default(true),
  }).optional().default({}),
  seo: z.object({
    metaTitle: z.string().trim().max(120).optional().default(""),
    metaDescription: z.string().trim().max(180).optional().default(""),
    keywords: z.array(z.string().trim()).optional().default([]),
  }).optional().default({}),
  useAIContentEnhancement: z.boolean().optional().default(false),
});

function planLimitResponse(limit) {
  return NextResponse.json(
    {
      success: false,
      code: "WEBSITE_LIMIT_REACHED",
      currentPlan: limit.planSlug,
      recommendedPlan: limit.recommendedPlan,
      message: limit.reason,
      currentCount: limit.currentCount,
      limit: limit.limit,
    },
    { status: 429 },
  );
}

export async function POST(request) {
  const rate = await enforceRateLimit(request, "user-site-generate", { limit: 8, windowMs: 10 * 60 * 1000 });
  if (!rate.allowed) return rate.response;

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const body = await readJson(request, 48 * 1024);
  const parsed = generateSiteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Please complete the website setup details." }, { status: 400 });
  }

  const input = parsed.data;
  await dbConnect();

  const planSlug = getUserPlanSlug(user);
  const featureAccess = requireFeature(user, "aiWebsiteGeneration");
  if (!featureAccess.allowed) {
    return NextResponse.json({ success: false, code: featureAccess.code, message: featureAccess.message, recommendedPlan: featureAccess.upgradeTo }, { status: 403 });
  }

  const websiteLimit = await checkWebsiteLimit(user.id, planSlug);
  if (!websiteLimit.allowed) return planLimitResponse(websiteLimit);

  const aiCreditsUsed = user?.usage?.aiCreditsUsedThisMonth || 0;
  const aiCreditLimit = getPlanLimits(planSlug).aiCreditsPerMonth;
  if (input.useAIContentEnhancement && aiCreditLimit !== null && aiCreditsUsed >= aiCreditLimit) {
    return NextResponse.json(
      {
        success: false,
        code: "AI_CREDITS_REACHED",
        currentPlan: planSlug,
        recommendedPlan: planSlug === "free" ? "basic" : planSlug === "basic" ? "pro" : "",
        message: getPlanLimitMessage(planSlug, "aiCredits"),
      },
      { status: 429 },
    );
  }

  if (!(await isCategorySelectable(input.category))) {
    return NextResponse.json({ success: false, message: "This website category is not available yet." }, { status: 400 });
  }

  const template = await getActiveTemplateBySlug(input.templateSlug);
  if (!template || template.category !== input.category) {
    return NextResponse.json({ success: false, message: "This template is not available for this category." }, { status: 400 });
  }

  const templateAccess = await canUseTemplate(user.id, template);
  if (!templateAccess.allowed) {
    return NextResponse.json({ success: false, code: "TEMPLATE_LOCKED", message: "Upgrade to unlock this template.", recommendedPlan: templateAccess.recommendedPlan }, { status: 403 });
  }

  const themeAccess = await canUseTheme(user.id, input.themeSlug, "generate");
  if (!themeAccess.allowed) {
    return NextResponse.json({ success: false, code: "THEME_LOCKED", message: "Upgrade to access this theme.", recommendedPlan: themeAccess.recommendedPlan }, { status: 403 });
  }

  const theme = (await getAvailableThemes("generate")).find((item) => item.themeId === input.themeSlug || item.slug === input.themeSlug);
  if (!theme) {
    return NextResponse.json({ success: false, message: "This theme is not available." }, { status: 400 });
  }

  const personalInfo = await PersonalInfo.findOne({ userId: user.id }).lean();
  const missing = getMissingRequiredFields(personalInfo || {}, input.category, template.requiredFields);
  if (missing.length) {
    return NextResponse.json(
      {
        success: false,
        code: "MISSING_PERSONAL_INFO",
        message: "Complete your Personal Info before generating this website.",
        missingFields: missing.map((field) => ({ field, label: getRequiredFieldLabel(field) })),
        cta: { label: "Update Personal Info", href: "/dashboard/personal-info" },
      },
      { status: 422 },
    );
  }

  const normalized = normalizePersonalInfoForCategory(personalInfo, input.category);
  const visibleProfile = {
    ...normalized.profile,
    email: input.contactVisibility.email ? normalized.profile.email : "",
    phone: input.contactVisibility.phone ? normalized.profile.phone : "",
    location: input.contactVisibility.location ? normalized.profile.location : "",
    socialLinks: input.contactVisibility.socialLinks ? normalized.profile.socialLinks : {},
  };
  const selectedPages = input.selectedPages.length ? input.selectedPages : template.pages?.filter((page) => !page.optional).map((page) => page.slug) || [];
  const pages = (template.pages || []).filter((page) => selectedPages.includes(page.slug) || page.slug === "home");
  const slug = await generateUniqueSiteSlug(input.title);
  const seo = {
    metaTitle: input.seo.metaTitle || input.title || `${normalized.profile.fullName} | ${normalized.profile.headline}`,
    metaDescription: input.seo.metaDescription || input.description || normalized.profile.bio,
    keywords: input.seo.keywords || [],
    ogImage: normalized.profile.coverImage || normalized.profile.profileImage || template.previewImage || "",
  };
  const snapshot = {
    profile: visibleProfile,
    professional: normalized.professional,
    purpose: {
      ...normalized.portfolio,
      websiteTitle: input.title,
      websiteDescription: input.description,
      targetAudience: input.targetAudience,
      primaryGoal: input.primaryGoal,
    },
  };

  const site = await Site.create({
    ownerId: user.id,
    category: input.category,
    templateId: template.id,
    templateSlug: template.slug,
    themeId: input.themeSlug,
    themeSlug: input.themeSlug,
    siteName: input.title,
    description: input.description,
    slug,
    status: "generated",
    isPublished: false,
    inputData: {
      name: normalized.profile.fullName,
      profession: normalized.profile.headline,
      bio: normalized.profile.bio,
      email: visibleProfile.email,
      phone: visibleProfile.phone,
      skills: normalized.professional.skills,
      projects: normalized.professional.projects,
      services: normalized.professional.services,
      experience: normalized.professional.experience,
      socialLinks: visibleProfile.socialLinks,
      websiteGoal: input.primaryGoal,
    },
    pages,
    selectedPages,
    personalInfoSnapshot: snapshot,
    templateSnapshot: template,
    themeSnapshot: theme,
    seo,
    generationSettings: {
      targetAudience: input.targetAudience,
      primaryGoal: input.primaryGoal,
      contactVisibility: input.contactVisibility,
      selectedSections: pages.flatMap((page) => page.sections || []),
      useAIContentEnhancement: input.useAIContentEnhancement,
      generatedFrom: "dashboard-generate",
    },
    planAtGeneration: { slug: planSlug },
    aiCreditsUsed: 0,
    settings: {
      selectedTheme: input.themeSlug,
      selectedTemplate: template.slug,
      mode: "system",
    },
  });

  await GeneratedSite.create({
    userId: user.id,
    title: input.title,
    description: input.description,
    category: input.category,
    templateId: template.id,
    templateSlug: template.slug,
    themeId: input.themeSlug,
    themeSlug: input.themeSlug,
    slug,
    status: "preview",
    pages,
    selectedPages,
    personalInfoSnapshot: snapshot,
    templateSnapshot: template,
    themeSnapshot: theme,
    seo,
    generationSettings: {
      targetAudience: input.targetAudience,
      primaryGoal: input.primaryGoal,
      contactVisibility: input.contactVisibility,
      selectedSections: pages.flatMap((page) => page.sections || []),
      useAIContentEnhancement: input.useAIContentEnhancement,
      generatedFrom: "dashboard-generate",
    },
    planAtGeneration: { slug: planSlug },
    aiCreditsUsed: 0,
  });

  await User.findByIdAndUpdate(user.id, { $inc: { "usage.websitesCreated": 1 } });
  await Promise.all([
    invalidateUserCache(user.id),
    realtimeEmitter.emitToUser(user.id, "generated-site:created", {
      title: "Website preview created",
      message: `${input.title} is ready to preview.`,
    }),
    realtimeEmitter.emitToUser(user.id, "plan-usage:updated", {
      title: "Plan usage updated",
      message: "Your website usage has been updated.",
    }),
  ]);

  return NextResponse.json({
    success: true,
    siteId: site._id.toString(),
    slug,
    previewUrl: `/dashboard/sites/${site._id}/preview`,
  }, { status: 201 });
}
