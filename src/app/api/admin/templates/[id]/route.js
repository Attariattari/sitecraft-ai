import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Template from "@/models/Template";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { serializeTemplate } from "@/lib/templates/templateService";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";
import { cleanTemplatePayload, invalidateTemplateData } from "@/lib/templates/adminTemplatePayload";

export async function GET(_request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;
  await dbConnect();
  const template = await Template.findById(id).lean();
  if (!template) return safeErrorResponse("Template not found.", 404);
  return NextResponse.json({ success: true, template: serializeTemplate(template) });
}

export async function PATCH(request, { params }) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    const body = await request.json();
    const payload = cleanTemplatePayload(body);
    await dbConnect();
    const template = await Template.findByIdAndUpdate(
      id,
      { $set: { ...payload, updatedBy: auth.user.id } },
      { returnDocument: "after" },
    );
    if (!template) return safeErrorResponse("Template not found.", 404);
    await invalidateTemplateData();
    await createAuditLog({
      user: auth.user,
      action: "template.updated",
      targetType: "Template",
      targetId: template._id,
      metadata: { slug: template.slug, status: template.status },
      request,
    });
    return NextResponse.json({ success: true, template: serializeTemplate(template) });
  } catch (error) {
    logServerError("Update template error", error);
    return safeErrorResponse();
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;
  await dbConnect();
  const template = await Template.findByIdAndUpdate(
    id,
    { $set: { status: "hidden", isActive: false, isPublic: false, updatedBy: auth.user.id } },
    { returnDocument: "after" },
  );
  if (!template) return safeErrorResponse("Template not found.", 404);
  await invalidateTemplateData();
  await createAuditLog({
    user: auth.user,
    action: "template.hidden",
    targetType: "Template",
    targetId: template._id,
    metadata: { slug: template.slug },
    request,
  });
  return NextResponse.json({ success: true, template: serializeTemplate(template) });
}
