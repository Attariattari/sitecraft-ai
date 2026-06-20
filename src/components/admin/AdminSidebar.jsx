"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Shield,
  KeyRound,
  Globe,
  Tags,
  LayoutTemplate,
  Palette,
  FileUser,
  Bot,
  MessageSquareCode,
  ScrollText,
  Cpu,
  TrendingUp,
  Image,
  CloudCog,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Receipt,
  FileText,
  Coins,
  BarChart3,
  PieChart,
  LineChart,
  BrainCircuit,
  HeadphonesIcon,
  Bell,
  Mail,
  Lock,
  LogIn,
  Monitor,
  Gauge,
  Activity,
  ServerCog,
  Flag,
  ClipboardList,
  HardDrive,
  Settings,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

const navGroups = [
  {
    title: "MAIN",
    links: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: "USERS",
    links: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Admins", href: "/admin/admins", icon: Shield },
      { name: "Roles & Permissions", href: "/admin/roles", icon: KeyRound },
    ],
  },
  {
    title: "WEBSITES",
    links: [
      { name: "All Websites", href: "/admin/sites", icon: Globe },
      { name: "Categories", href: "/admin/categories", icon: Tags },
      { name: "Templates", href: "/admin/templates", icon: LayoutTemplate },
      { name: "Themes", href: "/admin/themes", icon: Palette },
      {
        name: "Personal Info Data",
        href: "/admin/personal-info",
        icon: FileUser,
      },
    ],
  },
  {
    title: "AI CONTROL",
    links: [
      { name: "AI Overview", href: "/admin/ai", icon: Bot },
      {
        name: "Prompt Manager",
        href: "/admin/ai/prompts",
        icon: MessageSquareCode,
      },
      { name: "AI Logs", href: "/admin/ai/logs", icon: ScrollText },
      { name: "AI Providers", href: "/admin/ai/providers", icon: Cpu },
      { name: "AI Usage", href: "/admin/ai/usage", icon: TrendingUp },
    ],
  },
  {
    title: "MEDIA",
    links: [
      { name: "Media Library", href: "/admin/media", icon: Image },
      { name: "Cloudinary Files", href: "/admin/cloudinary", icon: CloudCog },
    ],
  },
  {
    title: "BUSINESS",
    links: [
      { name: "Plans", href: "/admin/plans", icon: CreditCard },
      { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Payments", href: "/admin/payments", icon: Receipt },
      { name: "Invoices", href: "/admin/invoices", icon: FileText },
      { name: "Credits", href: "/admin/credits", icon: Coins },
    ],
  },
  {
    title: "ANALYTICS",
    links: [
      { name: "Platform Analytics", href: "/admin/analytics", icon: BarChart3 },
      {
        name: "User Analytics",
        href: "/admin/analytics/users",
        icon: PieChart,
      },
      {
        name: "Website Analytics",
        href: "/admin/analytics/sites",
        icon: LineChart,
      },
      {
        name: "Revenue Analytics",
        href: "/admin/analytics/revenue",
        icon: TrendingUp,
      },
      { name: "AI Analytics", href: "/admin/analytics/ai", icon: BrainCircuit },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { name: "Support Tickets", href: "/admin/support", icon: HeadphonesIcon },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Email Templates", href: "/admin/email-templates", icon: Mail },
    ],
  },
  {
    title: "SECURITY",
    links: [
      { name: "Security Overview", href: "/admin/security", icon: Lock },
      {
        name: "Access Requests",
        href: "/admin/security/access-requests",
        icon: ShieldCheck,
      },
      { name: "Login Logs", href: "/admin/security/logs", icon: LogIn },
      { name: "Sessions", href: "/admin/security/sessions", icon: Monitor },
      { name: "Rate Limits", href: "/admin/security/rate-limits", icon: Gauge },
    ],
  },
  {
    title: "SYSTEM",
    links: [
      { name: "Activity Logs", href: "/admin/activity-logs", icon: Activity },
      { name: "System Health", href: "/admin/system-health", icon: ServerCog },
      { name: "Integrations", href: "/admin/integrations", icon: CloudCog },
      { name: "Feature Flags", href: "/admin/feature-flags", icon: Flag },
      { name: "Reports", href: "/admin/reports", icon: ClipboardList },
      { name: "Backups", href: "/admin/backups", icon: HardDrive },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function SidebarContent({ onClose }) {
  const { user } = useUser();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState({});

  const isActive = (href, exact) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  const toggleGroup = (title) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-foreground">
              SiteCraft
            </span>
            <span className="text-sm font-bold tracking-tight text-primary">
              {" "}
              AI
            </span>
          </div>
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

      {/* Super Admin Badge + User */}
      <div className="px-5 py-3 border-b border-border bg-primary/5 shrink-0">
        <div className="flex items-center gap-3">
          {user?.profileImage?.url ? (
            <img
              src={user.profileImage.url}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-primary/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-xs font-bold border-2 border-primary/30">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">
              {user?.name ?? "Super Admin"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {user?.email ?? "admin@sitecraft.ai"}
            </p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/15 border border-primary/25">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-wider text-primary">
              Super Admin
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            <button
              onClick={() => toggleGroup(group.title)}
              className="w-full flex items-center justify-between px-3 mb-1.5 group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                {group.title}
              </span>
              <ChevronDown
                className={cn(
                  "w-3 h-3 text-muted-foreground transition-transform duration-200",
                  collapsed[group.title] && "-rotate-90",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {!collapsed[group.title] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-0.5"
                >
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href, link.exact);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="admin-sidebar-active"
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
                            "w-4 h-4 shrink-0 relative z-10",
                            active
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />
                        <span className="relative z-10 truncate">
                          {link.name}
                        </span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-4 border-t border-border pt-4 shrink-0 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          User Dashboard
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" />
          Back to Website
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-border bg-card/50 backdrop-blur-md h-screen sticky top-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-3 rounded-full bg-primary text-white shadow-xl shadow-primary/30"
        aria-label="Open admin menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
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
