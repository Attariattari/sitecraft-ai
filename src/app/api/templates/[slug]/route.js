import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Template from "@/models/Template";
import { serializeTemplate } from "@/lib/templates/templateService";

export async function GET(_request, { params }) {
  const { slug } = await params;
  await dbConnect();
  const template = await Template.findOne({
    slug: String(slug || "").toLowerCase(),
    isPublic: true,
    status: { $in: ["active", "coming_soon", "planned"] },
  }).lean();

  if (!template) return NextResponse.json({ success: false, message: "Template not found" }, { status: 404 });
  return NextResponse.json({ success: true, template: serializeTemplate(template) });
}
