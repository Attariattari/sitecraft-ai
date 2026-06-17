"use client";

import React from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DashboardCard } from "./DashboardCard";

export function DashboardChecklist({ items = [] }) {
  const completedCount = items.filter((i) => i.completed).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <DashboardCard className="h-full flex flex-col p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Getting Started</h3>
        <span className="text-xs font-bold text-primary bg-primary/12 px-3.5 py-1.5 rounded-lg border border-primary/20">
          {completedCount}/{items.length}
        </span>
      </div>

      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto pr-2">
        {items.map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group ${
              item.completed
                ? "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                : "hover:bg-muted"
            }`}
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold truncate ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
              >
                {item.title}
              </p>
            </div>

            {!item.completed && (
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
            )}
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
