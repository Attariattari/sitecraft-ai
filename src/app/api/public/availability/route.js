import { NextResponse } from "next/server";
import { getPublicAvailability } from "@/lib/public/publicAvailability";

export async function GET() {
  try {
    const availability = await getPublicAvailability();
    return NextResponse.json({ success: true, availability });
  } catch (error) {
    console.error("Public availability API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
