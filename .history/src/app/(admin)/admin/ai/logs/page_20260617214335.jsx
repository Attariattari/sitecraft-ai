import { ScrollText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";

const mockLogs = [
  {
    user: "alice@example.com",
    category: "Portfolio",
    tokens: 1240,
    status: "success",
    duration: "2.3s",
    time: "2 min ago",
  },
  {
    user: "bob@example.com",
    category: "Business",
    tokens: 1050,
    status: "success",
    duration: "1.9s",
    time: "8 min ago",
  },
  {
    user: "carol@example.com",
    category: "E-commerce",
    tokens: 0,
    status: "error",
    duration: "—",
    time: "12 min ago",
  },
  {
    user: "dan@example.com",
    category: "Blog",
    tokens: 890,
    status: "success",
    duration: "1.5s",
    time: "25 min ago",
  },
  {
    user: "eve@example.com",
    category: "Restaurant",
    tokens: 1120,
    status: "success",
    duration: "2.1s",
    time: "1h ago",
  },
];

export default function AdminAILogsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="AI Generation Logs"
        description="View all AI website generation requests, token usage, and errors."
        route="/admin/ai/logs"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={ScrollText}
          label="Total Logs"
          value="—"
          sub="All time"
        />
        <AdminStatCard
          icon={CheckCircle2}
          label="Successful"
          value="—"
          sub="Completed"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={XCircle}
          label="Errors"
          value="—"
          sub="Failed"
          iconClass="bg-red-500"
        />
        <AdminStatCard
          icon={Clock}
          label="Avg Duration"
          value="—"
          sub="Response time"
          iconClass="bg-blue-500"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-black text-foreground">
            Recent Logs (Placeholder)
          </h2>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 rounded-lg border border-border bg-card outline-none text-xs">
              <option>All Status</option>
              <option>Success</option>
              <option>Error</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {[
                  "User",
                  "Category",
                  "Tokens Used",
                  "Status",
                  "Duration",
                  "Time",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockLogs.map((l, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-foreground font-medium">
                    {l.user}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {l.category}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-foreground">
                    {l.tokens > 0 ? l.tokens.toLocaleString() : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {l.status === "success" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-bold ${l.status === "success" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {l.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">
                    {l.duration}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {l.time}
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
