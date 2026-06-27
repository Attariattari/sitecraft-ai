import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireSuperAdmin } from "@/lib/admin/requireSuperAdmin";
import ContactMessage from "@/models/ContactMessage";
import {
  CONTACT_PRIORITIES,
  CONTACT_STATUSES,
  INQUIRY_TYPES,
  getContactStats,
  serializeContactMessage,
} from "@/lib/contact/contactMessageService";

export async function GET(request) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const inquiryType = searchParams.get("inquiryType") || "all";
    const priority = searchParams.get("priority") || "all";
    const read = searchParams.get("read") || "all";
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 50), 1), 100);
    const query = {};

    if (CONTACT_STATUSES.includes(status)) query.status = status;
    if (INQUIRY_TYPES.includes(inquiryType)) query.inquiryType = inquiryType;
    if (CONTACT_PRIORITIES.includes(priority)) query.priority = priority;
    if (read === "read") query.isRead = true;
    if (read === "unread") query.isRead = false;

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { subject: regex },
        { message: regex },
      ];
    }

    await dbConnect();
    const [messages, total, allForStats] = await Promise.all([
      ContactMessage.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(query),
      ContactMessage.find({}).select("status").lean(),
    ]);

    return NextResponse.json({
      success: true,
      messages: messages.map(serializeContactMessage),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      stats: getContactStats(allForStats),
    });
  } catch (error) {
    console.error("Admin messages GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
