import ActivityLog from "@/models/ActivityLog";
import Notification from "@/models/Notification";
import dbConnect from "@/lib/dbConnect";

export async function createActivityLog({
    actorId,
    targetUserId,
    action,
    description,
    metadata,
    req,
}) {
    try {
        await dbConnect();
        const ipAddress =
            req ?.headers.get("x-forwarded-for") ?.split(",")[0] ?.trim() ||
            req ?.headers.get("x-real-ip") ||
            "";
        const userAgent = req ?.headers.get("user-agent") || "";

        await ActivityLog.create({
            actorId,
            targetUserId,
            action,
            description,
            metadata,
            ipAddress,
            userAgent,
        });
    } catch (error) {
        console.error("Error creating activity log:", error);
    }
}

export async function createNotification({
    userId,
    type,
    title,
    message,
    metadata,
    severity,
    actionUrl,
}) {
    try {
        await dbConnect();
        await Notification.create({
            userId,
            type,
            title,
            message,
            metadata,
            severity,
            actionUrl,
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}
