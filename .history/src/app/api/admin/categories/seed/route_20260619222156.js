import { NextResponse } from "next/server";
import { seedCategories } from "@/lib/categories/categoryService";
import { verifyAuthToken } from "@/lib/auth/tokens";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
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
    if (!admin || admin.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Super Admin only" },
        { status: 403 },
      );
    }

    const result = await seedCategories();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin API Seed categories error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
