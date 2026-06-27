import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import mongoose from "mongoose";
import { siteUpdateSchema, publishSiteSchema } from "@/lib/validations/siteValidation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getTemplateForSite } from "@/lib/templates/siteRenderData";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";
import { readJson } from "@/lib/server/security/validateRequest";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const site = await Site.findOne({ slug: id, isPublished: true }).lean();
      if (!site) return NextResponse.json({ success: false, error: "Site not found" }, { status: 404 });
      const template = await getTemplateForSite(site);
      return NextResponse.json({
        success: true,
        site: {
          slug: site.slug,
          category: site.category,
          siteName: site.siteName,
          pages: site.pages,
          templateSlug: site.templateSlug || site.settings?.selectedTemplate,
          themeSlug: site.themeSlug || site.settings?.selectedTheme || site.themeId,
          personalInfoSnapshot: site.personalInfoSnapshot,
          publishedAt: site.publishedAt,
        },
        template,
      });
    }

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

    return NextResponse.json({
      success: true,
      site,
    });
  } catch (error) {
    logServerError("Get site error", error);
    return safeErrorResponse();
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await readJson(request, 32 * 1024);

    await dbConnect();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const validatedData = siteUpdateSchema.parse(body);

    const site = await Site.findOneAndUpdate({ _id: id, ownerId: user.id }, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!site) {
      return NextResponse.json(
        {
          success: false,
          error: "Site not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      site,
    });
  } catch (error) {
    logServerError("Update site error", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update site",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const site = await Site.findOneAndDelete({ _id: id, ownerId: user.id });

    if (!site) {
      return NextResponse.json(
        {
          success: false,
          error: "Site not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Site deleted successfully",
    });
  } catch (error) {
    logServerError("Delete site error", error);
    return safeErrorResponse();
  }
}
