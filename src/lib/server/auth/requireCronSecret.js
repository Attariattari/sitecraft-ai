import "server-only";
import { serverEnv } from "@/lib/server/env";
import { safeErrorResponse } from "@/lib/server/security/safeError";

export function requireCronSecret(request) {
  if (!serverEnv.CRON_SECRET) {
    return { error: safeErrorResponse("Cron is not configured.", 503) };
  }
  const secret =
    request.headers.get("x-cron-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (secret !== serverEnv.CRON_SECRET) {
    return { error: safeErrorResponse("Unauthorized", 401) };
  }
  return {};
}
