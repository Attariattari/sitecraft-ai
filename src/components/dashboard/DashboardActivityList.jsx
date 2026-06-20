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
  generate: { icon: Sparkles, color: "text-primary", bg: "bg-primary/12" },
  publish: { icon: Share2, color: "text-blue-500", bg: "bg-blue-500/12" },
  update: { icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/12" },
  theme: { icon: Palette, color: "text-purple-500", bg: "bg-purple-500/12" },
  seo: { icon: Search, color: "text-orange-500", bg: "bg-orange-500/12" },
};

export function DashboardActivityList({ activities = [] }) {
  return (
    <DashboardCard className="h-full flex flex-col p-7">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2.5">
          <History className="w-5 h-5 text-muted-foreground" />
          Recent Activity
        </h3>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="w-10 h-10 text-muted-foreground/25 mb-3" />
            <p className="text-sm text-muted-foreground">
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
                  <div className="absolute left-[22px] top-10 bottom-[-24px] w-0.5 bg-border/50" />
                )}

                <div
                  className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-bold text-foreground leading-snug">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground font-medium">
                      {activity.time}
                    </span>
                    {activity.target && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span className="text-xs font-semibold text-primary hover:underline cursor-pointer truncate">
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
