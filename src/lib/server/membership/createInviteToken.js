import "server-only";
import crypto from "crypto";
import { hashInviteToken } from "@/lib/server/membership/hashInviteToken";

export function createInviteToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashInviteToken(token),
  };
}
