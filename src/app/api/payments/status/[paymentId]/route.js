import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireUser } from "@/lib/server/auth/requireUser";
import { safeErrorResponse } from "@/lib/server/security/safeError";

export async function GET(_request, { params }) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { paymentId } = await params;
  await dbConnect();
  const payment = await Payment.findOne({ _id: paymentId, userId: auth.user.id }).lean();
  if (!payment) return safeErrorResponse("Payment not found.", 404);

  return NextResponse.json({
    success: true,
    payment: {
      id: payment._id.toString(),
      status: payment.status,
      planSlug: payment.planSlug,
      finalAmount: payment.finalAmount,
      currency: payment.currency,
      verifiedAt: payment.verifiedAt,
    },
  });
}
