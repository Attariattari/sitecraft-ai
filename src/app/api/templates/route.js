import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Template from "@/models/Template";
import { TEMPLATE_REGISTRY } from "@/lib/templateRegistry";
import { siteCraftTemplates } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getPlanLimits, getUserPlanSlug, requireFeature } from "@/lib/plans/planEntitlements";

export async function GET(request) {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    const entitlementUser = user || { plan: "free" };

    const templateAccess = requireFeature(entitlementUser, "templateAccess");
    if (!templateAccess.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: templateAccess.code,
          message: templateAccess.message,
          upgradeTo: templateAccess.upgradeTo,
        },
        { status: 403 },
      );
    }

    // Try to get from database first
    let templates = await Template.find({ isActive: true }).sort({ order: 1 });

    // If empty, seed from local data
    if (templates.length === 0) {
      const created = await Template.insertMany(siteCraftTemplates);
      templates = created;
    }

    // Also include registry templates for current implementation
    const registryTemplates = Object.values(TEMPLATE_REGISTRY).sort(
      (a, b) => a.order - b.order
    );
    const planSlug = getUserPlanSlug(entitlementUser);
    const templateLimit = getPlanLimits(planSlug).templates;
    const visibleTemplates = templateLimit === -1
      ? registryTemplates
      : registryTemplates.slice(0, templateLimit);

    return NextResponse.json({
      success: true,
      templates: visibleTemplates,
      count: visibleTemplates.length,
      plan: planSlug,
      totalAvailable: registryTemplates.length,
    });
  } catch (error) {
    console.error("Get templates error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
