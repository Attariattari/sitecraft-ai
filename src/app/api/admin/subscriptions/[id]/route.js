import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import Payment from "@/models/Payment";
import Invoice from "@/models/Invoice";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { safeErrorResponse } from "@/lib/server/security/safeError";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";
import { invalidateAdminStats, invalidateUserCache } from "@/lib/server/cache/cacheInvalidation";

export async function GET(_request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;

  await dbConnect();
  const subscription = await Subscription.findById(id).populate("userId", "name email plan").lean();
  if (!subscription) return safeErrorResponse("Subscription not found.", 404);
  const [payments, invoices] = await Promise.all([
    Payment.find({ subscriptionId: id }).sort({ createdAt: -1 }).lean(),
    Invoice.find({ subscriptionId: id }).sort({ issuedAt: -1 }).lean(),
  ]);
  return NextResponse.json({ success: true, subscription, payments, invoices });
}

export async function PATCH(request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;
  const body = await request.json();

  const allowed = {};
  for (const key of ["status", "cancelAtPeriodEnd", "grantReason"]) {
    if (body[key] !== undefined) allowed[key] = body[key];
  }

  await dbConnect();
  const subscription = await Subscription.findByIdAndUpdate(id, { $set: allowed }, { returnDocument: "after" });
  if (!subscription) return safeErrorResponse("Subscription not found.", 404);
  await Promise.all([invalidateUserCache(subscription.userId), invalidateAdminStats()]);
  await createAuditLog({
    user: auth.user,
    action: "billing.subscription.updated",
    targetType: "Subscription",
    targetId: subscription._id,
    metadata: allowed,
    request,
  });
  return NextResponse.json({ success: true, subscription });
}
