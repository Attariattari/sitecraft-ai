import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { revokeInvite } from "@/lib/server/membership/membershipInviteService";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function POST(request, { params }) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const result = await revokeInvite({
      inviteId: id,
      admin: auth.user,
      reason: body.reason || "Revoked by Super Admin",
      request,
    });
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);
    return NextResponse.json({ success: true, invite: result.invite });
  } catch (error) {
    logServerError("Revoke membership invite error", error);
    return safeErrorResponse();
  }
}
