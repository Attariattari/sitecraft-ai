import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import { serializeBlog } from "@/lib/blogs/blogService";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";
import { invalidateBlogCache } from "@/lib/server/cache/cacheInvalidation";

export async function POST(request, { params }) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    await dbConnect();
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        status: body.status === "archived" ? "archived" : "rejected",
        updatedBy: user.email || user.id,
      },
      { returnDocument: "after" },
    ).lean();
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    await createAuditLog({
      user,
      request,
      action: blog.status === "archived" ? "blog.archive" : "blog.reject",
      targetType: "blog",
      targetId: id,
      metadata: { title: blog.title, slug: blog.slug },
    });
    await invalidateBlogCache(blog.slug);
    return NextResponse.json({ success: true, blog: serializeBlog(blog) });
  } catch (error) {
    logServerError("Reject blog error", error);
    return safeErrorResponse();
  }
}
