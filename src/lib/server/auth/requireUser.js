import "server-only";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { safeErrorResponse } from "@/lib/server/security/safeError";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: safeErrorResponse("Unauthorized", 401),
    };
  }
  return { user };
}
