"use client";

import React from "react";
import { BarChart3, TrendingUp, Eye, Globe } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import Link from "next/link";

export function DashboardAnalyticsSnapshot({ views = 0, publishedCount = 0 }) {
  return (
    <DashboardCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          Performance Snapshot
        </h3>
        <Link
          href="/dashboard/analytics"
          className="text-[11px] font-bold text-primary hover:bg-primary/5 px-2.5 py-1 rounded-lg transition-colors border border-primary/10"
        >
          Detailed Report
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Total Views
            </span>
          </div>
          <div className="text-2xl font-black text-foreground">
            {views.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Live Sites
            </span>
          </div>
          <div className="text-2xl font-black text-foreground">
            {publishedCount}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-1 h-24 pt-2">
          {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div
                className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-lg transition-all duration-300 relative"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h * 12}
                </div>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground">
                M T W T F S S".split(" ")[i]
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5 mt-2">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          <span className="font-bold text-emerald-500">+12.5%</span> traffic
          increase this week
        </p>
      </div>
    </DashboardCard>
  );
}
