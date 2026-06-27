import "server-only";
import dbConnect from "@/lib/dbConnect";
import AuditLog from "@/models/AuditLog";
import { getRequestMeta } from "@/lib/server/security/rateLimit";

function scrubMetadata(metadata = {}) {
  const blocked = /secret|token|password|key|authorization|cookie/i;
  return Object.fromEntries(
    Object.entries(metadata || {}).filter(([key]) => !blocked.test(key)),
  );
}

export async function createAuditLog({ user, action, targetType = "", targetId = "", metadata = {}, request = null }) {
  try {
    const meta = request ? getRequestMeta(request) : {};
    await dbConnect();
    await AuditLog.create({
      actorId: user?.id || "",
      actorEmail: user?.email || "",
      actorRole: user?.role || "",
      action,
      targetType,
      targetId: targetId ? String(targetId) : "",
      metadata: scrubMetadata(metadata),
      ipAddress: meta.ipAddress || "",
      userAgent: meta.userAgent || "",
    });
  } catch (error) {
    console.error(`Audit log failed: ${error.message}`);
  }
}
