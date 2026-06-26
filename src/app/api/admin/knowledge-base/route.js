import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireSuperAdmin } from "@/lib/admin/requireSuperAdmin";
import KnowledgeBase from "@/models/KnowledgeBase";
import {
  getKnowledgeStats,
  sanitizeKnowledgeInput,
  serializeKnowledgeEntry,
  validateKnowledgePayload,
} from "@/lib/knowledge/knowledgeBaseService";

export async function GET(request) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const query = {};
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ title: regex }, { question: regex }, { answer: regex }, { tags: regex }];
    }

    await dbConnect();
    const entries = await KnowledgeBase.find(query)
      .sort({ priority: -1, sortOrder: 1, updatedAt: -1 })
      .lean();
    const serialized = entries.map(serializeKnowledgeEntry);

    return NextResponse.json({
      success: true,
      entries: serialized,
      stats: getKnowledgeStats(serialized),
    });
  } catch (error) {
    console.error("Admin knowledge base GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;

    const payload = sanitizeKnowledgeInput(await request.json());
    const validationError = validateKnowledgePayload(payload);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    await dbConnect();
    const duplicate = await KnowledgeBase.findOne({ slug: payload.slug }).lean();
    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "A knowledge entry with this slug already exists." },
        { status: 409 },
      );
    }

    const entry = await KnowledgeBase.create({
      ...payload,
      createdBy: user.email || user.id,
      updatedBy: user.email || user.id,
    });

    return NextResponse.json(
      { success: true, entry: serializeKnowledgeEntry(entry) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin knowledge base POST error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
