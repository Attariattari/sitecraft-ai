import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { seedDefaultPlans } from "@/lib/plans/planService";

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

    const result = await seedDefaultPlans();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin seed plans error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
