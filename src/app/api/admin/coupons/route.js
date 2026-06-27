import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";
import CouponRedemption from "@/models/CouponRedemption";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { invalidateAdminStats } from "@/lib/server/cache/cacheInvalidation";

function normalizeCouponPayload(body) {
  return {
    code: String(body.code || "").trim().toUpperCase(),
    description: String(body.description || "").trim(),
    discountType: ["percentage", "fixed", "bonus_months"].includes(body.discountType)
      ? body.discountType
      : "percentage",
    discountValue: Math.max(0, Number(body.discountValue || 0)),
    appliesToPlans: Array.isArray(body.appliesToPlans)
      ? body.appliesToPlans.filter((plan) => ["basic", "pro"].includes(plan))
      : ["basic", "pro"],
    maxRedemptions: Math.max(0, Number(body.maxRedemptions || 0)),
    perUserLimit: Math.max(0, Number(body.perUserLimit || 1)),
    startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    isActive: body.isActive !== false,
    minimumAmount: Math.max(0, Number(body.minimumAmount || 0)),
    bonusMonths: Math.max(0, Number(body.bonusMonths || 0)),
  };
}

export async function GET() {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  await dbConnect();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  const redemptions = await CouponRedemption.aggregate([
    { $group: { _id: "$couponCode", count: { $sum: 1 }, discount: { $sum: "$discountAmount" } } },
  ]);
  return NextResponse.json({ success: true, coupons, redemptions });
}

export async function POST(request) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const payload = normalizeCouponPayload(body);
    if (!payload.code || payload.discountValue <= 0) {
      return safeErrorResponse("Coupon code and value are required.", 400);
    }

    await dbConnect();
    const coupon = await Coupon.create({ ...payload, createdBy: auth.user.id });
    await invalidateAdminStats();
    await createAuditLog({
      user: auth.user,
      action: "billing.coupon.created",
      targetType: "Coupon",
      targetId: coupon._id,
      metadata: { code: coupon.code, discountType: coupon.discountType },
      request,
    });
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    logServerError("Create coupon error", error);
    return safeErrorResponse("Coupon could not be saved.", 400);
  }
}
