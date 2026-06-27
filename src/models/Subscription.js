import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    planSlug: { type: String, enum: ["free", "basic", "pro", "agency"], required: true, index: true },
    status: {
      type: String,
      enum: ["active", "past_due", "cancelled", "expired", "pending", "gifted", "trialing"],
      default: "pending",
      index: true,
    },
    billingCycle: { type: String, enum: ["monthly", "yearly", "manual"], default: "monthly" },
    startDate: { type: Date },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    expiresAt: { type: Date, index: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cancelReason: { type: String, default: "", trim: true },
    paymentProvider: { type: String, default: "", trim: true },
    providerSubscriptionId: { type: String, default: "", trim: true, index: true },
    providerCustomerId: { type: String, default: "", trim: true },
    lastPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    bonusMonthsApplied: { type: Number, default: 0, min: 0 },
    firstPurchaseBonusApplied: { type: Boolean, default: false },
    adminGranted: { type: Boolean, default: false, index: true },
    grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    grantReason: { type: String, default: "", trim: true },
    grantSource: {
      type: String,
      enum: ["paid", "admin_gift", "membership_invite", "manual_extension"],
      default: "paid",
      index: true,
    },
    inviteId: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipInvite" },
  },
  { timestamps: true },
);

SubscriptionSchema.index({ userId: 1, status: 1, expiresAt: -1 });

const Subscription =
  mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
