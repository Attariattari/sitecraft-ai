import mongoose from "mongoose";

const MembershipInviteSchema = new mongoose.Schema(
  {
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    targetEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    planSlug: { type: String, enum: ["basic", "pro"], required: true, index: true },
    durationDays: { type: Number, default: 0, min: 0 },
    durationMonths: { type: Number, default: 1, min: 0 },
    status: {
      type: String,
      enum: ["draft", "sent", "redeemed", "expired", "revoked", "failed"],
      default: "draft",
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true, index: true },
    tokenExpiresAt: { type: Date, required: true, index: true },
    redeemedAt: { type: Date },
    redeemedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    revokedAt: { type: Date },
    revokedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    revocationReason: { type: String, default: "", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    adminMessage: { type: String, default: "", trim: true },
    emailSubject: {
      type: String,
      default: "You've received free SiteCraft AI membership access",
      trim: true,
    },
    emailSentAt: { type: Date },
    emailStatus: { type: String, enum: ["not_sent", "sent", "failed"], default: "not_sent", index: true },
    usageLimit: { type: Number, default: 1, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    source: {
      type: String,
      enum: ["admin_gift", "promotion", "manual_bonus", "support_compensation"],
      default: "admin_gift",
      index: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

MembershipInviteSchema.index({ status: 1, tokenExpiresAt: 1 });

const MembershipInvite =
  mongoose.models.MembershipInvite ||
  mongoose.model("MembershipInvite", MembershipInviteSchema);

export default MembershipInvite;
