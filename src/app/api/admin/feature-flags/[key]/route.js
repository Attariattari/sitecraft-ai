import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import FeatureFlag from "@/models/FeatureFlag";

const allowedStatuses = ["Available Now", "In Progress", "Coming Soon"];

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  if (user.role !== "super-admin" && user.role !== "admin") {
    return {
      error: NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  return { user };
}

export async function PATCH(req, { params }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { key } = await params;
    const body = await req.json();

    const updates = {};
    for (const field of [
      "name",
      "description",
      "status",
      "enabled",
      "audience",
      "usedBy",
      "benefit",
      "isPublic",
      "sortOrder",
    ]) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field];
      }
    }

    if (updates.status && !allowedStatuses.includes(updates.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid feature status" },
        { status: 400 },
      );
    }

    await dbConnect();

    const flag = await FeatureFlag.findOneAndUpdate(
      { key },
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!flag) {
      return NextResponse.json(
        { success: false, message: "Feature flag not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      flag: {
        ...flag,
        _id: flag._id ? flag._id.toString() : null,
      },
    });
  } catch (error) {
    console.error("Admin API Update feature flag error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
