import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth/requireUser";
import { redeemInviteToken } from "@/lib/server/membership/membershipInviteService";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function POST(request) {
  try {
    const limited = await enforceRateLimit(request, "membership-invite-redeem", { limit: 10, windowMs: 60_000 });
    if (!limited.allowed) return limited.response;

    const auth = await requireUser();
    if (auth.error) return auth.error;

    const body = await request.json();
    const result = await redeemInviteToken({ token: body.token, user: auth.user, request });
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);

    return NextResponse.json({
      success: true,
      invite: result.invite,
      redirectUrl: "/dashboard/billing",
    });
  } catch (error) {
    logServerError("Redeem membership invite error", error);
    return safeErrorResponse();
  }
}
