import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function POST(req) {
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

    const result = await seedCategories();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin API Seed categories error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
