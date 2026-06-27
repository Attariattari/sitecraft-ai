import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import { getGeminiDiagnostics } from "@/lib/ai/geminiService";

export async function GET() {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    return NextResponse.json({
      success: true,
      diagnostics: getGeminiDiagnostics(),
    });
  } catch (error) {
    console.error("Gemini diagnostics error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
