import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/categories/categoryService";
import { verifyAuthToken } from "@/lib/auth/tokens";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const payload = await verifyAuthToken(req);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();
    const admin = await User.findById(payload.id);
    if (!admin || (admin.role !== "super-admin" && admin.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const categories = await getAllCategories();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Admin API Get all categories error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
