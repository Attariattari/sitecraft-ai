"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function UserMenu() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  if (!user) return null;

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
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-all border border-transparent hover:border-border"
      >
        {user.profileImage && user.profileImage.url ? (
          <img
            src={user.profileImage.url}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-foreground leading-none">
            {user.name}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
            {user.plan} Plan
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
              className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-2xl z-20 overflow-hidden"
            >
              <div className="p-3 border-b border-border">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {user.email}
                </p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>
              <div className="p-1.5 border-t border-border">
                <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors">
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
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);

  // Find page title – handle dynamic routes
  const title =
    Object.entries(pageTitles).find(([key]) => {
      if (key === "/dashboard") return pathname === "/dashboard";
      return pathname.startsWith(key);
    })?.[1] ?? "Dashboard";

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 flex items-center px-4 lg:px-6 gap-4">
      {/* Page title */}
      <div className="hidden lg:flex items-center gap-2 min-w-0 mr-auto">
        <h1 className="text-sm font-semibold text-foreground truncate">
          {title}
        </h1>
      </div>

      {/* Search */}
      <div
        className={cn(
          "flex items-center gap-2 h-8 px-3 rounded-lg border transition-all duration-200 bg-muted/50",
          searchFocused
            ? "border-primary/50 bg-background shadow-sm shadow-primary/10 w-56"
            : "border-border w-44",
        )}
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none min-w-0"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Credits quick-view */}
      <Link
        href="/dashboard/credits"
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors border border-primary/20"
      >
        <Coins className="w-3.5 h-3.5" />
        <span>3 credits</span>
      </Link>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
      </button>

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Quick generate button */}
      <Link
        href="/dashboard/generate"
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg site-primary-button text-xs font-semibold"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Generate
      </Link>

      {/* User menu */}
      <UserMenu />
    </header>
  );
}
