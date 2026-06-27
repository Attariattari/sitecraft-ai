import "server-only";
import crypto from "crypto";
import { serverEnv } from "@/lib/server/env";

export function hashInviteToken(token) {
  const secret = serverEnv.MEMBERSHIP_INVITE_SECRET || serverEnv.JWT_SECRET || "sitecraft-dev-invite-secret";
  return crypto.createHmac("sha256", secret).update(String(token || "")).digest("hex");
}
