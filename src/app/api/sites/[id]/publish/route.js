import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const site = await Site.findById(id);

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
      publicUrl: `${process.env.NEXT_PUBLIC_APP_URL}/site/${site.slug}`,
    });
  } catch (error) {
    console.error("Publish site error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
