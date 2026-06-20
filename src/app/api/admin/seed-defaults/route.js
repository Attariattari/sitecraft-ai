import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Template from "@/models/Template";
import { siteCraftCategories, siteCraftTemplates } from "@/lib/data";

export async function POST(request) {
  try {
    await dbConnect();

    const results = {
      categories: { created: 0, skipped: 0 },
      templates: { created: 0, skipped: 0 },
    };

    // Seed categories
    for (const category of siteCraftCategories) {
      const exists = await Category.findOne({ slug: category.slug });

      if (!exists) {
        await Category.create(category);
        results.categories.created++;
      } else {
        results.categories.skipped++;
      }
    }

    // Seed templates
    for (const template of siteCraftTemplates) {
      const exists = await Template.findOne({ slug: template.slug });

      if (!exists) {
        await Template.create(template);
        results.templates.created++;
      } else {
        results.templates.skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Default data seeded successfully",
      results,
    });
  } catch (error) {
    console.error("Seed defaults error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
