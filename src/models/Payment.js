import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    planSlug: { type: String, enum: ["basic", "pro"], required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    finalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "PKR", uppercase: true, trim: true },
    paymentMethod: { type: String, default: "card", trim: true },
    paymentProvider: { type: String, default: "manual", trim: true, index: true },
    providerPaymentId: { type: String, default: "", trim: true, index: true },
    providerReference: { type: String, default: "", trim: true, index: true },
    status: {
      type: String,
      enum: ["pending", "processing", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },
    billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
    couponCode: { type: String, default: "", uppercase: true, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    verifiedAt: { type: Date },
    failedReason: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ providerReference: 1, paymentProvider: 1 }, { sparse: true });

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;
