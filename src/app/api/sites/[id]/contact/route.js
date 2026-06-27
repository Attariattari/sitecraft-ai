import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import SiteContactMessage from "@/models/SiteContactMessage";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().max(140).optional().default(""),
  message: z.string().trim().min(5).max(3000),
  serviceInterest: z.string().trim().max(140).optional().default(""),
  website: z.string().trim().optional().default(""),
});

function clean(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

export async function POST(request, { params }) {
  const rate = await enforceRateLimit(request, "site-contact", { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!rate.allowed) return rate.response;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Please complete the contact form correctly." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ success: true });

  await dbConnect();
  const site = await Site.findOne({ slug: id, isPublished: true }).select("_id ownerId slug contactFormEnabled").lean();
  if (!site || site.contactFormEnabled === false) return NextResponse.json({ success: false, message: "Contact form is not available." }, { status: 404 });

  await SiteContactMessage.create({
    siteId: site._id,
    siteSlug: site.slug,
    ownerUserId: site.ownerId,
    name: clean(parsed.data.name),
    email: clean(parsed.data.email),
    phone: clean(parsed.data.phone),
    subject: clean(parsed.data.subject),
    message: clean(parsed.data.message),
    serviceInterest: clean(parsed.data.serviceInterest),
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
    userAgent: request.headers.get("user-agent") || "",
  });

  return NextResponse.json({ success: true, message: "Message sent successfully." });
}
