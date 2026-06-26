import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import Feature from "@/models/Feature";
import {
  sanitizeFeatureInput,
  serializeFeature,
} from "@/lib/features/featureCatalogService";

async function requireSuperAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  if (user.role !== "super-admin") {
    return {
      error: NextResponse.json(
        { success: false, message: "Forbidden: Super Admin only" },
        { status: 403 },
      ),
    };
  }

  return { user };
}

export async function PATCH(request, { params }) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const update = sanitizeFeatureInput(body);

    if (!update.title || !update.shortDescription) {
      return NextResponse.json(
        { success: false, message: "Title and short description are required." },
        { status: 400 },
      );
    }

    await dbConnect();
    const duplicate = await Feature.findOne({
      slug: update.slug,
      _id: { $ne: id },
    }).lean();

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "A feature with this slug already exists." },
        { status: 409 },
      );
    }

    const feature = await Feature.findByIdAndUpdate(
      id,
      { $set: { ...update, updatedBy: user.email || user.id } },
      { new: true, runValidators: true },
    ).lean();

    if (!feature) {
      return NextResponse.json(
        { success: false, message: "Feature not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      feature: serializeFeature(feature),
    });
  } catch (error) {
    console.error("Admin features PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    const { id } = await params;
    await dbConnect();

    const feature = await Feature.findById(id).lean();
    if (!feature) {
      return NextResponse.json(
        { success: false, message: "Feature not found" },
        { status: 404 },
      );
    }

    if (feature.dashboardVisible) {
      return NextResponse.json(
        {
          success: false,
          message: "Dashboard-visible features must be hidden before deletion.",
        },
        { status: 400 },
      );
    }

    await Feature.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin features DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
