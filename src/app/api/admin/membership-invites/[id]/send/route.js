import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/server/auth/requireSuperAdmin";
import { regenerateAndSendInvite } from "@/lib/server/membership/membershipInviteService";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function POST(request, { params }) {
  try {
    const auth = await requireSuperAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    const result = await regenerateAndSendInvite({ inviteId: id, admin: auth.user, request });
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);
    return NextResponse.json({
      success: true,
      invite: result.invite,
      redeemUrl: result.redeemUrl,
      message: result.message,
    });
  } catch (error) {
    logServerError("Send membership invite error", error);
    return safeErrorResponse();
  }
}
