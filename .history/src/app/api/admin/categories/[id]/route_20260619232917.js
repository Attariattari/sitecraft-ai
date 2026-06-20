import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import Category from "@/models/Category";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

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

    const { getCategoryUsage } =
      await import("@/lib/categories/categoryService");

    // Fetch existing category to check usage
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    // Protection rule: Block disabling or locking if category is in use
    const isAttemptingToRestrict =
      (body.hasOwnProperty("isActive") && body.isActive === false) ||
      (body.hasOwnProperty("isAvailable") && body.isAvailable === false) ||
      (body.hasOwnProperty("isLocked") && body.isLocked === true);

    if (isAttemptingToRestrict) {
      const usageCount = await getCategoryUsage(existingCategory.slug);
      if (usageCount > 0) {
        return NextResponse.json(
          {
            success: false,
            message: `This category is currently used by ${usageCount} existing website${usageCount > 1 ? "s" : ""} and cannot be locked or disabled.`,
            usageCount,
          },
          { status: 400 },
        );
      }
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    // Real-time notification logic would go here
    // For now we'll rely on the UI being updated and next fetch seeing the changes
    // If Socket.IO was setup, we'd emit here.

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Admin API Update category error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
