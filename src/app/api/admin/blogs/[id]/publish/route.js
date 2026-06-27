import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import { serializeBlog } from "@/lib/blogs/blogService";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";
import { invalidateBlogCache } from "@/lib/server/cache/cacheInvalidation";

export async function POST(_request, { params }) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;
    const { id } = await params;
    await dbConnect();
    const blog = await Blog.findById(id).lean();
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    if (!blog.metaDescription) {
      return NextResponse.json({ success: false, message: "Meta description is required before publishing." }, { status: 400 });
    }
    const updated = await Blog.findByIdAndUpdate(
      id,
      { status: "published", publishedAt: blog.publishedAt || new Date(), updatedBy: user.email || user.id },
      { returnDocument: "after" },
    ).lean();
    await createAuditLog({
      user,
      request: _request,
      action: "blog.publish",
      targetType: "blog",
      targetId: id,
      metadata: { title: blog.title, slug: blog.slug },
    });
    await invalidateBlogCache(updated.slug);
    return NextResponse.json({ success: true, blog: serializeBlog(updated) });
  } catch (error) {
    logServerError("Publish blog error", error);
    return safeErrorResponse();
  }
}
