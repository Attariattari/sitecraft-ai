import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import Feature from "@/models/Feature";
import {
  getAllFeatures,
  sanitizeFeatureInput,
  serializeFeature,
} from "@/lib/features/featureCatalogService";
import { getPlanComparison } from "@/lib/plans/planEntitlements";

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

export async function GET() {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    const features = await getAllFeatures();
    return NextResponse.json({
      success: true,
      features,
      comparison: getPlanComparison(),
    });
  } catch (error) {
    console.error("Admin features GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;

    const body = await request.json();
    const payload = sanitizeFeatureInput(body);

    if (!payload.title || !payload.shortDescription) {
      return NextResponse.json(
        { success: false, message: "Title and short description are required." },
        { status: 400 },
      );
    }

    await dbConnect();
    const existing = await Feature.findOne({ slug: payload.slug }).lean();
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A feature with this slug already exists." },
        { status: 409 },
      );
    }

    const feature = await Feature.create({
      ...payload,
      updatedBy: user.email || user.id,
    });

    return NextResponse.json(
      { success: true, feature: serializeFeature(feature) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin features POST error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
