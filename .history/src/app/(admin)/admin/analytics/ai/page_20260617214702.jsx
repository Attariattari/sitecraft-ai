import { Bot, TrendingUp, AlertCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function AdminAIAnalyticsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="AI Analytics"
        description="Track AI generation volume, token usage trends, success rates, and provider performance."
        route="/admin/analytics/ai"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Bot}
          label="Total Generations"
          value="—"
          sub="All time"
          iconClass="bg-purple-500"
        />
        <AdminStatCard
          icon={TrendingUp}
          label="This Month"
          value="—"
          sub="Current period"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={AlertCircle}
          label="Error Rate"
          value="—"
          sub="Last 30 days"
        />
        <AdminStatCard
          icon={Bot}
          label="Avg Tokens"
          value="—"
          sub="Per generation"
          iconClass="bg-blue-500"
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-black text-foreground mb-4">
          Daily AI Generations (30 Days)
        </h2>
        <div className="h-40 flex items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
              style={{
                height: `${25 + Math.sin(i * 0.7) * 25 + Math.random() * 30}%`,
              }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Placeholder chart — connect AI logs API
        </p>
      </div>
    </div>
  );
}
