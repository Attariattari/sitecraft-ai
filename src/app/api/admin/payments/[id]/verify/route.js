import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { activatePaidSubscription } from "@/lib/server/payments/verifyPayment";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function POST(request, { params }) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    await dbConnect();
    const payment = await Payment.findById(id);
    if (!payment) return safeErrorResponse("Payment not found.", 404);
    if (payment.paymentMethod !== "manual") {
      return safeErrorResponse("Only manual payments can be verified by admin.", 400);
    }
    const result = await activatePaidSubscription({ paymentId: id, verifier: auth.user, request });
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);
    return NextResponse.json({ success: true, payment: result.payment, subscription: result.subscription });
  } catch (error) {
    logServerError("Admin verify payment error", error);
    return safeErrorResponse();
  }
}
