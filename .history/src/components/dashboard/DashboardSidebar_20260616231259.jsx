"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Globe,
  Sparkles,
  BarChart3,
  CreditCard,
  ShoppingBag,
  Coins,
  UserCircle,
  Settings,
  ChevronLeft,
  Menu,
  X,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Websites", href: "/dashboard/sites", icon: Globe },
  {
    name: "Generate Website",
    href: "/dashboard/generate",
    icon: Sparkles,
    accent: true,
  },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Credits", href: "/dashboard/credits", icon: Coins },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

function SidebarContent({ collapsed, onClose }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-sm font-bold tracking-tight text-foreground">
                SiteCraft
              </span>
              <span className="text-sm font-bold tracking-tight text-primary">
                {" "}
                AI
              </span>
            </div>
          )}
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Plan badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Plan
            </span>
            <span className="site-badge-emerald text-[10px] py-0.5">Free</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-primary to-emerald-400" />
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              2/5 credits
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-primary/10 text-primary"
                  : link.accent
                    ? "text-accent hover:bg-accent/10 hover:text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 relative z-10",
                  active
                    ? "text-primary"
                    : link.accent
                      ? "text-accent"
                      : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {!collapsed && (
                <span className="relative z-10 truncate">{link.name}</span>
              )}
              {!collapsed && link.accent && !active && (
                <Zap className="w-3 h-3 ml-auto text-accent shrink-0 relative z-10" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Generate CTA */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-border">
          <Link
            href="/dashboard/generate"
            className="site-primary-button flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            Generate Website
          </Link>
        </div>
      )}

      {/* Back to site */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          >
            <ArrowUpRight className="w-3 h-3" />
            Back to Website
          </Link>
        </div>
      )}
    </div>
  );
}

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-card/50 backdrop-blur-md h-screen sticky top-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-3 rounded-full bg-primary text-white shadow-xl shadow-primary/30"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-card border-r border-border shadow-2xl flex flex-col"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
