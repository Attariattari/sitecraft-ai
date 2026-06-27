import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import { generateBlogImage } from "@/lib/ai/blog/generateBlogImage";
import { serializeBlog } from "@/lib/blogs/blogService";
import { invalidateBlogCache } from "@/lib/server/cache/cacheInvalidation";

export async function POST(_request, { params }) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;
    const { id } = await params;
    await dbConnect();
    const blog = await Blog.findById(id).lean();
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    const imageResult = await generateBlogImage(blog);
    const updated = await Blog.findByIdAndUpdate(
      id,
      {
        image: imageResult.image,
        imagePrompt: imageResult.imagePrompt,
        imageVerification: imageResult.imageVerification,
        updatedBy: user.email || user.id,
      },
      { returnDocument: "after" },
    ).lean();
    await invalidateBlogCache(updated.slug);
    return NextResponse.json({ success: true, blog: serializeBlog(updated) });
  } catch (error) {
    console.error("Regenerate blog image error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
