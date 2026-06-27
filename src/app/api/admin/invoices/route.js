import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Invoice from "@/models/Invoice";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";

export async function GET() {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  await dbConnect();
  const invoices = await Invoice.find({})
    .populate("userId", "name email")
    .sort({ issuedAt: -1 })
    .limit(150)
    .lean();
  return NextResponse.json({ success: true, invoices });
}
