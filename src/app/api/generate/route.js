import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import AIUsageLog from "@/models/AIUsageLog";
import User from "@/models/User";
import { generateInputSchema, generateSafeSlug } from "@/lib/validations/siteValidation";
import { generatePortfolioWebsite } from "@/lib/ai/siteGenerator";
import { isCategorySelectable } from "@/lib/categories/categoryService";
import { getAvailableThemes, isThemeSelectable } from "@/lib/themes/themeService";
import { applyThemePlanLimit } from "@/lib/themes/themePlanLimits";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  requireFeature,
  requireLimit,
  getUserPlanSlug,
} from "@/lib/plans/planEntitlements";

function planBlockResponse(result, status = 403) {
  return NextResponse.json(
    {
      success: false,
      code: result.code,
      message: result.message,
      upgradeTo: result.upgradeTo,
    },
    { status },
  );
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = generateInputSchema.parse(body);

    // Connect to database
    await dbConnect();

    const currentUser = await getCurrentUser();
    const entitlementUser = currentUser || { plan: "free" };

    const generationAccess = requireFeature(entitlementUser, "aiWebsiteGeneration");
    if (!generationAccess.allowed) {
      return planBlockResponse(generationAccess);
    }

    const websitesCreated = currentUser
      ? await Site.countDocuments({ ownerId: currentUser.id })
      : 0;
    const websiteLimit = requireLimit(entitlementUser, "websites", websitesCreated);
    if (!websiteLimit.allowed) {
      return planBlockResponse(websiteLimit, 429);
    }

    const aiCreditsUsed = currentUser?.usage?.aiCreditsUsedThisMonth || 0;
    const aiCreditLimit = requireLimit(entitlementUser, "aiCreditsPerMonth", aiCreditsUsed);
    if (!aiCreditLimit.allowed) {
      return planBlockResponse(aiCreditLimit, 429);
    }

    // Validate category and theme availability server-side
    const categoryOk = await isCategorySelectable(validatedData.category);
    if (!categoryOk) {
      return NextResponse.json({ success: false, error: "This website purpose is currently unavailable." }, { status: 400 });
    }

    if (validatedData.themeKey) {
      const themeOk = await isThemeSelectable(validatedData.themeKey);
      if (!themeOk) {
        return NextResponse.json({ success: false, error: "This theme is currently unavailable." }, { status: 400 });
      }

      const planThemes = applyThemePlanLimit(
        await getAvailableThemes("generate"),
        getUserPlanSlug(entitlementUser),
      );
      const themeAllowedByPlan = planThemes.some((theme) => {
        return theme.themeId === validatedData.themeKey || theme.slug === validatedData.themeKey;
      });

      if (!themeAllowedByPlan) {
        return NextResponse.json(
          {
            success: false,
            code: "PLAN_LIMIT_REACHED",
            message: "Upgrade to access more themes.",
            upgradeTo: "basic",
          },
          { status: 403 },
        );
      }
    }

    // Generate content using AI
    const generationResult = await generatePortfolioWebsite({
      fullName: validatedData.fullName,
      headline: validatedData.headline,
      bio: validatedData.bio,
      email: validatedData.email,
      githubUrl: validatedData.githubUrl || "",
      skills: validatedData.skills || [],
    });

    // Generate unique slug
    const baseSlug = generateSafeSlug(validatedData.fullName);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug uniqueness
    while (await Site.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create Site document
    const site = new Site({
      ownerId: currentUser?.id || null,
      category: validatedData.category,
      templateId: null, // Will be set from AI recommendation
      themeId: validatedData.themeKey,
      slug,
      status: "generated",
      isPublished: false,
      inputData: {
        name: validatedData.fullName,
        profession: validatedData.headline,
        bio: validatedData.bio,
        email: validatedData.email,
        socialLinks: {
          github: validatedData.githubUrl || "",
        },
        skills: validatedData.skills || [],
      },
      generatedContent: generationResult.data,
      settings: {
        selectedTheme: validatedData.themeKey,
        selectedTemplate: generationResult.data.templateRecommendation.templateKey,
        mode: validatedData.colorMode,
      },
    });

    await site.save();

    // Log AI usage
    const usageLog = new AIUsageLog({
      userId: null,
      siteId: site._id,
      provider: "gemini",
      model: "gemini-2.0-flash",
      promptTokens: generationResult.tokens.prompt,
      outputTokens: generationResult.tokens.output,
      status: generationResult.success ? "success" : "partial",
      error: generationResult.error || null,
    });

    await usageLog.save();

    if (currentUser) {
      await User.findByIdAndUpdate(currentUser.id, {
        $inc: {
          "usage.websitesCreated": 1,
          "usage.aiCreditsUsedThisMonth": 1,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        siteId: site._id,
        slug: site.slug,
        generatedContent: site.generatedContent,
        settings: site.settings,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Generate API error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate website",
      },
      { status: 500 }
    );
  }
}
