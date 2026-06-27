import "server-only";
import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";
import CouponRedemption from "@/models/CouponRedemption";

export async function validateCoupon({ code, userId, planSlug, amount }) {
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (!normalizedCode) {
    return { valid: false, message: "Enter a coupon code." };
  }

  await dbConnect();
  const coupon = await Coupon.findOne({ code: normalizedCode }).lean();
  const now = new Date();

  if (!coupon || !coupon.isActive) return { valid: false, message: "Coupon is not active." };
  if (coupon.startsAt && new Date(coupon.startsAt) > now) return { valid: false, message: "Coupon is not active yet." };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return { valid: false, message: "Coupon has expired." };
  if (coupon.appliesToPlans?.length && !coupon.appliesToPlans.includes(planSlug)) {
    return { valid: false, message: "Coupon does not apply to this plan." };
  }
  if (coupon.maxRedemptions > 0 && coupon.usedCount >= coupon.maxRedemptions) {
    return { valid: false, message: "Coupon usage limit has been reached." };
  }
  if (Number(coupon.minimumAmount || 0) > Number(amount || 0)) {
    return { valid: false, message: "Coupon minimum amount is not met." };
  }

  if (userId && coupon.perUserLimit > 0) {
    const usedByUser = await CouponRedemption.countDocuments({
      couponId: coupon._id,
      userId,
    });
    if (usedByUser >= coupon.perUserLimit) {
      return { valid: false, message: "You have already used this coupon." };
    }
  }

  let discountAmount = 0;
  let bonusMonths = Number(coupon.bonusMonths || 0);
  if (coupon.discountType === "percentage") {
    discountAmount = Math.round((Number(amount || 0) * Number(coupon.discountValue || 0)) / 100);
  } else if (coupon.discountType === "fixed") {
    discountAmount = Number(coupon.discountValue || 0);
  } else if (coupon.discountType === "bonus_months") {
    bonusMonths += Number(coupon.discountValue || 0);
  }

  return {
    valid: true,
    coupon,
    code: normalizedCode,
    discountAmount: Math.min(discountAmount, Number(amount || 0)),
    bonusMonths,
    message: "Coupon applied.",
  };
}
