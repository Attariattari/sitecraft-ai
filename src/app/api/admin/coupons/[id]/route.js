import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { invalidateAdminStats } from "@/lib/server/cache/cacheInvalidation";

function cleanPatch(body) {
  const patch = {};
  for (const key of [
    "description",
    "discountType",
    "discountValue",
    "appliesToPlans",
    "maxRedemptions",
    "perUserLimit",
    "startsAt",
    "expiresAt",
    "isActive",
    "minimumAmount",
    "bonusMonths",
  ]) {
    if (body[key] !== undefined) patch[key] = body[key];
  }
  if (patch.discountType && !["percentage", "fixed", "bonus_months"].includes(patch.discountType)) {
    delete patch.discountType;
  }
  if (patch.appliesToPlans) {
    patch.appliesToPlans = patch.appliesToPlans.filter((plan) => ["basic", "pro"].includes(plan));
  }
  return patch;
}

export async function PATCH(request, { params }) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    const body = await request.json();

    await dbConnect();
    const coupon = await Coupon.findByIdAndUpdate(id, { $set: cleanPatch(body) }, { returnDocument: "after" });
    if (!coupon) return safeErrorResponse("Coupon not found.", 404);

    await invalidateAdminStats();
    await createAuditLog({
      user: auth.user,
      action: "billing.coupon.updated",
      targetType: "Coupon",
      targetId: coupon._id,
      metadata: { code: coupon.code },
      request,
    });
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    logServerError("Update coupon error", error);
    return safeErrorResponse();
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;

  await dbConnect();
  const coupon = await Coupon.findByIdAndUpdate(id, { $set: { isActive: false } }, { returnDocument: "after" });
  if (!coupon) return safeErrorResponse("Coupon not found.", 404);
  await invalidateAdminStats();
  await createAuditLog({
    user: auth.user,
    action: "billing.coupon.disabled",
    targetType: "Coupon",
    targetId: coupon._id,
    metadata: { code: coupon.code },
    request,
  });
  return NextResponse.json({ success: true, coupon });
}
