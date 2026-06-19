"use client";

import { useState } from "react";
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
  FileText,
  Settings,
  ChevronLeft,
  Menu,
  X,
  ArrowUpRight,
  Zap,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

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
        name: "Personal Info",
        href: "/dashboard/personal-info",
        icon: FileText,
      },
      {
        name: "Templates",
        href: "/dashboard/templates",
        icon: LayoutDashboard,
      },
      { name: "Themes", href: "/dashboard/themes", icon: Sparkles },
      {
        name: "Brand Kit",
        href: "/dashboard/brand-kit",
        icon: LayoutDashboard,
      },
      { name: "Media Library", href: "/dashboard/media", icon: Globe },
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
    title: "AI & USAGE",
    links: [
      { name: "AI History", href: "/dashboard/ai-history", icon: Sparkles },
      { name: "Credits", href: "/dashboard/credits", icon: Coins },
    ],
  },
  {
    title: "BUSINESS",
    links: [
      { name: "Plans", href: "/dashboard/plans", icon: CreditCard },
      { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
      { name: "Invoices", href: "/dashboard/invoices", icon: ShoppingBag },
    ],
  },
  {
    title: "WORKSPACE",
    links: [
      { name: "Team", href: "/dashboard/team", icon: UserCircle },
      {
        name: "Integrations",
        href: "/dashboard/integrations",
        icon: LayoutDashboard,
      },
      {
        name: "Notifications",
        href: "/dashboard/notifications",
        icon: LayoutDashboard,
      },
      {
        name: "Activity Logs",
        href: "/dashboard/activity-logs",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { name: "Help Center", href: "/dashboard/help", icon: LayoutDashboard },
      {
        name: "Support Tickets",
        href: "/dashboard/support",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
      {
        name: "Personal Info",
        href: "/dashboard/personal-info",
        icon: FileText,
      },
      { name: "Security", href: "/dashboard/security", icon: Settings },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

function SidebarContent({ collapsed, onClose }) {
  const { user } = useUser();
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const isAdmin =
    user && (user.role === "admin" || user.role === "super-admin");

  const displayGroups = isAdmin
    ? [
        {
          title: "ADMINISTRATION",
          links: [{ name: "Admin Panel", href: "/admin", icon: ShieldCheck }],
        },
        ...navGroups,
      ]
    : navGroups;

  return (
    <div className="flex flex-col h-full">
      {/* ... (Logo and Plan badge unchanged) */}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-7">
        {displayGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {!collapsed && (
              <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
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
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 group",
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
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0 relative z-10",
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
                    <Zap className="w-4 h-4 ml-auto text-accent shrink-0 relative z-10" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Generate CTA */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-border">
          <Link
            href="/dashboard/generate"
            className="site-primary-button flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-base font-bold"
          >
            <Sparkles className="w-5 h-5" />
            Generate Website
          </Link>
        </div>
      )}

      {/* Back to site */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          >
            <ArrowUpRight className="w-4 h-4" />
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
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-border bg-card/50 backdrop-blur-md h-screen sticky top-0 flex-col text-left">
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
