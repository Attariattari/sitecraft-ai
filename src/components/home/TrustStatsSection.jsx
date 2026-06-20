"use client";

import { motion } from "framer-motion";
import { Sparkles, Palette, Zap, LayoutTemplate, Orbit } from "lucide-react";

const stats = [
  { value: "AI-Powered", label: "Generation", icon: Sparkles },
  { value: "20+", label: "Theme Presets", icon: Palette },
  { value: "Ready", label: "Portfolio MVP", icon: LayoutTemplate },
  { value: "SEO", label: "Friendly Output", icon: Orbit },
  { value: "Live", label: "Preview Flow", icon: Zap },
];

export function TrustStatsSection() {
  return (
    <section className="py-10 border-y border-border/40 bg-secondary/20 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 max-w-5xl mx-auto">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
                  <Icon className="size-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-black text-foreground tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
