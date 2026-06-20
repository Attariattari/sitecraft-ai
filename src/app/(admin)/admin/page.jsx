"use client";

import Link from "next/link";
import {
  Users,
  Globe,
  Sparkles,
  TrendingUp,
  CreditCard,
  DollarSign,
  HeadphonesIcon,
  ServerCog,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  LayoutTemplate,
  Shield,
  Activity,
  Bot,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const stats = [
  {
    icon: Users,
    label: "Total Users",
    value: "—",
    sub: "Registered accounts",
    trend: null,
  },
  {
    icon: Globe,
    label: "Total Websites",
    value: "—",
    sub: "All generated sites",
    trend: null,
  },
  {
    icon: Globe,
    label: "Published Sites",
    value: "—",
    sub: "Live on platform",
    trend: null,
  },
  {
    icon: Bot,
    label: "AI Generations",
    value: "—",
    sub: "Total AI requests",
    trend: null,
  },
  {
    icon: CreditCard,
    label: "Active Plans",
    value: "—",
    sub: "Paid subscribers",
    trend: null,
  },
  {
    icon: DollarSign,
    label: "Total Revenue",
    value: "—",
    sub: "All time revenue",
    trend: null,
  },
  {
    icon: HeadphonesIcon,
    label: "Support Tickets",
    value: "—",
    sub: "Open tickets",
    trend: null,
  },
  {
    icon: ServerCog,
    label: "System Health",
    value: "—",
    sub: "All services",
    trend: null,
  },
];

const quickActions = [
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: Users,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    label: "Manage Websites",
    href: "/admin/sites",
    icon: Globe,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "View AI Logs",
    href: "/admin/ai/logs",
    icon: Bot,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    label: "System Health",
    href: "/admin/system-health",
    icon: ServerCog,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    label: "Manage Templates",
    href: "/admin/templates",
    icon: LayoutTemplate,
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    label: "Support Tickets",
    href: "/admin/support",
    icon: HeadphonesIcon,
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
];

const healthItems = [
  { name: "MongoDB", status: "checking", icon: ServerCog },
  { name: "Cloudinary", status: "checking", icon: Globe },
  { name: "Nodemailer", status: "checking", icon: Sparkles },
  { name: "Gemini AI", status: "checking", icon: Bot },
];

const recentUsers = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    plan: "Pro",
    role: "user",
    ago: "2h ago",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    plan: "Free",
    role: "user",
    ago: "5h ago",
  },
  {
    name: "Carol White",
    email: "carol@example.com",
    plan: "Agency",
    role: "user",
    ago: "1d ago",
  },
  {
    name: "Dan Brown",
    email: "dan@example.com",
    plan: "Free",
    role: "user",
    ago: "2d ago",
  },
];

const recentSites = [
  {
    title: "Alice Portfolio",
    user: "Alice Johnson",
    category: "Portfolio",
    status: "Published",
    ago: "1h ago",
  },
  {
    title: "Bob's Restaurant",
    user: "Bob Smith",
    category: "Business",
    status: "Draft",
    ago: "4h ago",
  },
  {
    title: "Carol Boutique",
    user: "Carol White",
    category: "E-commerce",
    status: "Published",
    ago: "1d ago",
  },
  {
    title: "Dan Blog",
    user: "Dan Brown",
    category: "Blog",
    status: "Draft",
    ago: "2d ago",
  },
];

function StatusDot({ status }) {
  if (status === "online")
    return (
      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
    );
  if (status === "offline")
    return <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />;
  return (
    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse inline-block" />
  );
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Super Admin Overview"
        description="Full platform control — manage users, websites, AI, billing, and system health."
        route="/admin"
        badge="Super Admin"
      >
        <Link
          href="/admin/system-health"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
        >
          <ServerCog className="w-4 h-4" />
          System Health
        </Link>
      </AdminPageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <AdminStatCard key={i} {...s} />
        ))}
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-base font-black text-foreground mb-4 tracking-tight">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color} group-hover:scale-110 transition-transform`}
              >
                <a.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-foreground leading-tight">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-foreground">
                Recent Users
              </h2>
            </div>
            <Link
              href="/admin/users"
              className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {recentUsers.map((u, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center text-xs font-black text-primary border border-primary/10 shrink-0">
                  {u.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {u.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {u.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {u.plan}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {u.ago}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sites */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-foreground">
                Recent Websites
              </h2>
            </div>
            <Link
              href="/admin/sites"
              className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {recentSites.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {s.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.user} · {s.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${s.status === "Published" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                  >
                    {s.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {s.ago}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Health */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ServerCog className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-foreground">
                Platform Health
              </h2>
            </div>
            <Link
              href="/admin/system-health"
              className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {healthItems.map((h, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    {h.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot status={h.status} />
                  <span className="text-xs text-muted-foreground capitalize">
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Usage Snapshot */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-foreground">
                AI Usage Snapshot
              </h2>
            </div>
            <Link
              href="/admin/ai/usage"
              className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: "Total Generations Today", value: "—" },
              { label: "Tokens Used This Month", value: "—" },
              { label: "Active Provider", value: "Gemini 1.5 Flash" },
              { label: "Avg Response Time", value: "—" },
              { label: "Error Rate (24h)", value: "—" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">
              Recent Admin Activity
            </h2>
          </div>
          <Link
            href="/admin/activity-logs"
            className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            Full Logs <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-5">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Activity logs will appear here
            </p>
            <p className="text-xs text-muted-foreground">
              Backend integration required to show real logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
