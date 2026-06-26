import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import Plan from "@/models/Plan";
import { FEATURE_KEYS, LIMIT_KEYS, serializePublicPlan } from "@/lib/plans/planEntitlements";

const ALLOWED_FIELDS = [
  "name",
  "description",
  "bestFor",
  "priceMonthly",
  "priceYearly",
  "currency",
  "isPopular",
  "isActive",
  "isPublic",
  "isPurchasable",
  "status",
  "comingSoon",
  "ctaType",
  "sortOrder",
  "features",
  "limits",
  "ctaLabel",
  "badge",
  "highlights",
];

function sanitizePlanUpdate(body) {
  const update = {};

  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) {
      update[field] = body[field];
    }
  }

  if (update.features) {
    update.features = FEATURE_KEYS.reduce((acc, key) => {
      acc[key] = Boolean(update.features[key]);
      return acc;
    }, {});
  }

  if (update.limits) {
    update.limits = LIMIT_KEYS.reduce((acc, key) => {
      if (update.limits[key] !== undefined) {
        acc[key] = Number(update.limits[key]);
      }
      return acc;
    }, {});
  }

  return update;
}

export async function PATCH(request, { params }) {
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

    const { id } = await params;
    const body = await request.json();
    const update = sanitizePlanUpdate(body);

    await dbConnect();

    const plan = await Plan.findByIdAndUpdate(id, { $set: update }, {
      new: true,
      runValidators: true,
    }).lean();

    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Plan not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      plan: {
        ...serializePublicPlan(plan),
        id: plan._id.toString(),
      },
    });
  } catch (error) {
    console.error("Admin update plan error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
