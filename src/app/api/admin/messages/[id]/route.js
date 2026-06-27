import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireSuperAdmin } from "@/lib/admin/requireSuperAdmin";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import ContactMessage from "@/models/ContactMessage";
import {
  CONTACT_PRIORITIES,
  CONTACT_STATUSES,
  cleanText,
  serializeContactMessage,
} from "@/lib/contact/contactMessageService";

async function emitUpdated(message) {
  try {
    await realtimeEmitter.emitToSuperAdmins("contact:message-updated", {
      title: "Contact message updated",
      message: `${message.subject} is now ${message.status}.`,
      metadata: { messageId: message.id },
    });
  } catch (error) {
    console.error("Contact message realtime update error:", error);
  }
}

export async function GET(request, { params }) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    const { id } = await params;
    await dbConnect();
    const message = await ContactMessage.findById(id).lean();
    if (!message) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: serializeContactMessage(message) });
  } catch (error) {
    console.error("Admin message GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const update = {};

    if (CONTACT_STATUSES.includes(body.status)) {
      update.status = body.status;
      if (body.status === "read") {
        update.isRead = true;
        update.readAt = new Date();
      }
    }
    if (CONTACT_PRIORITIES.includes(body.priority)) update.priority = body.priority;
    if (typeof body.adminNotes === "string") update.adminNotes = cleanText(body.adminNotes, 2500);
    if (body.isRead === true) {
      update.isRead = true;
      update.readAt = new Date();
      update.status = body.status === "new" ? "read" : update.status;
    }

    await dbConnect();
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    ).lean();

    if (!message) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    const serialized = serializeContactMessage(message);
    await emitUpdated(serialized);
    return NextResponse.json({ success: true, message: serialized });
  } catch (error) {
    console.error("Admin message PATCH error:", error);
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
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { $set: { status: "spam", priority: "low", isRead: true, readAt: new Date() } },
      { new: true },
    ).lean();

    if (!message) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    const serialized = serializeContactMessage(message);
    await emitUpdated(serialized);
    return NextResponse.json({ success: true, message: serialized });
  } catch (error) {
    console.error("Admin message DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
