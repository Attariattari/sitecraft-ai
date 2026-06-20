import { Globe, TrendingUp } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function AdminSiteAnalyticsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Website Analytics"
        description="Track website creation, publishing rates, template and category trends."
        route="/admin/analytics/sites"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Globe}
          label="Total Sites"
          value="—"
          sub="All generated"
        />
        <AdminStatCard
          icon={Globe}
          label="Published"
          value="—"
          sub="Live sites"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={TrendingUp}
          label="Created Today"
          value="—"
          sub="New sites"
          iconClass="bg-blue-500"
        />
        <AdminStatCard
          icon={Globe}
          label="Avg per User"
          value="—"
          sub="Sites per account"
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-black text-foreground mb-4">
          Site Creation Trend (30 Days)
        </h2>
        <div className="h-40 flex items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors"
              style={{
                height: `${20 + Math.sin(i * 0.6) * 20 + Math.random() * 30}%`,
              }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Placeholder chart — connect analytics API
        </p>
      </div>
    </div>
  );
}
