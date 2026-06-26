import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin/requireSuperAdmin";
import { seedDefaultKnowledgeBase } from "@/lib/knowledge/knowledgeBaseService";

export async function POST() {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;

    const entries = await seedDefaultKnowledgeBase({ createdBy: user.email || user.id });
    return NextResponse.json({
      success: true,
      message: "Default knowledge base entries are ready.",
      entries,
    });
  } catch (error) {
    console.error("Admin knowledge seed error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
