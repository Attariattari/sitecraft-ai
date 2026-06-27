import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MembershipInvite from "@/models/MembershipInvite";
import AuditLog from "@/models/AuditLog";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { sanitizeInvite } from "@/lib/server/membership/membershipInviteService";
import { safeErrorResponse } from "@/lib/server/security/safeError";
import { createAuditLog } from "@/lib/server/audit/createAuditLog";

export async function GET(_request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;

  await dbConnect();
  const invite = await MembershipInvite.findById(id)
    .populate("targetUserId", "name email")
    .populate("createdBy", "name email")
    .populate("redeemedBy", "name email")
    .lean();
  if (!invite) return safeErrorResponse("Invite not found.", 404);

  const auditLogs = await AuditLog.find({ targetType: "MembershipInvite", targetId: id })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  return NextResponse.json({ success: true, invite: sanitizeInvite(invite), auditLogs });
}

export async function PATCH(request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;
  const body = await request.json();
  const patch = {};
  for (const key of ["adminMessage", "emailSubject", "source", "tokenExpiresAt"]) {
    if (body[key] !== undefined) patch[key] = body[key];
  }

  await dbConnect();
  const invite = await MembershipInvite.findByIdAndUpdate(id, { $set: patch }, { returnDocument: "after" });
  if (!invite) return safeErrorResponse("Invite not found.", 404);
  await createAuditLog({
    user: auth.user,
    action: "membership_invite.updated",
    targetType: "MembershipInvite",
    targetId: invite._id,
    metadata: patch,
    request,
  });
  return NextResponse.json({ success: true, invite: sanitizeInvite(invite) });
}
