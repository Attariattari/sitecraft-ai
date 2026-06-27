import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import {
  ensureUniqueSlug,
  sanitizeBlogInput,
  serializeBlog,
  validateBlogPayload,
} from "@/lib/blogs/blogService";
import { invalidateBlogCache } from "@/lib/server/cache/cacheInvalidation";

export async function GET(_request, { params }) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;
    const { id } = await params;
    await dbConnect();
    const blog = await Blog.findById(id).lean();
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    return NextResponse.json({ success: true, blog: serializeBlog(blog) });
  } catch (error) {
    console.error("Admin blog GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;
    const { id } = await params;
    const body = await request.json();
    const payload = sanitizeBlogInput(body, user);
    const errors = validateBlogPayload(payload);
    if (errors.length) {
      return NextResponse.json({ success: false, message: errors.join(" ") }, { status: 400 });
    }
    await dbConnect();
    payload.slug = await ensureUniqueSlug(payload.slug, id);
    if (payload.status !== "published") payload.publishedAt = undefined;
    const blog = await Blog.findByIdAndUpdate(id, payload, {
      returnDocument: "after",
      runValidators: true,
    }).lean();
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    await invalidateBlogCache(blog.slug);
    return NextResponse.json({ success: true, blog: serializeBlog(blog) });
  } catch (error) {
    console.error("Admin blog PATCH error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;
    const { id } = await params;
    await dbConnect();
    const blog = await Blog.findByIdAndDelete(id).lean();
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    await invalidateBlogCache(blog.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin blog DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
