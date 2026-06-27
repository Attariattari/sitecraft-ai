import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "", trim: true },
    subject: { type: String, required: true, trim: true },
    inquiryType: {
      type: String,
      enum: [
        "General Question",
        "Pricing / Plan Question",
        "Website Generation Help",
        "Theme / Template Question",
        "Category Availability",
        "Technical Support",
        "Business Inquiry",
        "Feedback",
      ],
      default: "General Question",
      index: true,
    },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed", "spam"],
      default: "new",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
      index: true,
    },
    source: { type: String, default: "contact_page", trim: true, index: true },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    repliedAt: { type: Date },
    replyMessage: { type: String, default: "", trim: true },
    repliedBy: { type: String, default: "", trim: true },
    adminNotes: { type: String, default: "", trim: true },
    ipAddress: { type: String, default: "", trim: true },
    userAgent: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

ContactMessageSchema.index({ createdAt: -1, status: 1, inquiryType: 1 });
ContactMessageSchema.index({ name: "text", email: "text", subject: "text", message: "text" });

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);

export default ContactMessage;
