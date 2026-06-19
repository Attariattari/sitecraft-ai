import { Users, UserPlus, TrendingDown } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function AdminUserAnalyticsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="User Analytics"
        description="Track user growth, retention, churn, and plan distribution."
        route="/admin/analytics/users"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Users}
          label="Total Users"
          value="—"
          sub="All time"
        />
        <AdminStatCard
          icon={UserPlus}
          label="New This Month"
          value="—"
          sub="Current period"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={TrendingDown}
          label="Churn Rate"
          value="—"
          sub="This month"
        />
        <AdminStatCard
          icon={Users}
          label="Active Today"
          value="—"
          sub="DAU"
          iconClass="bg-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-black text-foreground mb-4">
            User Growth (30 Days)
          </h2>
          <div className="h-40 flex items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-blue-500/20 hover:bg-blue-500/40 transition-colors"
                style={{ height: `${15 + i * 2 + Math.sin(i) * 10}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-black text-foreground mb-4">
            Plan Distribution
          </h2>
          <div className="space-y-3">
            {[
              ["Free", "—", "bg-muted"],
              ["Pro", "—", "bg-emerald-500"],
              ["Agency", "—", "bg-purple-500"],
              ["Enterprise", "—", "bg-yellow-500"],
            ].map(([plan, pct, color]) => (
              <div key={plan} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{plan}</span>
                  <span className="text-muted-foreground">{pct}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${color} w-0`} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Backend integration required for real distribution
          </p>
        </div>
      </div>
    </div>
  );
}
