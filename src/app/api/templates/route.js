import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Template from "@/models/Template";
import { TEMPLATE_REGISTRY } from "@/lib/templateRegistry";
import { siteCraftTemplates } from "@/lib/data";

export async function GET(request) {
  try {
    await dbConnect();

    // Try to get from database first
    let templates = await Template.find({ isActive: true }).sort({ order: 1 });

    // If empty, seed from local data
    if (templates.length === 0) {
      const created = await Template.insertMany(siteCraftTemplates);
      templates = created;
    }

    // Also include registry templates for current implementation
    const registryTemplates = Object.values(TEMPLATE_REGISTRY).sort(
      (a, b) => a.order - b.order
    );

    return NextResponse.json({
      success: true,
      templates: registryTemplates,
      count: registryTemplates.length,
    });
  } catch (error) {
    console.error("Get templates error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
