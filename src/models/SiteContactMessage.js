import mongoose from "mongoose";

const siteContactMessageSchema = new mongoose.Schema(
  {
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true, index: true },
    siteSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    subject: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    serviceInterest: { type: String, default: "", trim: true },
    status: { type: String, enum: ["new", "read", "replied", "closed", "spam"], default: "new", index: true },
    isRead: { type: Boolean, default: false, index: true },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.SiteContactMessage || mongoose.model("SiteContactMessage", siteContactMessageSchema);
