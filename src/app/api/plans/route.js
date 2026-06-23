import { NextResponse } from "next/server";
import { getActivePlans } from "@/lib/plans/planService";

export async function GET() {
  try {
    const plans = await getActivePlans();

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Get plans error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
