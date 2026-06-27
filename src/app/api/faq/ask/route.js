import { NextResponse } from "next/server";
import { answerSiteCraftHelpQuestion } from "@/lib/ai/siteCraftHelpAnswer";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";
import { readJson } from "@/lib/server/security/validateRequest";
import { trimPrompt } from "@/lib/server/ai/aiSafeContext";
import { getOrSetCache, hashCacheValue } from "@/lib/server/cache/cache";

export async function POST(request) {
  try {
    const rate = await enforceRateLimit(request, "faq-ask", { limit: 8, windowMs: 60 * 1000 });
    if (!rate.allowed) return rate.response;

    const body = await readJson(request, 8 * 1024);
    const question = trimPrompt(body.question, 500);
    if (!question) {
      return NextResponse.json({ success: false, message: "Question is required." }, { status: 400 });
    }
    const cacheKey = `ai:faq-answer:${hashCacheValue(question.toLowerCase())}`;
    const result = await getOrSetCache(cacheKey, 24 * 60 * 60, () =>
      answerSiteCraftHelpQuestion(question),
    );
    return NextResponse.json({ success: true, result, rateLimit: rate.rateLimit });
  } catch (error) {
    logServerError("Public FAQ ask error", error);
    return safeErrorResponse();
  }
}
