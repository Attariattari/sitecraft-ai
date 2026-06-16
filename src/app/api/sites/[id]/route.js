import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import { siteUpdateSchema, publishSiteSchema } from "@/lib/validations/siteValidation";

export async function GET(request, { params }) {
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

    return NextResponse.json({
      success: true,
      site,
    });
  } catch (error) {
    console.error("Get site error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    await dbConnect();

    const validatedData = siteUpdateSchema.parse(body);

    const site = await Site.findByIdAndUpdate(id, validatedData, {
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
    console.error("Update site error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const site = await Site.findByIdAndDelete(id);

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
    console.error("Delete site error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
