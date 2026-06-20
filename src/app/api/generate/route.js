import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import AIUsageLog from "@/models/AIUsageLog";
import { generateInputSchema, generateSafeSlug } from "@/lib/validations/siteValidation";
import { generatePortfolioWebsite } from "@/lib/ai/siteGenerator";
import { nanoid } from "nanoid";
import { isCategorySelectable } from "@/lib/categories/categoryService";
import { isThemeSelectable } from "@/lib/themes/themeService";

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = generateInputSchema.parse(body);

    // Connect to database
    await dbConnect();

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
      ownerId: null, // Temporary - will be set when auth is implemented
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
