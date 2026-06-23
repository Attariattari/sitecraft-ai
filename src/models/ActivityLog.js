import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    action: {
        type: String,
        required: true,
        enum: [
            "user_restricted",
            "user_suspended",
            "user_unrestricted",
            "user_sessions_revoked",
            "role_changed",
            "platform_theme_updated",
            "admin_settings_updated",
            "appeal_submitted",
            "appeal_approved",
            "appeal_rejected",
            "login",
            "logout",
            "signup",
        ],
        index: true,
    },
    entityType: {
        type: String,
        default: "user",
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    description: {
        type: String,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
}, {
    timestamps: true,
}, );

const ActivityLog =
    mongoose.models.ActivityLog ||
    mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
