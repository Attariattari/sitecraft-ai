export const INQUIRY_TYPES = [
  "General Question",
  "Pricing / Plan Question",
  "Website Generation Help",
  "Theme / Template Question",
  "Category Availability",
  "Technical Support",
  "Business Inquiry",
  "Feedback",
];

export const CONTACT_STATUSES = ["new", "read", "replied", "closed", "spam"];
export const CONTACT_PRIORITIES = ["low", "normal", "high"];

const spamKeywords = ["casino", "crypto giveaway", "viagra", "free money"];

export function cleanText(value, max = 2000) {
  return String(value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function sanitizeContactInput(body = {}) {
  return {
    name: cleanText(body.name, 120),
    email: cleanText(body.email, 180).toLowerCase(),
    phone: cleanText(body.phone, 60),
    subject: cleanText(body.subject, 180),
    inquiryType: INQUIRY_TYPES.includes(body.inquiryType)
      ? body.inquiryType
      : "General Question",
    message: cleanText(body.message, 2500),
    honeypot: cleanText(body.companyWebsite, 200),
  };
}

export function validateContactInput(payload) {
  if (payload.honeypot) return "Message could not be submitted.";
  if (!payload.name) return "Name is required.";
  if (!isValidEmail(payload.email)) return "A valid email is required.";
  if (!payload.subject) return "Subject is required.";
  if (!payload.message || payload.message.length < 10) {
    return "Message must be at least 10 characters.";
  }
  if (payload.message.length > 2500) return "Message is too long.";
  const lower = `${payload.subject} ${payload.message}`.toLowerCase();
  if (spamKeywords.some((keyword) => lower.includes(keyword))) {
    return "Message could not be submitted.";
  }
  return "";
}

export function serializeContactMessage(message) {
  const plain = message.toObject ? message.toObject() : message;
  return {
    id: plain._id ? plain._id.toString() : plain.id,
    name: plain.name,
    email: plain.email,
    phone: plain.phone || "",
    subject: plain.subject,
    inquiryType: plain.inquiryType,
    message: plain.message,
    status: plain.status,
    priority: plain.priority,
    source: plain.source,
    isRead: Boolean(plain.isRead),
    readAt: plain.readAt,
    repliedAt: plain.repliedAt,
    replyMessage: plain.replyMessage || "",
    repliedBy: plain.repliedBy || "",
    adminNotes: plain.adminNotes || "",
    ipAddress: plain.ipAddress || "",
    userAgent: plain.userAgent || "",
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

export function getContactStats(messages) {
  return {
    total: messages.length,
    new: messages.filter((message) => message.status === "new").length,
    replied: messages.filter((message) => message.status === "replied").length,
    closed: messages.filter((message) => message.status === "closed").length,
    spam: messages.filter((message) => message.status === "spam").length,
  };
}
