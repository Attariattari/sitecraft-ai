export const REALTIME_EVENTS = {
  PLATFORM_THEME_UPDATED: "platform-theme:updated",
  USER_RESTRICTED: "user:restricted",
  USER_SUSPENDED: "user:suspended",
  USER_UNRESTRICTED: "user:unrestricted",
  SESSION_REVOKED: "user:session-revoked",
  ROLE_UPDATED: "user:role-updated",
  NOTIFICATION_NEW: "notification:new",
  FORCE_LOGOUT: "auth:force-logout",
  SETTINGS_UPDATED: "admin:settings-updated",
};

export const LEGACY_REALTIME_EVENTS = {
  FORCE_LOGOUT: "session:force-logout",
};

export const REALTIME_ROOMS = {
  PUBLIC_GLOBAL: "public:global",
  ADMIN_GLOBAL: "admin:global",
  USER: (userId) => `user:${userId}`,
  SESSION: (sessionId) => `session:${sessionId}`,
};
