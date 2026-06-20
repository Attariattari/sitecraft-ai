"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Coins,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useRealtime } from "@/components/providers/RealtimeProvider";
import { Info, ShieldCheck, ExternalLink } from "lucide-react";

const pageTitles = {
  "/dashboard": "Overview",
  "/dashboard/sites": "My Websites",
  "/dashboard/generate": "Generate Website",
  "/dashboard/analytics": "Analytics",
  "/dashboard/billing": "Billing",
  "/dashboard/orders": "Orders",
  "/dashboard/credits": "AI Credits",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  const toggle = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggle}
      className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

function UserMenu() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!user) return null;

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

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const isAdmin = user.role === "admin" || user.role === "super-admin";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border"
      >
        {user.profileImage && user.profileImage.url ? (
          <img
            src={user.profileImage.url}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold text-foreground leading-none">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1 capitalize font-bold">
            {user.plan} Plan
          </p>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform hidden sm:block",
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
              className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl z-20 overflow-hidden p-2"
            >
              <div className="p-4 border-b border-border mb-1">
                <p className="text-sm font-bold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate font-medium">
                  {user.email}
                </p>
              </div>
              <div className="space-y-1">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-primary rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-foreground rounded-xl hover:bg-muted transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-foreground rounded-xl hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>
              <div className="mt-1 pt-1 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
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

function DashboardNotificationDropdown() {
  const { notifications, unreadCount, markAllRead } = useRealtime();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary text-[10px] text-primary-foreground font-black flex items-center justify-center ring-2 ring-card shadow-lg">
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
                {notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 text-muted-foreground/50">
                      <Bell className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
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
                href="/dashboard/notifications"
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

export function DashboardTopbar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);

  // Find page title – handle dynamic routes
  const title =
    Object.entries(pageTitles).find(([key]) => {
      if (key === "/dashboard") return pathname === "/dashboard";
      return pathname.startsWith(key);
    })?.[1] ?? "Dashboard";

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 flex items-center px-4 lg:px-8 gap-6">
      {/* Page title */}
      <div className="hidden lg:flex items-center gap-2 min-w-0 mr-auto">
        <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
      </div>

      {/* Search */}
      <div
        className={cn(
          "flex items-center gap-3 h-10 px-4 rounded-xl border transition-all duration-300 bg-muted/50",
          searchFocused
            ? "border-primary/50 bg-background shadow-md shadow-primary/10 w-72"
            : "border-border w-56",
        )}
      >
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search everything..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Credits quick-view */}
      <Link
        href="/dashboard/credits"
        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary/15 transition-all border border-primary/20 shadow-sm"
      >
        <Coins className="w-4 h-4" />
        <span>{user ? user.credits : 0} credits</span>
      </Link>

      {/* Notifications */}
      <DashboardNotificationDropdown />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Quick generate button */}
      <Link
        href="/dashboard/generate"
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl site-primary-button text-sm font-bold shadow-lg"
      >
        <Sparkles className="w-4 h-4" />
        Generate
      </Link>

      {/* User menu */}
      <UserMenu />
    </header>
  );
}
