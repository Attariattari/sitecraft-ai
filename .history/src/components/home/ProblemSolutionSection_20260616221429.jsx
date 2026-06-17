"use client";

import { motion } from "framer-motion";
import {
  XCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Palette,
  Search,
  Zap,
  Layout,
  ArrowRight,
} from "lucide-react";

const problems = [
  { icon: Layout, text: "Website builders are too complex" },
  { icon: DollarSign, text: "Hiring designers costs thousands" },
  { icon: AlertCircle, text: "Writing copy wastes hours" },
  { icon: Palette, text: "Choosing colors & themes is confusing" },
  { icon: Search, text: "SEO setup is always overlooked" },
  { icon: Clock, text: "Months pass before anything launches" },
];

const solutions = [
  { icon: Zap, text: "AI generates all website content instantly" },
  { icon: Layout, text: "Smart template recommendation by niche" },
  { icon: Palette, text: "AI selects & applies perfect theme colors" },
  { icon: Search, text: "Automatic SEO optimization built-in" },
  { icon: CheckCircle2, text: "Live preview before you publish" },
  { icon: Clock, text: "From zero to live website in under 2 minutes" },
];

export function ProblemSolutionSection() {
  return (
    <section className="py-28 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5 leading-tight">
            The old way is{" "}
            <span className="relative">
              <span className="site-gradient-text">broken</span>
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-primary/40 to-transparent rounded-full" />
            </span>
            . We fixed it.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            SiteCraft AI replaces the painful, expensive, slow process of
            building a website with a single, intelligent prompt.
          </p>
        </motion.div>

        {/* Two-column comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 md:p-10 rounded-3xl bg-secondary/40 border border-border/60 overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 opacity-[0.04]">
              <XCircle className="size-52 text-foreground" />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
                <XCircle className="size-5 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-black text-foreground">
                The Old Way
              </h3>
            </div>
            <ul className="space-y-4">
              {problems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="flex items-center gap-4"
                  >
                    <div className="size-9 rounded-xl border border-border/60 bg-background/60 flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-muted-foreground/50" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground line-through decoration-1 decoration-muted-foreground/40">
                      {item.text}
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-8 p-5 rounded-2xl bg-border/40 text-xs font-bold text-muted-foreground/60">
              ⏱ Average time: 3–8 weeks &nbsp;·&nbsp; 💸 Average cost:
              $2,000–$10,000
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 md:p-10 rounded-3xl bg-foreground border border-primary/40 overflow-hidden shadow-2xl shadow-black/20"
          >
            {/* Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-60 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <CheckCircle2 className="size-52 text-primary" />
            </div>

            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="size-10 rounded-2xl site-primary-button flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap className="size-5" />
              </div>
              <h3 className="text-lg font-black text-white">
                The SiteCraft Way
              </h3>
            </div>

            <ul className="space-y-4 relative z-10">
              {solutions.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="flex items-center gap-4"
                  >
                    <div className="size-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-primary" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-slate-200">
                      {item.text}
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            <div className="relative z-10 mt-8 p-5 rounded-2xl bg-white/[0.06] border border-white/10">
              <p className="text-xs font-bold text-primary/90 leading-relaxed">
                ⚡ SiteCraft AI: From idea to live website in under 2 minutes.
                For free.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bridge arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
          >
            See how it works{" "}
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
