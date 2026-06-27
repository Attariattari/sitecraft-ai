import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getPublicTemplates, isTemplateAllowedForPlan } from "@/lib/templates/templateService";
import { getUserPlanSlug } from "@/lib/plans/planEntitlements";

export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "portfolio";
  const templates = (await getPublicTemplates({ status: "active", category })).map((template) => ({
    ...template,
    locked: !isTemplateAllowedForPlan(template, getUserPlanSlug(user)),
  }));

  return NextResponse.json({ success: true, templates });
}
