"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { realtimeClient } from "@/lib/realtime/realtimeClient";
import { REALTIME_EVENTS } from "@/lib/realtime/events";
import { Bell, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const RealtimeContext = createContext();

export function RealtimeProvider({ children }) {
  const { user, refreshUser, setUser } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications?limit=10");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      realtimeClient.startPolling();

      const handleForceLogout = (payload) => {
        addToast({
          title: "Session Expired",
          message: payload.reason || "Your access has been restricted.",
          type: "error",
        });
        setUser(null);
        router.push("/restricted");
      };

      const handleUserRestricted = (payload) => {
        addToast({
          title: "Access Restricted",
          message:
            payload.message || "Your account access has been restricted.",
          type: "error",
        });
      };

      const handleUserUnrestricted = () => {
        addToast({
          title: "Access Restored",
          message: "Your account access has been restored. Redirecting...",
          type: "success",
        });
        refreshUser();
        router.push("/dashboard");
      };

      const handleRoleUpdated = (payload) => {
        addToast({
          title: "Role Updated",
          message: `Your account role is now: ${payload.metadata?.newRole || "updated"}`,
          type: "info",
        });
        refreshUser();
      };

      const handleNewNotification = (notification) => {
        setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);
        addToast({
          title: notification.title,
          message: notification.message,
          type: "info",
        });
      };

      // Register listeners
      realtimeClient.on(
        REALTIME_EVENTS.SESSION.FORCE_LOGOUT,
        handleForceLogout,
      );
      realtimeClient.on(REALTIME_EVENTS.USER.RESTRICTED, handleUserRestricted);
      realtimeClient.on(
        REALTIME_EVENTS.USER.UNRESTRICTED,
        handleUserUnrestricted,
      );
      realtimeClient.on(REALTIME_EVENTS.USER.ROLE_UPDATED, handleRoleUpdated);
      realtimeClient.on("notification:new", handleNewNotification);

      return () => {
        realtimeClient.off(
          REALTIME_EVENTS.SESSION.FORCE_LOGOUT,
          handleForceLogout,
        );
        realtimeClient.off(
          REALTIME_EVENTS.USER.RESTRICTED,
          handleUserRestricted,
        );
        realtimeClient.off(
          REALTIME_EVENTS.USER.UNRESTRICTED,
          handleUserUnrestricted,
        );
        realtimeClient.off(
          REALTIME_EVENTS.USER.ROLE_UPDATED,
          handleRoleUpdated,
        );
        realtimeClient.off("notification:new", handleNewNotification);
        realtimeClient.stopPolling();
      };
    } else {
      realtimeClient.stopPolling();
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, router, refreshUser, setUser, addToast, fetchNotifications]);

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (res.ok) {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  return (
    <RealtimeContext.Provider
      value={{ notifications, unreadCount, markAllRead, addToast }}
    >
      {children}

      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pointer-events-auto"
            >
              <div
                className={`min-w-[320px] max-w-md p-4 rounded-2xl border shadow-2xl flex items-start gap-3 bg-card ${
                  toast.type === "error"
                    ? "border-destructive/30 bg-destructive/5"
                    : toast.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-border/50"
                }`}
              >
                <div
                  className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    toast.type === "error"
                      ? "bg-destructive/10 text-destructive"
                      : toast.type === "success"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  {toast.type === "error" ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : toast.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground">
                    {toast.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {toast.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  // Return safe defaults instead of throwing — prevents crashes if used outside provider
  if (!context) {
    return {
      notifications: [],
      unreadCount: 0,
      markAllRead: () => {},
      addToast: () => {},
    };
  }
  return context;
}
