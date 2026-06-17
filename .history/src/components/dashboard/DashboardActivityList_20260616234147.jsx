"use client";

import React from "react";
import {
  Sparkles,
  Globe,
  Share2,
  Palette,
  Search,
  History,
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";

const ICON_MAP = {
  generate: { icon: Sparkles, color: "text-primary", bg: "bg-primary/10" },
  publish: { icon: Share2, color: "text-blue-500", bg: "bg-blue-500/10" },
  update: { icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  theme: { icon: Palette, color: "text-purple-500", bg: "bg-purple-500/10" },
  seo: { icon: Search, color: "text-orange-500", bg: "bg-orange-500/10" },
};

export function DashboardActivityList({ activities = [] }) {
  return (
    <DashboardCard className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <History className="w-4 h-4 text-muted-foreground" />
          Recent Activity
        </h3>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">
              No recent activity yet.
            </p>
          </div>
        ) : (
          activities.map((activity, idx) => {
            const config = ICON_MAP[activity.type] || ICON_MAP.update;
            const Icon = config.icon;

            return (
              <div key={idx} className="flex gap-4 relative">
                {idx !== activities.length - 1 && (
                  <div className="absolute left-[18px] top-9 bottom-[-24px] w-0.5 bg-border/50" />
                )}

                <div
                  className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-4.5 h-4.5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[13px] font-semibold text-foreground leading-snug">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-muted-foreground">
                      {activity.time}
                    </span>
                    {activity.target && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span className="text-[11px] font-medium text-primary hover:underline cursor-pointer truncate">
                          {activity.target}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardCard>
  );
}
