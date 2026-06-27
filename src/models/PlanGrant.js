import mongoose from "mongoose";

const PlanGrantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    planSlug: { type: String, enum: ["basic", "pro"], required: true, index: true },
    grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, default: "", trim: true },
    bonusMonths: { type: Number, default: 0, min: 0 },
    durationDays: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
    status: { type: String, enum: ["active", "expired", "cancelled"], default: "active", index: true },
    source: {
      type: String,
      enum: ["admin_gift", "membership_invite", "promotion", "manual_bonus", "support_compensation"],
      default: "admin_gift",
      index: true,
    },
    inviteId: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipInvite" },
  },
  { timestamps: true },
);

const PlanGrant = mongoose.models.PlanGrant || mongoose.model("PlanGrant", PlanGrantSchema);

export default PlanGrant;
