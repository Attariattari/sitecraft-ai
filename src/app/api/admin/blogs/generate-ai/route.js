import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import { runAIBlogWorkflow } from "@/lib/ai/blog/runAIBlogWorkflow";
import { serializeBlog } from "@/lib/blogs/blogService";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";
import { trimPrompt } from "@/lib/server/ai/aiSafeContext";

export async function POST(request) {
  try {
    const rate = await enforceRateLimit(request, "admin-generate-ai-blog", { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!rate.allowed) return rate.response;
    const { user, error } = await requireSuperAdmin();
    if (error) return error;
    const body = await request.json().catch(() => ({}));
    const result = await runAIBlogWorkflow({
      source: "ai_manual",
      force: true,
      topic: trimPrompt(body.topic, 180),
      triggeredBy: user.email || user.id,
    });
    await createAuditLog({
      user,
      request,
      action: "blog.ai_generate",
      targetType: "blog",
      targetId: result.blog?._id || result.blog?.id || "",
      metadata: { success: result.success, usedFallback: result.usedFallback, quotaLimited: result.quotaLimited },
    });
    return NextResponse.json({
      success: result.success,
      message: result.message,
      usedFallback: Boolean(result.usedFallback),
      quotaLimited: Boolean(result.quotaLimited),
      blog: result.blog ? serializeBlog(result.blog) : null,
    });
  } catch (error) {
    logServerError("Admin AI blog generation error", error);
    return safeErrorResponse();
  }
}
