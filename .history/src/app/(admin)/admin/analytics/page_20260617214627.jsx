import Link from "next/link";
import {
  BarChart3,
  Users,
  Globe,
  DollarSign,
  Bot,
  ArrowRight,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const analyticsLinks = [
  {
    title: "User Analytics",
    desc: "Signups, retention, churn",
    href: "/admin/analytics/users",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Website Analytics",
    desc: "Site creation & publishing trends",
    href: "/admin/analytics/sites",
    icon: Globe,
    color: "bg-emerald-500",
  },
  {
    title: "Revenue Analytics",
    desc: "MRR, ARR, and revenue trends",
    href: "/admin/analytics/revenue",
    icon: DollarSign,
    color: "bg-yellow-500",
  },
  {
    title: "AI Analytics",
    desc: "Generation volume and token trends",
    href: "/admin/analytics/ai",
    icon: Bot,
    color: "bg-purple-500",
  },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Platform Analytics"
        description="High-level view of platform metrics across users, websites, revenue, and AI."
        route="/admin/analytics"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Users}
          label="Total Users"
          value="—"
          sub="All registered"
        />
        <AdminStatCard
          icon={Globe}
          label="Total Sites"
          value="—"
          sub="Generated"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={DollarSign}
          label="MRR"
          value="—"
          sub="Monthly recurring"
          iconClass="bg-yellow-500"
        />
        <AdminStatCard
          icon={Bot}
          label="AI Requests"
          value="—"
          sub="This month"
          iconClass="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analyticsLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div
              className={`w-12 h-12 rounded-2xl ${l.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <l.icon className={`w-6 h-6 text-${l.color.split("-")[1]}-500`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground">{l.title}</p>
              <p className="text-xs text-muted-foreground">{l.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-black text-foreground mb-4">
          Platform Growth (Last 30 Days)
        </h2>
        <div className="h-40 flex items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-primary/20 hover:bg-primary/40 transition-colors"
              style={{ height: `${30 + Math.sin(i * 0.4) * 20 + i * 1.5}%` }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Daily user signups — placeholder chart
        </p>
      </div>
    </div>
  );
}
