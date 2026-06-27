import mongoose from "mongoose";

const CouponRedemptionSchema = new mongoose.Schema(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    couponCode: { type: String, required: true, uppercase: true, trim: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    discountAmount: { type: Number, default: 0, min: 0 },
    bonusMonths: { type: Number, default: 0, min: 0 },
    redeemedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

CouponRedemptionSchema.index({ couponId: 1, userId: 1, paymentId: 1 });

const CouponRedemption =
  mongoose.models.CouponRedemption ||
  mongoose.model("CouponRedemption", CouponRedemptionSchema);

export default CouponRedemption;
