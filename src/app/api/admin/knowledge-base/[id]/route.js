import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireSuperAdmin } from "@/lib/admin/requireSuperAdmin";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import KnowledgeBase from "@/models/KnowledgeBase";
import AIHelpAnswerCache from "@/models/AIHelpAnswerCache";
import {
  sanitizeKnowledgeInput,
  serializeKnowledgeEntry,
  validateKnowledgePayload,
} from "@/lib/knowledge/knowledgeBaseService";

async function clearHelpCache() {
  try {
    await AIHelpAnswerCache.deleteMany({});
  } catch (error) {
    console.error("Knowledge cache clear error:", error);
  }
}

async function emitKnowledgeUpdated(entry) {
  try {
    await realtimeEmitter.emitToSuperAdmins("knowledge-base:updated", {
      title: "Knowledge base updated",
      message: "Help content was updated.",
      metadata: { entryId: entry.id || entry._id?.toString() },
    });
  } catch (error) {
    console.error("Knowledge realtime emit error:", error);
  }
}

export async function PATCH(request, { params }) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;

    const { id } = await params;
    const payload = sanitizeKnowledgeInput(await request.json());
    const validationError = validateKnowledgePayload(payload);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    await dbConnect();
    const duplicate = await KnowledgeBase.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    }).lean();
    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "A knowledge entry with this slug already exists." },
        { status: 409 },
      );
    }

    const entry = await KnowledgeBase.findByIdAndUpdate(
      id,
      { $set: { ...payload, updatedBy: user.email || user.id } },
      { new: true, runValidators: true },
    ).lean();

    if (!entry) {
      return NextResponse.json({ success: false, message: "Entry not found" }, { status: 404 });
    }

    const serialized = serializeKnowledgeEntry(entry);
    await clearHelpCache();
    await emitKnowledgeUpdated(serialized);
    return NextResponse.json({ success: true, entry: serialized });
  } catch (error) {
    console.error("Admin knowledge base PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    const { id } = await params;
    await dbConnect();
    const entry = await KnowledgeBase.findById(id).lean();
    if (!entry) {
      return NextResponse.json({ success: false, message: "Entry not found" }, { status: 404 });
    }
    if (entry.isPublicFAQ || entry.isAIAccessible) {
      return NextResponse.json(
        {
          success: false,
          message: "Public or AI accessible entries must be archived before deletion.",
        },
        { status: 400 },
      );
    }

    await KnowledgeBase.findByIdAndDelete(id);
    await clearHelpCache();
    await emitKnowledgeUpdated(entry);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin knowledge base DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
