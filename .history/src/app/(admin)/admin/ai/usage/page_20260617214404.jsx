import { TrendingUp, Coins, BarChart3 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

const topUsers = [
  { name: "Alice Johnson", tokens: 24500, generations: 18, plan: "Pro" },
  { name: "Carol White", tokens: 19200, generations: 14, plan: "Agency" },
  { name: "Bob Smith", tokens: 8900, generations: 7, plan: "Free" },
  { name: "Eve Davis", tokens: 7100, generations: 5, plan: "Pro" },
];

export default function AdminAIUsagePage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="AI Usage"
        description="Platform-wide AI token consumption, credit usage, and generation trends."
        route="/admin/ai/usage"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={TrendingUp}
          label="Total Tokens"
          value="—"
          sub="All time"
        />
        <AdminStatCard
          icon={TrendingUp}
          label="Tokens This Month"
          value="—"
          sub="Current month"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={Coins}
          label="Credits Issued"
          value="—"
          sub="Platform-wide"
          iconClass="bg-yellow-500"
        />
        <AdminStatCard
          icon={Coins}
          label="Credits Used"
          value="—"
          sub="All time"
          iconClass="bg-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart Placeholder */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-black text-foreground mb-4">
            Daily Token Usage (Last 30 Days)
          </h2>
          <div className="h-48 flex items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/20 hover:bg-primary/40 transition-colors"
                style={{
                  height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 40}%`,
                }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Placeholder chart — connect analytics API for real data
          </p>
        </div>

        {/* Top Users */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-black text-foreground">Top AI Users</h2>
          </div>
          <div className="divide-y divide-border/50">
            {topUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <span className="text-xs font-black text-muted-foreground w-5">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.tokens.toLocaleString()} tokens · {u.generations}{" "}
                    generations
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  {u.plan}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
