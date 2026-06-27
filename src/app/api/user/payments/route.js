import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireUser } from "@/lib/server/auth/requireUser";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  await dbConnect();
  const payments = await Payment.find({ userId: auth.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return NextResponse.json({ success: true, payments });
}
