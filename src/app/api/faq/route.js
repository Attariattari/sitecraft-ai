import { NextResponse } from "next/server";
import { getPublicFaqEntries } from "@/lib/knowledge/knowledgeBaseService";

export async function GET() {
  try {
    const entries = await getPublicFaqEntries();
    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error("Public FAQ API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
