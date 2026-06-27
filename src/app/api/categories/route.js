import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { siteCraftCategories } from "@/lib/data";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";
import { getOrSetCache } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";

export async function GET(request) {
  try {
    const categories = await getOrSetCache("public:categories", serverEnv.CACHE_PUBLIC_TTL_SECONDS, async () => {
      await dbConnect();
      let records = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
      if (records.length === 0) {
        const created = await Category.insertMany(siteCraftCategories);
        records = created.map((item) => item.toObject());
      }
      return records;
    });

    return NextResponse.json({
      success: true,
      categories,
      count: categories.length,
    });
  } catch (error) {
    logServerError("Get categories error", error);
    return safeErrorResponse();
  }
}
