"use client";

import React from "react";
import { Sparkles, Zap, ShieldCheck, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export function GeneratePageHeader() {
  return (
    <div className="relative mb-10">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3" />
            AI-Powered Engine
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-4 leading-tight">
            Generate Your Website{" "}
            <span className="site-gradient-text">With AI</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed text-sm lg:text-base">
            Tell SiteCraft AI about your work, goals, style, and content. Our
            engine will create a professional website structure, SEO content,
            and preview-ready layout in seconds.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge icon={ShieldCheck} label="AI Content" />
          <Badge icon={Zap} label="SEO Ready" />
          <Badge icon={Rocket} label="Live Preview" />
        </div>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 text-[11px] font-bold text-muted-foreground whitespace-nowrap">
      <Icon className="w-3.5 h-3.5 text-primary" />
      {label}
    </div>
  );
}
