import { NextResponse } from "next/server";
import { getAllThemes } from "@/lib/themes/themeService";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

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

    const themes = await getAllThemes();

    return NextResponse.json({
      success: true,
      themes,
    });
  } catch (error) {
    console.error("Admin API Get all themes error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
