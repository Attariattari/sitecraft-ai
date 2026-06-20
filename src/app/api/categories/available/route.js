import { NextResponse } from "next/server";
import { getAvailableCategories } from "@/lib/categories/categoryService";

/**
 * Public API to fetch available categories based on context.
 * Used by: Home page, Signup, Purpose Popup, Dashboard.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const context = searchParams.get("context") || "home"; // home, signup, dashboard, generate

    const categories = await getAvailableCategories(context);

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("API Get available categories error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
