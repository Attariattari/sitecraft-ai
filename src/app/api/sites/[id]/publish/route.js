import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getPublicBaseUrl } from "@/lib/server/env";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const site = await Site.findOne({ _id: id, ownerId: user.id });

    if (!site) {
      return NextResponse.json(
        {
          success: false,
          error: "Site not found",
        },
        { status: 404 }
      );
    }

    if (!site.slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Site must have a slug before publishing",
        },
        { status: 400 }
      );
    }

    // Update site to published
    site.isPublished = true;
    site.status = "published";
    site.publishedAt = new Date();

    await site.save();

    return NextResponse.json({
      success: true,
      site,
      publicUrl: `${getPublicBaseUrl()}/site/${site.slug}`,
    });
  } catch (error) {
    logServerError("Publish site error", error);
    return safeErrorResponse();
  }
}
