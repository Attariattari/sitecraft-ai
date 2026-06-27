import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import { getAutomationSettings, updateAutomationSettings } from "@/lib/blogs/blogService";
import { BLOG_CATEGORIES } from "@/lib/blogs/blogConstants";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";

export async function GET() {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;
    const settings = await getAutomationSettings();
    return NextResponse.json({ success: true, settings, categories: BLOG_CATEGORIES });
  } catch (error) {
    logServerError("Blog automation settings GET error", error);
    return safeErrorResponse();
  }
}

export async function PATCH(request) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;
    const body = await request.json();
    const settings = await updateAutomationSettings(body, user);
    await createAuditLog({
      user,
      request,
      action: "blog_automation.settings_update",
      targetType: "blogAutomationSetting",
      targetId: settings.id || settings._id || "",
      metadata: {
        enabled: settings.enabled,
        frequencyHours: settings.frequencyHours,
        autoPublishAfterAIApproval: settings.autoPublishAfterAIApproval,
      },
    });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    logServerError("Blog automation settings PATCH error", error);
    return safeErrorResponse();
  }
}
