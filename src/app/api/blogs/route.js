import { NextResponse } from "next/server";
import { getPublicBlogs } from "@/lib/blogs/blogService";
import { BLOG_CATEGORIES } from "@/lib/blogs/blogConstants";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogs = await getPublicBlogs({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      tag: searchParams.get("tag") || "",
      limit: searchParams.get("limit") || 24,
    });
    return NextResponse.json({ success: true, blogs, categories: BLOG_CATEGORIES });
  } catch (error) {
    console.error("Public blogs GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
