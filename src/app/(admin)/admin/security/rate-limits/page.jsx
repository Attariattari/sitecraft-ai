import { Gauge, Search, Filter, ShieldBan, Clock, Zap } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";

const rules = [
  { route: "/api/auth/login", limit: "10 req / min", window: "60s", action: "Block 15min", hits: "—" },
  { route: "/api/auth/signup", limit: "5 req / min", window: "60s", action: "Block 30min", hits: "—" },
  { route: "/api/ai/generate", limit: "3 req / min", window: "60s", action: "Queue", hits: "—" },
  { route: "/api/auth/forgot-password", limit: "3 req / 10min", window: "600s", action: "Block 1h", hits: "—" },
  { route: "/api/*", limit: "100 req / min", window: "60s", action: "Throttle", hits: "—" },
];

export default function RateLimitsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Rate Limits"
        description="View configured rate limit rules, hit counts, and blocked IP addresses."
        route="/admin/security/rate-limits"
        badge="Security"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Gauge} label="Active Rules" value={String(rules.length)} sub="Configured limits" />
        <AdminStatCard icon={Zap} label="Hits Today" value="—" sub="Rate limit triggers" iconClass="bg-amber-500" />
        <AdminStatCard icon={ShieldBan} label="Blocked IPs" value="—" sub="Auto-blocked today" iconClass="bg-red-500" />
        <AdminStatCard icon={Clock} label="Avg Block Duration" value="—" sub="Minutes per block" />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">Rate Limit Rules</h2>
          </div>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all">
            + Add Rule
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {["Route", "Limit", "Window", "Action", "Hits (24h)", "Controls"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rules.map((r, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono text-foreground">{r.route}</td>
                  <td className="px-5 py-4 text-xs font-bold text-foreground">{r.limit}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{r.window}</td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-bold">{r.action}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{r.hits}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="text-[10px] px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-bold hover:bg-muted/70 transition-all">Edit</button>
                      <button className="text-[10px] px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive font-bold hover:bg-destructive/20 transition-all">Disable</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-black text-foreground">Recently Blocked IPs</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Auto-blocked IPs from rate limit violations in the last 24 hours</p>
        </div>
        <AdminTablePlaceholder columns={["IP Address", "Route", "Hit Count", "Blocked At", "Expires", "Action"]} rows={4} />
      </div>
    </div>
  );
}
