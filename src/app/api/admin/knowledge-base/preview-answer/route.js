import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin/requireSuperAdmin";
import { answerSiteCraftHelpQuestion } from "@/lib/ai/siteCraftHelpAnswer";

export async function POST(request) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    const body = await request.json();
    const result = await answerSiteCraftHelpQuestion(body.question || "", {
      bypassCache: true,
    });
    return NextResponse.json({ success: true, preview: result });
  } catch (error) {
    console.error("Admin preview answer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
