"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  ExternalLink,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useRealtime } from "@/components/providers/RealtimeProvider";
import { usePlatformTheme } from "@/hooks/usePlatformTheme";
import { Info } from "lucide-react";

function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = usePlatformTheme();
  const { user } = useUser();

  if (!mounted) return null;

  return (
    <button
      onClick={() => toggleTheme(user)}
      className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

function AdminUserMenu() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Notify other tabs immediately
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        try {
          const bc = new BroadcastChannel("sitecraft-auth");
          bc.postMessage({ type: "logout" });
          bc.close();
        } catch (e) {
          console.warn("BroadcastChannel broadcast failed:", e);
        }
      }

      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border"
      >
        {user?.profileImage?.url ? (
          <img
            src={user.profileImage.url}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-foreground leading-none">
            {user?.name ?? "Super Admin"}
          </p>
          <p className="text-[10px] text-primary mt-0.5 font-bold">
            Super Admin
          </p>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform hidden sm:block",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-60 bg-card border border-border rounded-2xl shadow-2xl z-20 overflow-hidden p-2"
            >
              <div className="p-3 border-b border-border mb-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    Super Admin
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.name ?? "Super Admin"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {user?.email ?? "admin@sitecraft.ai"}
                </p>
              </div>
              <div className="space-y-0.5">
                <Link
                  href="/admin/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-foreground rounded-xl hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Admin Settings
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-foreground rounded-xl hover:bg-muted transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  User Dashboard
                </Link>
              </div>
              <div className="mt-1 pt-1 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminTopbar() {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);

  // Build breadcrumb from pathname
  const segments = pathname.replace("/admin", "").split("/").filter(Boolean);
  const breadcrumb = [
    "Admin",
    ...segments.map((s) =>
      s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    ),
  ];

  const currentPage = breadcrumb[breadcrumb.length - 1] || "Admin";

  const openMobileSidebar = () => {
    window.dispatchEvent(new Event("sitecraft:open-admin-sidebar"));
  };

  return (
    <header className="h-16 border-b border-border/70 bg-card/85 backdrop-blur-xl sticky top-0 z-30 flex items-center px-3 sm:px-4 lg:px-6 gap-3 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center gap-3 min-w-0 mr-auto">
        <button
          onClick={openMobileSidebar}
          className="lg:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm hover:bg-muted transition-colors"
          aria-label="Open admin menu"
          title="Open admin menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <p className="lg:hidden text-sm font-bold text-foreground truncate">
            {currentPage}
          </p>
          <div className="hidden lg:flex items-center gap-1.5 min-w-0">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-muted-foreground/40 text-xs">/</span>
                )}
                <span
                  className={cn(
                    "text-sm font-semibold whitespace-nowrap",
                    i === breadcrumb.length - 1
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-end gap-1.5 sm:gap-2">
        {/* Search */}
        <div
          className={cn(
            "hidden md:flex items-center gap-2 h-10 px-3 rounded-xl border transition-all duration-300 bg-muted/50",
            searchFocused
              ? "border-primary/50 bg-background shadow-md shadow-primary/10 w-72"
              : "border-border w-52",
          )}
        >
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search admin..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Theme */}
        <ThemeToggle />

        {/* User */}
        <AdminUserMenu />
      </div>
    </header>
  );
}

function NotificationDropdown() {
  const { notifications, unreadCount, markAllRead } = useRealtime();
  const [open, setOpen] = useState(false);
  const uniqueNotifications = notifications.filter((notification, index, list) => {
    const key = notification?._id || `${notification?.title || "notification"}-${notification?.createdAt || index}`;
    return list.findIndex((item, itemIndex) => {
      const itemKey = item?._id || `${item?.title || "notification"}-${item?.createdAt || itemIndex}`;
      return itemKey === key;
    }) === index;
  });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-[10px] text-primary-foreground font-black flex items-center justify-center ring-2 ring-card shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-20 overflow-hidden flex flex-col max-h-[480px]"
            >
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                <h3 className="text-sm font-bold text-foreground">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto py-1 custom-scrollbar">
                {uniqueNotifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 text-muted-foreground/50">
                      <Bell className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  uniqueNotifications.map((n, index) => (
                    <div
                      key={`${n._id || "notification"}-${n.createdAt || index}`}
                      className={cn(
                        "p-3.5 border-b border-border/50 hover:bg-muted/30 transition-colors last:border-0",
                        !n.read && "bg-primary/5 border-l-2 border-l-primary",
                      )}
                    >
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            n.type.includes("restrict")
                              ? "bg-destructive/10 text-destructive"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          <Info className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                          <p className="text-[9px] text-muted-foreground/60 mt-1.5 font-medium uppercase tracking-wider">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Link
                href="/admin/notifications"
                onClick={() => setOpen(false)}
                className="p-3 text-center border-t border-border text-[11px] font-bold text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              >
                View all notifications
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
