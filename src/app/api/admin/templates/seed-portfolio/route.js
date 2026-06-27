import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Template from "@/models/Template";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { PORTFOLIO_TEMPLATE_SEEDS } from "@/lib/templates/portfolioTemplates";
import { invalidateTemplateData } from "@/lib/templates/adminTemplatePayload";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";

export async function POST(request) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  await dbConnect();
  const slugs = PORTFOLIO_TEMPLATE_SEEDS.map((template) => template.slug);
  const existing = new Set((await Template.find({ slug: { $in: slugs } }).select("slug").lean()).map((template) => template.slug));
  const missing = PORTFOLIO_TEMPLATE_SEEDS.filter((template) => !existing.has(template.slug));

  if (missing.length) {
    await Template.insertMany(missing);
    await invalidateTemplateData();
    await createAuditLog({
      user: auth.user,
      action: "templates.seed_portfolio",
      targetType: "Template",
      metadata: { inserted: missing.map((template) => template.slug) },
      request,
    });
  }

  return NextResponse.json({
    success: true,
    inserted: missing.length,
    skipped: existing.size,
  });
}
