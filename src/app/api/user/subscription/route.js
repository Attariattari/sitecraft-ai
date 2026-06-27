import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import { requireUser } from "@/lib/server/auth/requireUser";
import { getPublicPlanBySlug } from "@/lib/plans/planService";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;

    await dbConnect();
    const subscription = await Subscription.findOne({ userId: auth.user.id })
      .sort({ updatedAt: -1 })
      .lean();
    const planSlug = subscription?.planSlug || auth.user.plan || "free";
    const plan = await getPublicPlanBySlug(planSlug);

    return NextResponse.json({
      success: true,
      subscription,
      plan,
      isFree: !subscription || planSlug === "free",
    });
  } catch (error) {
    logServerError("User subscription error", error);
    return safeErrorResponse();
  }
}
