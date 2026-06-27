import { NextResponse } from "next/server";
import { validateInviteToken } from "@/lib/server/membership/membershipInviteService";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";
import { safeErrorResponse, logServerError } from "@/lib/server/security/safeError";

export async function GET(request, { params }) {
  try {
    const limited = await enforceRateLimit(request, "membership-invite-validate", { limit: 30, windowMs: 60_000 });
    if (!limited.allowed) return limited.response;

    const { token } = await params;
    const result = await validateInviteToken(token);
    if (!result.ok) return safeErrorResponse(result.message, result.status || 400);
    return NextResponse.json({ success: true, invite: result.invite });
  } catch (error) {
    logServerError("Validate membership invite error", error);
    return safeErrorResponse();
  }
}
