import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContactMessage from "@/models/ContactMessage";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { sendContactNotificationEmail } from "@/lib/email/contactEmails";
import {
  sanitizeContactInput,
  serializeContactMessage,
  validateContactInput,
} from "@/lib/contact/contactMessageService";
import { enforceRateLimit, getRequestMeta } from "@/lib/server/security/rateLimit";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";
import { readJson } from "@/lib/server/security/validateRequest";

export async function POST(request) {
  try {
    const rate = await enforceRateLimit(request, "contact", { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!rate.allowed) return rate.response;
    const meta = getRequestMeta(request);

    const payload = sanitizeContactInput(await readJson(request, 16 * 1024));
    const validationError = validateContactInput(payload);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 },
      );
    }

    await dbConnect();
    const contactMessage = await ContactMessage.create({
      ...payload,
      source: "contact_page",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    const serialized = serializeContactMessage(contactMessage);

    await realtimeEmitter.emitToSuperAdmins("contact:message-created", {
      title: "New contact message received.",
      message: `${serialized.name} sent a ${serialized.inquiryType} message.`,
      metadata: { messageId: serialized.id },
    });

    sendContactNotificationEmail(serialized).catch((error) => {
      logServerError("Contact notification email error", error);
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    logServerError("Public contact POST error", error);
    return safeErrorResponse();
  }
}
