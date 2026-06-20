"use client";

import React from "react";
import { Sparkles, LayoutTemplate, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function DashboardQuickAction() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 via-card to-accent/8 p-1 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-primary/15 blur-[120px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-accent/10 blur-[120px] rounded-full group-hover:bg-accent/15 transition-all duration-700" />

      <div className="relative bg-card/85 backdrop-blur-xl rounded-[26px] p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/12 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider mb-6 mb-7">
            <Sparkles className="w-4 h-4" />
            Advanced AI Engine v4.0
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-6 leading-tight">
            Generate your next <br className="hidden lg:block" />
            <span className="site-gradient-text">website with AI</span>
          </h2>
          <p className="text-lg text-muted-foreground lg:text-xl max-w-2xl mb-9 leading-relaxed font-medium">
            Answer a few questions and SiteCraft AI will create website content,
            structure, SEO details, theme direction, and a preview-ready layout
            in seconds. No coding required.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/dashboard/generate"
              className="site-primary-button px-9 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 w-full sm:w-auto min-w-[260px] shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Generate Website Now
            </Link>
            <Link
              href="/dashboard/templates"
              className="site-secondary-button px-9 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2.5 w-full sm:w-auto min-w-[260px] hover:bg-muted transition-all border border-border shadow-sm hover:shadow-md"
            >
              <LayoutTemplate className="w-5 h-5 opacity-80" />
              Browse Templates
            </Link>
          </div>
        </div>

        <div className="hidden lg:block relative shrink-0">
          <div className="w-80 h-96 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/12 to-transparent p-6 relative overflow-hidden backdrop-blur-sm shadow-2xl rotate-2 group-hover:rotate-1 transition-transform duration-500">
            <div className="absolute inset-0 bg-secondary/30" />
            <div className="h-5 w-full bg-muted/60 rounded-lg animate-pulse mb-5" />
            <div className="h-48 w-full bg-primary/15 rounded-2xl mb-5 border border-primary/15 flex items-center justify-center overflow-hidden">
              <Sparkles className="w-16 h-16 text-primary/30 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-3 w-3/4 bg-muted/60 rounded-lg animate-pulse" />
              <div className="h-3 w-full bg-muted/60 rounded-lg animate-pulse" />
              <div className="h-3 w-5/6 bg-muted/60 rounded-lg animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-6">
              <div className="w-24 h-24 rounded-full bg-primary/25 blur-2xl animate-pulse" />
            </div>
          </div>

          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full border border-accent/25 bg-accent/8 backdrop-blur-md p-8 flex items-center justify-center shadow-2xl rotate-[-12deg] group-hover:rotate-[-8deg] transition-transform duration-500">
            <div className="text-center">
              <p className="text-xs font-bold text-accent uppercase tracking-widest leading-none mb-3">
                Success Rate
              </p>
              <p className="text-4xl font-black text-foreground">100%</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
