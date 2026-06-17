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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
      <div className="flex-1">
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/12 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Welcome to SiteCraft AI
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-5 leading-tight">
          Welcome back, <span className="site-gradient-text">{userName || "User"}</span> 👋
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed font-medium">
          Create, manage, preview, and publish your AI-powered websites from
          your personalized workspace. Explore your projects, track performance, and generate new sites with a single click.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 px-6 py-4 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 to-transparent backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/25 transition-all">
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-2">
              Current Plan
            </span>
            <span className="site-badge-emerald text-xs py-1.5 px-3 h-auto inline-flex items-center font-semibold">
              {plan}
            </span>
          </div>
          <div className="w-px h-14 bg-border hidden sm:block" />
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-2">
              AI Credits
            </span>
            <span className="flex items-center gap-2.5 text-xl font-black text-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              {remainingCredits}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/generate"
          className="site-primary-button px-8 py-4 rounded-2xl text-base font-bold inline-flex items-center justify-center gap-3 h-auto shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate Website</span>
        </Link>
      </div>
    </div>
  );
}
