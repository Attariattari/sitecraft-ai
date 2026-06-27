import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import { getAutomationLogs } from "@/lib/blogs/blogService";

export async function GET(request) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;
    const { searchParams } = new URL(request.url);
    const logs = await getAutomationLogs(searchParams.get("limit") || 30);
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Blog automation logs GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
