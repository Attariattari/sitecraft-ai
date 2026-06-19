"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

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

function AdminUserMenu() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
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

  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 flex items-center px-4 lg:px-6 gap-4">
      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-1.5 min-w-0 mr-auto">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-muted-foreground/40 text-xs">/</span>
            )}
            <span
              className={cn(
                "text-sm font-semibold",
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

      {/* Search */}
      <div
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-xl border transition-all duration-300 bg-muted/50",
          searchFocused
            ? "border-primary/50 bg-background shadow-md shadow-primary/10 w-64"
            : "border-border w-48",
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
      <button className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
        <Bell className="w-4.5 h-4.5" />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent ring-2 ring-card" />
      </button>

      {/* Theme */}
      <ThemeToggle />

      {/* User */}
      <AdminUserMenu />
    </header>
  );
}
