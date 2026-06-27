import { NextResponse } from "next/server";
import { getPublicBlogBySlug, getPublicBlogs } from "@/lib/blogs/blogService";

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const blog = await getPublicBlogBySlug(slug);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }
    const related = (await getPublicBlogs({ category: blog.category, limit: 4 }))
      .filter((item) => item.slug !== blog.slug)
      .slice(0, 3);
    return NextResponse.json({ success: true, blog, related });
  } catch (error) {
    console.error("Public blog detail GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
