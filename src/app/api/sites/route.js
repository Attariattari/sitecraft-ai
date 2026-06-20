import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";

/**
 * GET /api/sites
 * Get all sites (optionally filtered by userId)
 */
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let query = {};

    if (userId) {
      query.ownerId = userId;
    }

    if (status) {
      query.status = status;
    }

    const sites = await Site.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      sites,
    });
  } catch (error) {
    console.error("Get sites error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sites
 * Create a new site (from template, not from AI generation)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    await dbConnect();

    const { category = "portfolio", templateId, themeId = "emerald" } = body;

    const site = new Site({
      category,
      templateId,
      themeId,
      status: "draft",
      settings: {
        selectedTheme: themeId,
      },
    });

    await site.save();

    return NextResponse.json(
      {
        success: true,
        site,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create site error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
