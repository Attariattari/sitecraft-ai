"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, History, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import {
  DashboardCard,
  DashboardStatCard,
} from "@/components/dashboard/DashboardCard";

export default function DashboardCreditsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <DashboardShell>
      <DashboardPageHeader
        title="AI Credits"
        description="Manage your AI generation credits and usage history."
      >
        <Link
          href="/dashboard/billing"
          className="site-secondary-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Zap className="w-4 h-4 text-accent" />
          Upgrade Plan
        </Link>
      </DashboardPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Credits display */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Sparkles className="w-32 h-32" />
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="site-badge-emerald px-3 py-1 text-xs">
                Free Plan
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-extrabold tracking-tight text-foreground">
                  3
                </span>
                <span className="text-xl font-medium text-muted-foreground">
                  / 5 credits left
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Credits are used to generate websites and use AI editing
                features. Free plan credits reset every month.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-primary">2 used</span>
                <span className="text-muted-foreground">3 remaining</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden relative">
                <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-primary to-emerald-400" />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Usage History
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  action: "Generated Portfolio Site",
                  cost: -1,
                  date: "2 days ago",
                  site: "Alex Dev Portfolio",
                },
                {
                  action: "Generated Business Site",
                  cost: -1,
                  date: "1 week ago",
                  site: "TechNova Landing",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.site} · {item.date}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-destructive flex items-center gap-1">
                    {item.cost} <Sparkles className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Upgrade Sidebar */}
        <div className="space-y-6">
          <DashboardCard className="border-accent/20 bg-accent/5">
            <h3 className="text-base font-bold mb-2">Need more credits?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Upgrade to a premium plan to unlock more AI generation credits,
              custom domains, and advanced features.
            </p>

            <ul className="space-y-3 mb-6">
              {[
                "Up to 50 AI generations/mo",
                "Priority AI processing",
                "Advanced theme editor",
                "Custom domain support",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard/billing"
              className="site-primary-button flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-semibold !bg-gradient-to-r !from-accent !to-orange-500 shadow-orange-500/25"
            >
              View Plans <ArrowRight className="w-4 h-4" />
            </Link>
          </DashboardCard>
        </div>
      </div>
    </DashboardShell>
  );
}
