import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";

export async function GET() {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  await dbConnect();
  const payments = await Payment.find({})
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(150)
    .lean();
  return NextResponse.json({ success: true, payments });
}
