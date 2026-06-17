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
  X,
  ArrowUpRight,
  Zap,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    title: "MAIN",
    links: [{ name: "Overview", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "CREATE",
    links: [
      {
        name: "Generate Website",
        href: "/dashboard/generate",
        icon: Sparkles,
        accent: true,
      },
      { name: "My Websites", href: "/dashboard/sites", icon: Globe },
      {
        name: "Templates", // using LayoutDashboard as placeholder
        href: "/dashboard/templates",
        icon: LayoutDashboard,
      },
      { name: "Themes", href: "/dashboard/themes", icon: Sparkles },
    ],
  },
  {
    title: "GROWTH",
    links: [
      { name: "SEO Center", href: "/dashboard/seo", icon: BarChart3 },
      { name: "Custom Domains", href: "/dashboard/domains", icon: Globe },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
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
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Plan
            </span>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Free
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-2/5 rounded-full bg-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold italic">
              2/5 credits left
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-8">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">
                {group.title}
              </h3>
            )}
            {group.links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 group",
                    active
                      ? "bg-primary/10 text-primary"
                      : link.accent
                        ? "text-primary hover:bg-primary/5"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 relative z-10",
                      active
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  {!collapsed && (
                    <span className="relative z-10 truncate">{link.name}</span>
                  )}
                  {!collapsed && link.accent && !active && (
                    <Zap className="w-3 h-3 ml-auto text-primary shrink-0 relative z-10 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Generate CTA Button */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-border">
          <Link
            href="/dashboard/generate"
            className="site-primary-button flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-[13px] font-black shadow-lg shadow-primary/20 transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Generate Website
          </Link>
        </div>
      )}

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-lg"
          >
            <ArrowUpRight className="w-3 h-3" />
            Back to Public Home
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
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-card/30 backdrop-blur-xl h-screen sticky top-0 flex-col">
        <SidebarContent />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 ring-4 ring-background"
      >
        <Menu className="w-6 h-6" />
      </button>

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
