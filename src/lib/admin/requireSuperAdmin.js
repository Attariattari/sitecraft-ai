import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function requireSuperAdmin() {
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
