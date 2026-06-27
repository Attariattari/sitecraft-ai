import "server-only";
import { requireUser } from "@/lib/server/auth/requireUser";
import { safeErrorResponse } from "@/lib/server/security/safeError";

export async function requireAdmin() {
  const result = await requireUser();
  if (result.error) return result;
  if (!["admin", "super-admin"].includes(result.user.role)) {
    return { error: safeErrorResponse("Forbidden", 403) };
  }
  return { user: result.user };
}
