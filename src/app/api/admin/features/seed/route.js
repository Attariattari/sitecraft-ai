import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  getAllFeatures,
  seedDefaultFeatures,
} from "@/lib/features/featureCatalogService";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (user.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Super Admin only" },
        { status: 403 },
      );
    }

    const result = await seedDefaultFeatures();
    const features = await getAllFeatures();

    return NextResponse.json({
      success: true,
      message: result.message,
      features,
    });
  } catch (error) {
    console.error("Admin features seed error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
