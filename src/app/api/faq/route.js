import { NextResponse } from "next/server";
import { getPublicFaqEntries } from "@/lib/knowledge/knowledgeBaseService";
import { getOrSetCache } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";

export async function GET() {
  try {
    const entries = await getOrSetCache("public:faq:list", serverEnv.CACHE_PUBLIC_TTL_SECONDS, getPublicFaqEntries);
    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error("Public FAQ API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
