import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Invoice from "@/models/Invoice";
import { requireUser } from "@/lib/server/auth/requireUser";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  await dbConnect();
  const invoices = await Invoice.find({ userId: auth.user.id })
    .sort({ issuedAt: -1 })
    .limit(50)
    .lean();
  return NextResponse.json({ success: true, invoices });
}
