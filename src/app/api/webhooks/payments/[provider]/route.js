import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { serverEnv } from "@/lib/server/env";
import { activatePaidSubscription } from "@/lib/server/payments/verifyPayment";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

function verifySignature(rawBody, signature) {
  if (!serverEnv.PAYMENT_WEBHOOK_SECRET || !signature) return false;
  const expected = crypto
    .createHmac("sha256", serverEnv.PAYMENT_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request, { params }) {
  try {
    const { provider } = await params;
    const rawBody = await request.text();
    const signature = request.headers.get("x-sitecraft-signature");
    if (!verifySignature(rawBody, signature)) {
      return safeErrorResponse("Webhook signature verification failed.", 401);
    }

    const event = JSON.parse(rawBody || "{}");
    if (event.type !== "payment.paid") {
      return NextResponse.json({ success: true, ignored: true });
    }

    await dbConnect();
    const payment = await Payment.findOne({
      providerReference: event.providerReference,
      paymentProvider: provider,
    });
    if (!payment) return safeErrorResponse("Payment not found.", 404);

    const result = await activatePaidSubscription({ paymentId: payment._id, request });
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);
    return NextResponse.json({ success: true });
  } catch (error) {
    logServerError("Payment webhook error", error);
    return safeErrorResponse();
  }
}
