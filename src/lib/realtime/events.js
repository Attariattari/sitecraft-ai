export const REALTIME_EVENTS = {
    USER: {
        RESTRICTED: "user:restricted",
        UNRESTRICTED: "user:unrestricted",
        ROLE_UPDATED: "user:role-updated",
        APPEAL_SUBMITTED: "user:appeal-submitted",
    },
    ADMIN: {
        USER_UPDATED: "admin:user-updated",
        ACCESS_REQUEST: "admin:access-request",
    },
    SESSION: {
        FORCE_LOGOUT: "session:force-logout",
    },
    CATEGORY: {
        UPDATED: "category:updated",
        LIST_REFRESH: "category:list-refresh",
    },
    THEME: {
        UPDATED: "theme:updated",
        LIST_REFRESH: "theme:list-refresh",
    },
    PLATFORM_THEME: {
        UPDATED: "platform-theme:updated",
    },
    NOTIFICATION: {
        NEW: "notification:new",
    },
};

export const REALTIME_ROOMS = {
    USER: (userId) => `user:${userId}`,
    ADMIN: "admin",
    SUPER_ADMIN: "super-admin",
};
