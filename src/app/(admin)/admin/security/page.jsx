import Link from "next/link";
import { Lock, LogIn, Monitor, Gauge, AlertTriangle, ShieldCheck, ArrowRight, Activity } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const subPages = [
  {
    title: "Login Logs",
    description: "View all login attempts — successful and failed — across the platform.",
    href: "/admin/security/logs",
    icon: LogIn,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Active Sessions",
    description: "Monitor all active user sessions and force-terminate suspicious ones.",
    href: "/admin/security/sessions",
    icon: Monitor,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Rate Limits",
    description: "View rate limit hit events and manage IP-level throttling rules.",
    href: "/admin/security/rate-limits",
    icon: Gauge,
    color: "bg-amber-500/10 text-amber-600",
  },
];

const recentAlerts = [
  { event: "5 failed login attempts from IP 203.x.x.x", level: "High", time: "3m ago" },
  { event: "Password reset requested for alice@example.com", level: "Medium", time: "22m ago" },
  { event: "New admin login from unrecognized location", level: "High", time: "1h ago" },
  { event: "Rate limit exceeded on /api/auth/login", level: "Medium", time: "2h ago" },
  { event: "New security code verified for bob@example.com", level: "Low", time: "4h ago" },
];

const levelColors = {
  High: "bg-red-500/10 text-red-600 border-red-500/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function SecurityOverviewPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Security Overview"
        description="Monitor platform security — login activity, active sessions, rate limits, and suspicious events."
        route="/admin/security"
        badge="Security"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={AlertTriangle} label="Failed Logins (24h)" value="—" sub="Blocked attempts" iconClass="bg-red-500" />
        <AdminStatCard icon={Monitor} label="Active Sessions" value="—" sub="Currently logged in" iconClass="bg-emerald-500" />
        <AdminStatCard icon={Gauge} label="Rate Limit Hits" value="—" sub="Last 24 hours" iconClass="bg-amber-500" />
        <AdminStatCard icon={ShieldCheck} label="Security Score" value="—" sub="Platform safety" iconClass="bg-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subPages.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.href}
              href={p.href}
              className="group flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-foreground mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-bold mt-auto">
                View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">Recent Security Alerts</h2>
          </div>
          <Link href="/admin/security/logs" className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-1.5 transition-all">
            Full Logs <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-border/50">
          {recentAlerts.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
              <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="flex-1 text-sm text-foreground truncate">{a.event}</p>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${levelColors[a.level]}`}>
                  {a.level}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
