"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, CreditCard, Layout } from "lucide-react";

export function GenerateLivePreview({ formData }) {
  const { fullName, profession, bio, themeKey, colorMode } = formData;

  return (
    <div className="sticky top-10 w-full lg:max-w-md hidden lg:block">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Live Evolution Preview
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-400/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20 border border-yellow-400/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/20 border border-green-400/40" />
        </div>
      </div>

      <div className="relative group">
        {/* Browser Frame */}
        <div className="site-glass-card rounded-2xl overflow-hidden border-border/40 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
          <div className="h-6 bg-muted/30 border-b border-border/30 flex items-center px-4">
            <div className="w-24 h-1.5 bg-muted/60 rounded-full" />
          </div>

          <div className="p-6 min-h-[400px] bg-background relative overflow-hidden">
            {/* Mock Nav */}
            <div className="flex items-center justify-between mb-12">
              <div className="w-8 h-8 rounded-lg bg-primary/20 animate-pulse" />
              <div className="flex gap-2">
                <div className="w-10 h-2 bg-muted/40 rounded-full" />
                <div className="w-10 h-2 bg-muted/40 rounded-full" />
              </div>
            </div>

            {/* Mock Content */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={fullName || "empty"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="h-3 w-20 bg-primary/10 rounded-full" />
                  <h2 className="text-2xl font-black text-foreground max-w-[200px] leading-tight">
                    {fullName || "Your Name"}
                  </h2>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {profession || "Your Profession"}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="space-y-2">
                <div className="h-2 w-full bg-muted/30 rounded-full" />
                <div className="h-2 w-[80%] bg-muted/30 rounded-full" />
                <div className="h-2 w-[90%] bg-muted/30 rounded-full" />
              </div>

              <div className="flex gap-2 mt-8">
                <div className="w-20 h-7 rounded-lg bg-primary shadow-lg shadow-primary/20" />
                <div className="w-20 h-7 rounded-lg border border-border bg-muted/20" />
              </div>
            </div>

            {/* Decorative UI elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute top-1/2 right-4 w-12 h-12 rounded-xl border border-primary/20 rotate-12 flex items-center justify-center bg-background/50 backdrop-blur-md">
              <Layout className="w-5 h-5 text-primary/40" />
            </div>
          </div>
        </div>

        {/* Floating Indicator */}
        <div className="absolute -left-6 bottom-10 p-3 site-glass-card rounded-xl border-primary/20 shadow-xl animate-bounce">
          <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["Modern", "SEO Optmized", themeKey || "Emerald"].map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-muted/50 rounded-lg text-[9px] font-black uppercase text-muted-foreground border border-border/30"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
