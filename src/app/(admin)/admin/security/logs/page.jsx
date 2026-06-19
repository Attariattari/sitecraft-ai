import { LogIn, Search, Filter, CheckCircle2, XCircle, Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";

const mockLogs = [
  { user: "alice@example.com", ip: "192.168.1.10", result: "Success", location: "New York, US", time: "2m ago" },
  { user: "bob@example.com", ip: "203.0.113.42", result: "Failed", location: "Unknown", time: "8m ago" },
  { user: "carol@example.com", ip: "10.0.0.5", result: "Success", location: "London, UK", time: "15m ago" },
  { user: "admin@sitecraft.ai", ip: "10.0.0.1", result: "Success", location: "Internal", time: "1h ago" },
  { user: "dan@example.com", ip: "198.51.100.99", result: "Failed", location: "Unknown", time: "2h ago" },
  { user: "dan@example.com", ip: "198.51.100.99", result: "Failed", location: "Unknown", time: "2h ago" },
];

export default function SecurityLogsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Login Logs"
        description="Complete record of all login attempts — successful and failed — across the platform."
        route="/admin/security/logs"
        badge="Security"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-muted transition-all">
          <Download className="w-4 h-4" />
          Export
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={CheckCircle2} label="Successful Logins" value="—" sub="Last 24 hours" iconClass="bg-emerald-500" />
        <AdminStatCard icon={XCircle} label="Failed Attempts" value="—" sub="Last 24 hours" iconClass="bg-red-500" />
        <AdminStatCard icon={LogIn} label="Unique IPs" value="—" sub="Last 24 hours" />
        <AdminStatCard icon={LogIn} label="Blocked IPs" value="—" sub="Auto-blocked" iconClass="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by email or IP address..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
            <option>All Results</option>
            <option>Success</option>
            <option>Failed</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <LogIn className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">Login Attempts</h2>
          </div>
          <span className="text-xs text-muted-foreground">{mockLogs.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {["Email", "IP Address", "Result", "Location", "Time", "Action"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockLogs.map((log, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{log.user}</td>
                  <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{log.ip}</td>
                  <td className="px-5 py-4">
                    {log.result === "Success" ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Success</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-600 text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> Failed</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{log.location}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{log.time}</td>
                  <td className="px-5 py-4">
                    <button className="text-[10px] px-2.5 py-1 rounded-lg bg-muted text-muted-foreground hover:bg-muted/70 font-bold transition-all">Block IP</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
