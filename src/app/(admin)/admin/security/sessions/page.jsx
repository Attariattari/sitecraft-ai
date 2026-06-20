import { Monitor, Search, Wifi, LogOut, ShieldAlert } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const mockSessions = [
  { user: "Alice Johnson", email: "alice@example.com", device: "Chrome / Mac", ip: "192.168.1.10", location: "New York, US", started: "2h ago", status: "Active" },
  { user: "Bob Smith", email: "bob@example.com", device: "Firefox / Windows", ip: "10.0.0.5", location: "London, UK", started: "4h ago", status: "Active" },
  { user: "Sarah Mitchell", email: "sarah@sitecraft.ai", device: "Safari / iPhone", ip: "10.0.0.1", location: "Internal", started: "30m ago", status: "Active" },
  { user: "Carol White", email: "carol@example.com", device: "Chrome / Linux", ip: "203.0.113.5", location: "Sydney, AU", started: "1d ago", status: "Idle" },
];

export default function SecuritySessionsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Active Sessions"
        description="Monitor all active user sessions on the platform and force-terminate suspicious ones."
        route="/admin/security/sessions"
        badge="Security"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Monitor} label="Active Sessions" value="—" sub="Currently logged in" iconClass="bg-emerald-500" />
        <AdminStatCard icon={Wifi} label="Unique IPs" value="—" sub="Distinct locations" />
        <AdminStatCard icon={Monitor} label="Admin Sessions" value="—" sub="Privileged access" iconClass="bg-purple-500" />
        <AdminStatCard icon={ShieldAlert} label="Suspicious" value="—" sub="Flagged sessions" iconClass="bg-red-500" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by user or IP..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm font-bold hover:bg-destructive/20 transition-all">
          <LogOut className="w-4 h-4" />
          Terminate All
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">All Sessions</h2>
          </div>
          <span className="text-xs text-muted-foreground">{mockSessions.length} active</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {["User", "Device", "IP Address", "Location", "Started", "Status", "Action"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockSessions.map((s, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-foreground">{s.user}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{s.device}</td>
                  <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{s.ip}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{s.location}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{s.started}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${s.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-[10px] px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-bold hover:bg-destructive/20 transition-all">
                      Terminate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10">
        <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
          <strong>Warning:</strong> Terminating a session will immediately log out the user. This action is logged in the Activity Log.
        </p>
      </div>
    </div>
  );
}
