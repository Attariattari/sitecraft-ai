import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Template from "@/models/Template";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { serializeTemplate } from "@/lib/templates/templateService";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";
import { cleanTemplatePayload, invalidateTemplateData } from "@/lib/templates/adminTemplatePayload";

export async function GET() {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;
  await dbConnect();
  const templates = await Template.find({}).sort({ sortOrder: 1, order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ success: true, templates: templates.map(serializeTemplate) });
}

export async function POST(request) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;
    const body = await request.json();
    const payload = cleanTemplatePayload(body);
    if (!payload.name || !payload.slug) return safeErrorResponse("Template name and slug are required.", 400);
    await dbConnect();
    const template = await Template.create({ ...payload, createdBy: auth.user.id, updatedBy: auth.user.id });
    await invalidateTemplateData();
    await createAuditLog({
      user: auth.user,
      action: "template.created",
      targetType: "Template",
      targetId: template._id,
      metadata: { slug: template.slug, status: template.status },
      request,
    });
    return NextResponse.json({ success: true, template: serializeTemplate(template) });
  } catch (error) {
    logServerError("Create template error", error);
    return safeErrorResponse("Template could not be saved.", 400);
  }
}
