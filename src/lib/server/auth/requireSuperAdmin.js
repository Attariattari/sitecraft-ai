import "server-only";
import { requireUser } from "@/lib/server/auth/requireUser";
import { safeErrorResponse } from "@/lib/server/security/safeError";

export async function requireSuperAdmin() {
  const result = await requireUser();
  if (result.error) return result;
  if (result.user.role !== "super-admin") {
    return { error: safeErrorResponse("Forbidden: Super Admin only", 403) };
  }
  return { user: result.user };
}
