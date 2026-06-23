import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  getAllFeatureFlags,
  seedFeatureFlags,
} from "@/lib/features/featureFlagService";

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

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const flags = await getAllFeatureFlags();
    return NextResponse.json({ success: true, flags });
  } catch (error) {
    console.error("Admin API Get feature flags error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const result = await seedFeatureFlags();
    const flags = await getAllFeatureFlags();

    return NextResponse.json({
      success: true,
      message: result.message,
      flags,
    });
  } catch (error) {
    console.error("Admin API Seed feature flags error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
