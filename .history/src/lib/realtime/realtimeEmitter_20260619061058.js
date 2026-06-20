import { createNotification } from "@/lib/admin/adminHelpers";
import { REALTIME_EVENTS } from "./events";
import User from "@/models/User";

/**
 * Realtime Emitter Abstraction
 * Currently handles database notifications and logs.
 * Can be extended to emit to a Socket.IO server when available.
 */
export const realtimeEmitter = {
    /**
     * Emit to a specific user
     */
    async emitToUser(userId, event, payload = {}) {
        console.log(`[Realtime] Emitting ${event} to user ${userId}`, payload);

        // 1. Create a database notification if appropriate
        if (payload.title && payload.message) {
            await createNotification({
                userId,
                type: event,
                title: payload.title,
                message: payload.message,
                metadata: payload.metadata,
            });
        }

        // 2. Here you would add socket.io emit logic:
        // io.to(`user:${userId}`).emit(event, payload);
    },

    /**
     * Emit to all users with admin role
     */
    async emitToAdmins(event, payload = {}) {
        console.log(`[Realtime] Emitting ${event} to admins`, payload);

        // 1. Find all admins and create notifications
        const admins = await User.find({ role: "admin" }).select("_id");
        for (const admin of admins) {
            await this.emitToUser(admin._id, event, payload);
        }

        // 2. Socket emit
        // io.to("admin").emit(event, payload);
    },

    /**
     * Emit to all users with super-admin role
     */
    async emitToSuperAdmins(event, payload = {}) {
        console.log(`[Realtime] Emitting ${event} to super-admins`, payload);

        const superAdmins = await User.find({ role: "super-admin" }).select("_id");
        for (const sa of superAdmins) {
            await this.emitToUser(sa._id, event, payload);
        }

        // io.to("super-admin").emit(event, payload);
    },
};