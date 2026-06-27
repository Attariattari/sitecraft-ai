import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireSuperAdmin } from "@/lib/admin/requireSuperAdmin";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { sendContactReplyEmail } from "@/lib/email/contactEmails";
import ContactMessage from "@/models/ContactMessage";
import { cleanText, serializeContactMessage } from "@/lib/contact/contactMessageService";

export async function POST(request, { params }) {
  try {
    const { user, error } = await requireSuperAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const replyMessage = cleanText(body.replyMessage, 4000);
    if (!replyMessage || replyMessage.length < 5) {
      return NextResponse.json(
        { success: false, message: "Reply message is required." },
        { status: 400 },
      );
    }

    await dbConnect();
    const existing = await ContactMessage.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    const emailResult = await sendContactReplyEmail({
      to: existing.email,
      subject: existing.subject,
      replyMessage,
    });

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      {
        $set: {
          replyMessage,
          repliedAt: new Date(),
          repliedBy: user.email || user.id,
          status: "replied",
          isRead: true,
          readAt: existing.readAt || new Date(),
        },
      },
      { new: true, runValidators: true },
    ).lean();

    const serialized = serializeContactMessage(message);
    await realtimeEmitter.emitToSuperAdmins("contact:message-updated", {
      title: "Contact reply saved",
      message: emailResult.sent
        ? "Reply email sent and message marked replied."
        : "Reply saved. Email sending is not configured yet.",
      metadata: { messageId: serialized.id },
    });

    return NextResponse.json({
      success: true,
      message: serialized,
      email: emailResult,
      notice: emailResult.sent ? "Reply email sent." : "Email sending is not configured yet.",
    });
  } catch (error) {
    console.error("Admin message reply error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
