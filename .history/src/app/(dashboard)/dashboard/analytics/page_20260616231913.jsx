"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { BarChart3, TrendingUp, Users, Clock, Globe } from "lucide-react";

export default function DashboardAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  // Simulate loading analytics data
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Analytics Overview"
        description="Monitor traffic, visitor behavior, and site performance across all your published websites."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardCard>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Total Visitors
                </h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">1,248</span>
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +12%
                </span>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Page Views
                </h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">3,192</span>
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +18%
                </span>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Avg. Time
                </h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">
                  1m 42s
                </span>
                <span className="text-[11px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                  -2%
                </span>
              </div>
            </DashboardCard>
            <DashboardCard>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Globe className="w-4 h-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Top Source
                </h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight truncate">
                  Direct Traffic
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  45%
                </span>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <DashboardCard className="min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                <BarChart3 className="w-12 h-12 text-primary/20 mb-3" />
                <p className="text-sm font-semibold text-foreground">
                  Traffic Analysis Chart
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-center max-w-sm">
                  Connect a custom domain or upgrade to Pro to see detailed
                  daily traffic visualizations and advanced metrics.
                </p>
                <button className="site-primary-button mt-4 px-4 py-2 rounded-lg text-xs font-medium">
                  Upgrade to Pro
                </button>
              </DashboardCard>
            </div>

            <div className="space-y-6">
              <DashboardCard>
                <h3 className="text-sm font-semibold mb-4">
                  Top Performing Sites
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "My Portfolio", views: "1,204", pct: "64%" },
                    { name: "Freelance Services", views: "542", pct: "28%" },
                    { name: "Design Agency", views: "145", pct: "8%" },
                  ].map((site, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-foreground truncate max-w-[120px]">
                          {site.name}
                        </span>
                        <span className="text-muted-foreground">
                          {site.views} views
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: site.pct }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
