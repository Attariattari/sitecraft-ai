import { NextResponse } from "next/server";
import { getPublicAvailability } from "@/lib/public/publicAvailability";
import { getOrSetCache } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";

export async function GET() {
  try {
    const availability = await getOrSetCache("public:availability", serverEnv.CACHE_DEFAULT_TTL_SECONDS, getPublicAvailability);
    return NextResponse.json({ success: true, availability });
  } catch (error) {
    console.error("Public availability API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
