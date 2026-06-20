"use client";

import React from "react";
import { Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export function DashboardOverviewHeader({
  userName = "User",
  plan = "Free",
  remainingCredits = 0,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, {userName || "User"} 👋
        </h1>
        <p className="text-muted-foreground mt-1.5 max-w-xl">
          Create, manage, preview, and publish your AI-powered websites from
          your personalized workspace.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm self-start md:self-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
              Plan
            </span>
            <span className="site-badge-emerald text-[11px] py-0 px-2 h-5 inline-flex items-center">
              {plan}
            </span>
          </div>
          <div className="w-px h-8 bg-border mx-1" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
              Credits
            </span>
            <span className="flex items-center gap-1 text-sm font-bold text-foreground">
              <Sparkles className="w-3 h-3 text-primary" />
              {remainingCredits}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/generate"
          className="site-primary-button px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 h-11"
        >
          <Sparkles className="w-4 h-4" />
          Generate Website
        </Link>
      </div>
    </div>
  );
}
