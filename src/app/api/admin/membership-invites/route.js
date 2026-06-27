import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MembershipInvite from "@/models/MembershipInvite";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { createMembershipInvite, sanitizeInvite } from "@/lib/server/membership/membershipInviteService";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function GET() {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  await dbConnect();
  const invites = await MembershipInvite.find({})
    .populate("targetUserId", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(150)
    .lean();
  const stats = invites.reduce((acc, invite) => {
    acc.total += 1;
    acc[invite.status] = (acc[invite.status] || 0) + 1;
    return acc;
  }, { total: 0, sent: 0, redeemed: 0, expired: 0, revoked: 0, failed: 0, draft: 0 });

  return NextResponse.json({
    success: true,
    invites: invites.map(sanitizeInvite),
    stats,
  });
}

export async function POST(request) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;

    const payload = await request.json();
    const result = await createMembershipInvite({ admin: auth.user, payload, request });
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);

    return NextResponse.json({
      success: true,
      invite: result.invite,
      redeemUrl: result.redeemUrl,
      emailResult: result.emailResult,
      message: result.emailResult?.message || "Invite created.",
    });
  } catch (error) {
    logServerError("Create membership invite error", error);
    return safeErrorResponse();
  }
}
