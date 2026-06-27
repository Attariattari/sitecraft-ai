import { NextResponse } from "next/server";
import { runAIBlogWorkflow } from "@/lib/ai/blog/runAIBlogWorkflow";
import { serializeBlog } from "@/lib/blogs/blogService";
import { requireCronSecret } from "@/lib/server/auth/requireCronSecret";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";

export async function POST(request) {
  try {
    const rate = await enforceRateLimit(request, "cron-ai-blog", { limit: 3, windowMs: 60 * 1000 });
    if (!rate.allowed) return rate.response;
    const cron = requireCronSecret(request);
    if (cron.error) return cron.error;
    const result = await runAIBlogWorkflow({ source: "ai_auto", triggeredBy: "cron" });
    return NextResponse.json({
      success: result.success,
      skipped: Boolean(result.skipped),
      message: result.message,
      blog: result.blog ? serializeBlog(result.blog) : null,
    });
  } catch (error) {
    logServerError("Cron AI blog error", error);
    return safeErrorResponse();
  }
}
