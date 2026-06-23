import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getAvailableThemes } from "@/lib/themes/themeService";
import { applyThemePlanLimit } from "@/lib/themes/themePlanLimits";
import {
  getUserPlanSlug,
  requireFeature,
  requireLimit,
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
    const currentUser = await getCurrentUser();
    const entitlementUser = currentUser || { plan: "free" };

    const templateAccess = requireFeature(entitlementUser, "templateAccess");
    if (!templateAccess.allowed) {
      return planBlockResponse(templateAccess);
    }

    const websitesCreated = currentUser
      ? await Site.countDocuments({ ownerId: currentUser.id })
      : 0;
    const websiteLimit = requireLimit(entitlementUser, "websites", websitesCreated);
    if (!websiteLimit.allowed) {
      return planBlockResponse(websiteLimit, 429);
    }

    const planThemes = applyThemePlanLimit(
      await getAvailableThemes("dashboard"),
      getUserPlanSlug(entitlementUser),
    );
    const themeAllowedByPlan = planThemes.some((theme) => {
      return theme.themeId === themeId || theme.slug === themeId;
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

    const site = new Site({
      ownerId: currentUser?.id || null,
      category,
      templateId,
      themeId,
      status: "draft",
      settings: {
        selectedTheme: themeId,
      },
    });

    await site.save();

    if (currentUser) {
      await User.findByIdAndUpdate(currentUser.id, {
        $inc: { "usage.websitesCreated": 1 },
      });
    }

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
