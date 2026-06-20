import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/categories/categoryService";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

/**
 * Admin API - list all categories (includes usageCount)
 * Access: admin / super-admin
 */
export async function GET(req) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (user.role !== "super-admin" && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const categories = await getAllCategories();

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Admin API Get all categories error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
