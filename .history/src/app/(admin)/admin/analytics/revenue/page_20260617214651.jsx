import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function AdminRevenueAnalyticsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Revenue Analytics"
        description="Track MRR, ARR, revenue growth, churn, and subscription trends."
        route="/admin/analytics/revenue"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={DollarSign}
          label="MRR"
          value="—"
          sub="Monthly recurring"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={DollarSign}
          label="ARR"
          value="—"
          sub="Annual recurring"
          iconClass="bg-blue-500"
        />
        <AdminStatCard
          icon={TrendingUp}
          label="Growth Rate"
          value="—"
          sub="Month over month"
        />
        <AdminStatCard
          icon={TrendingDown}
          label="Churn MRR"
          value="—"
          sub="Lost this month"
          iconClass="bg-red-500"
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-black text-foreground mb-4">
          Revenue Trend (Last 12 Months)
        </h2>
        <div className="h-48 flex items-end gap-1">
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-yellow-500/20 hover:bg-yellow-500/40 transition-colors"
                style={{ height: `${30 + i * 5 + Math.sin(i) * 10}px` }}
              />
              <span className="text-[9px] text-muted-foreground">{m}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Revenue placeholder chart — connect billing API
        </p>
      </div>
    </div>
  );
}
