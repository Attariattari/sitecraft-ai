import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { siteCraftCategories } from "@/lib/data";

export async function GET(request) {
  try {
    await dbConnect();

    // Try to get from database first
    let categories = await Category.find({ isActive: true }).sort({ order: 1 });

    // If empty, seed from local data
    if (categories.length === 0) {
      const created = await Category.insertMany(siteCraftCategories);
      categories = created;
    }

    return NextResponse.json({
      success: true,
      categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
