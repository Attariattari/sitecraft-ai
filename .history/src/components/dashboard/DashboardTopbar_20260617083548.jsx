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
      <button className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
        <Bell className="w-5 h-5" />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent ring-2 ring-card" />
      </button>

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
