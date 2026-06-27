import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import {
  ensureUniqueSlug,
  getAdminBlogs,
  getBlogStats,
  sanitizeBlogInput,
  serializeBlog,
  validateBlogPayload,
} from "@/lib/blogs/blogService";
import { BLOG_CATEGORIES } from "@/lib/blogs/blogConstants";
import { invalidateBlogCache } from "@/lib/server/cache/cacheInvalidation";

export async function GET(request) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;
    const { searchParams } = new URL(request.url);
    const blogs = await getAdminBlogs(Object.fromEntries(searchParams.entries()));
    const stats = await getBlogStats();
    return NextResponse.json({ success: true, blogs, stats, categories: BLOG_CATEGORIES });
  } catch (error) {
    console.error("Admin blogs GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;
    const body = await request.json();
    const payload = sanitizeBlogInput(body, user);
    const errors = validateBlogPayload(payload);
    if (errors.length) {
      return NextResponse.json({ success: false, message: errors.join(" ") }, { status: 400 });
    }
    await dbConnect();
    payload.slug = await ensureUniqueSlug(payload.slug);
    const blog = await Blog.create(payload);
    await invalidateBlogCache(payload.status === "published" ? payload.slug : "");
    return NextResponse.json({ success: true, blog: serializeBlog(blog) }, { status: 201 });
  } catch (error) {
    console.error("Admin blogs POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
