import { Activity, Filter, Search, Download, User, Globe, Shield, Bot, Settings } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

const mockLogs = [
  { actor: "Sarah Mitchell", action: "Updated admin role for James Carter", category: "Admin", time: "2m ago", icon: Shield },
  { actor: "System", action: "Scheduled backup completed successfully", category: "System", time: "15m ago", icon: Settings },
  { actor: "Alice Johnson", action: "Published website: Alice Portfolio", category: "Website", time: "1h ago", icon: Globe },
  { actor: "Bob Smith", action: "Upgraded plan from Free to Pro", category: "Billing", time: "2h ago", icon: User },
  { actor: "Gemini AI", action: "Generated 12 websites in last hour", category: "AI", time: "3h ago", icon: Bot },
  { actor: "Sarah Mitchell", action: "Deleted inactive user account #4821", category: "Admin", time: "5h ago", icon: Shield },
  { actor: "System", action: "Rate limit triggered for IP 192.168.1.x", category: "Security", time: "6h ago", icon: Settings },
];

const categoryColors = {
  Admin: "bg-purple-500/10 text-purple-600",
  System: "bg-slate-500/10 text-slate-500",
  Website: "bg-emerald-500/10 text-emerald-600",
  Billing: "bg-blue-500/10 text-blue-600",
  AI: "bg-pink-500/10 text-pink-600",
  Security: "bg-red-500/10 text-red-600",
};

export default function ActivityLogsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Activity Logs"
        description="Full audit trail of all admin actions, system events, and user activity across the platform."
        route="/admin/activity-logs"
        badge="System"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-muted transition-all">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Activity} label="Total Events Today" value="—" sub="All activity" />
        <AdminStatCard icon={Shield} label="Admin Actions" value="—" sub="Privileged operations" iconClass="bg-purple-500" />
        <AdminStatCard icon={User} label="User Events" value="—" sub="User-triggered actions" iconClass="bg-blue-500" />
        <AdminStatCard icon={Settings} label="System Events" value="—" sub="Automated operations" iconClass="bg-slate-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs by action or actor..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
            <option>All Categories</option>
            <option>Admin</option>
            <option>System</option>
            <option>Website</option>
            <option>Billing</option>
            <option>AI</option>
            <option>Security</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">Recent Activity</h2>
          </div>
          <span className="text-xs text-muted-foreground">Live — updates on refresh</span>
        </div>
        <div className="divide-y divide-border/50">
          {mockLogs.map((log, i) => {
            const Icon = log.icon;
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{log.action}</p>
                  <p className="text-xs text-muted-foreground">By: {log.actor}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${categoryColors[log.category] ?? "bg-muted text-muted-foreground"}`}>
                    {log.category}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">{log.time}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3 border-t border-border bg-muted/10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing placeholder data — connect backend for live logs</p>
          <button className="text-xs text-primary font-bold hover:underline">Load More</button>
        </div>
      </div>
    </div>
  );
}
