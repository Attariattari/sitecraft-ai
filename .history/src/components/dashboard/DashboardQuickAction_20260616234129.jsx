"use client";

import React from "react";
import { Sparkles, LayoutTemplate, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function DashboardQuickAction() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-accent/10 blur-[100px] rounded-full group-hover:bg-accent/20 transition-all duration-700" />

      <div className="relative bg-card/60 backdrop-blur-xl rounded-[22px] p-6 lg:p-10 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            New AI Engine v4.0
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
            Generate your next <br className="hidden lg:block" />
            <span className="site-gradient-text">website with AI</span>
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg max-w-xl mb-8 leading-relaxed">
            Answer a few questions and SiteCraft AI will create website content,
            structure, SEO details, theme direction, and a preview-ready layout
            in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/dashboard/generate"
              className="site-primary-button px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 w-full sm:w-auto min-w-[200px]"
            >
              <Sparkles className="w-5 h-5" />
              Generate Website
            </Link>
            <Link
              href="/dashboard/templates"
              className="site-secondary-button px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] hover:bg-muted"
            >
              <LayoutTemplate className="w-5 h-5 opacity-70" />
              Browse Templates
            </Link>
          </div>
        </div>

        <div className="hidden lg:block relative shrink-0">
          <div className="w-[320px] h-[380px] rounded-2.5xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-4 relative overflow-hidden backdrop-blur-sm shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-500">
            <div className="absolute inset-0 bg-secondary/30" />
            <div className="h-4 w-full bg-muted/50 rounded animate-pulse mb-4" />
            <div className="h-40 w-full bg-primary/10 rounded-xl mb-4 border border-primary/10 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary/30" />
            </div>
            <div className="space-y-3">
              <div className="h-3 w-3/4 bg-muted/50 rounded animate-pulse" />
              <div className="h-3 w-full bg-muted/50 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-muted/50 rounded animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 blur-xl animate-pulse" />
            </div>
          </div>

          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-md p-6 flex items-center justify-center shadow-xl rotate-[-12deg] group-hover:rotate-0 transition-transform duration-500">
            <div className="text-center">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none mb-2">
                Success
              </p>
              <p className="text-2xl font-black text-foreground">100%</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
