import { NextResponse } from "next/server";
import { answerSiteCraftHelpQuestion } from "@/lib/ai/siteCraftHelpAnswer";

const bucket = new Map();
const WINDOW_MS = 60 * 1000;
const GUEST_LIMIT = 8;

function getClientKey(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function checkRateLimit(key) {
  const now = Date.now();
  const current = bucket.get(key) || { count: 0, resetAt: now + WINDOW_MS };
  if (current.resetAt <= now) {
    bucket.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: GUEST_LIMIT - 1, resetAt: now + WINDOW_MS };
  }
  if (current.count >= GUEST_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }
  current.count += 1;
  bucket.set(key, current);
  return { allowed: true, remaining: GUEST_LIMIT - current.count, resetAt: current.resetAt };
}

export async function POST(request) {
  try {
    const rate = checkRateLimit(getClientKey(request));
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait a moment before asking another question.",
          rateLimit: rate,
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const result = await answerSiteCraftHelpQuestion(body.question || "");
    return NextResponse.json({ success: true, result, rateLimit: rate });
  } catch (error) {
    console.error("Public FAQ ask error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
