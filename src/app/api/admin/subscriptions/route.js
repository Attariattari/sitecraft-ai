import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import Payment from "@/models/Payment";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";

export async function GET(request) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");
  const query = {};
  if (status) query.status = status;
  if (plan) query.planSlug = plan;

  await dbConnect();
  const [subscriptions, stats] = await Promise.all([
    Subscription.find(query).populate("userId", "name email plan").sort({ updatedAt: -1 }).limit(100).lean(),
    Payment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$finalAmount" } } }]),
  ]);
  return NextResponse.json({ success: true, subscriptions, stats });
}
