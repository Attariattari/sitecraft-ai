import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getUserPlanSlug } from "@/lib/plans/planEntitlements";
import { getPublicTemplates } from "@/lib/templates/templateService";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await getCurrentUser();
    const planSlug = getUserPlanSlug(user || { plan: "free" });
    const templates = await getPublicTemplates({
      status: searchParams.get("status") || "",
      category: searchParams.get("category") || "",
      plan: searchParams.get("plan") || "",
      search: searchParams.get("search") || "",
      featured: searchParams.get("featured") || "",
    });
    const activeTemplates = templates.filter((template) => template.status === "active");

    return NextResponse.json({
      success: true,
      templates: templates.map((template) => ({
        ...template,
        locked: template.status === "active" && !template.availablePlans.includes(planSlug),
        upgradeTo: template.availablePlans.includes("basic") ? "basic" : "pro",
      })),
      count: templates.length,
      activeCount: activeTemplates.length,
      plan: planSlug,
    });
  } catch (error) {
    logServerError("Get templates error", error);
    return safeErrorResponse();
  }
}
