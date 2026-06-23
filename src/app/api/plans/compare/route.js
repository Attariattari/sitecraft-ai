import { NextResponse } from "next/server";
import { getPlanComparison } from "@/lib/plans/planEntitlements";

export async function GET() {
  return NextResponse.json({
    success: true,
    comparison: getPlanComparison(),
  });
}
