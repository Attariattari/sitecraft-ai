import { HardDrive, Download, RefreshCw, CheckCircle2, Clock, Database, AlertTriangle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

const mockBackups = [
  { name: "backup-2026-06-18-auto", type: "Automatic", size: "—", status: "Completed", created: "Jun 18, 2026 02:00 AM" },
  { name: "backup-2026-06-17-auto", type: "Automatic", size: "—", status: "Completed", created: "Jun 17, 2026 02:00 AM" },
  { name: "backup-2026-06-16-manual", type: "Manual", size: "—", status: "Completed", created: "Jun 16, 2026 10:15 AM" },
  { name: "backup-2026-06-15-auto", type: "Automatic", size: "—", status: "Completed", created: "Jun 15, 2026 02:00 AM" },
];

const statusColors = {
  Completed: "bg-emerald-500/10 text-emerald-600",
  Running: "bg-blue-500/10 text-blue-600",
  Failed: "bg-red-500/10 text-red-600",
};

export default function BackupsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Backups"
        description="Manage automated and manual database backups. All backups are stored securely."
        route="/admin/backups"
        badge="System"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-muted transition-all">
          <RefreshCw className="w-4 h-4" />
          Run Backup Now
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={HardDrive} label="Total Backups" value={String(mockBackups.length)} sub="Stored backups" />
        <AdminStatCard icon={CheckCircle2} label="Last Backup" value="Jun 18" sub="Completed successfully" iconClass="bg-emerald-500" />
        <AdminStatCard icon={Clock} label="Next Scheduled" value="Jun 19" sub="Runs at 2:00 AM UTC" iconClass="bg-blue-500" />
        <AdminStatCard icon={Database} label="Storage Used" value="—" sub="Backup storage" iconClass="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-black text-foreground">Backup Schedule</h2>
          <div className="space-y-3">
            {[
              { label: "Automatic Backups", value: "Daily at 2:00 AM UTC", active: true },
              { label: "Retention Period", value: "30 days", active: true },
              { label: "Backup Type", value: "MongoDB Full Dump", active: true },
              { label: "Compression", value: "Gzip enabled", active: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-2 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:bg-muted transition-all">
            Edit Schedule
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-black text-foreground">Storage Destination</h2>
          <div className="space-y-3">
            {[
              { label: "Provider", value: "MongoDB Atlas" },
              { label: "Location", value: "— (not configured)" },
              { label: "Encryption", value: "AES-256" },
              { label: "Access Control", value: "Super Admin only" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-2 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:bg-muted transition-all">
            Configure Storage
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">Backup History</h2>
          </div>
          <span className="text-xs text-muted-foreground">{mockBackups.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {["Name", "Type", "Size", "Status", "Created", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockBackups.map((b, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono text-foreground">{b.name}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${b.type === "Manual" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{b.size}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${statusColors[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{b.created}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="text-[10px] px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-bold hover:bg-muted/70 transition-all flex items-center gap-1">
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
            <strong>Important:</strong> Backup download and restore require backend integration. This page shows placeholder structure only.
          </p>
        </div>
      </div>
    </div>
  );
}
