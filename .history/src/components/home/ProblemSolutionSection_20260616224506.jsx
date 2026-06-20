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
  Globe,
  ArrowRight,
  PenTool,
  FileText,
} from "lucide-react";

const problems = [
  { icon: DollarSign, text: "Expensive designers" },
  { icon: Layout, text: "Complicated builders" },
  { icon: Clock, text: "Slow development" },
  { icon: PenTool, text: "Difficult content writing" },
  { icon: Palette, text: "Confusing themes" },
  { icon: AlertCircle, text: "Weak SEO setup" },
];

const solutions = [
  { icon: FileText, text: "AI writes website content" },
  { icon: Layout, text: "AI recommends layout" },
  { icon: Palette, text: "AI suggests themes" },
  { icon: Search, text: "AI creates SEO structure" },
  { icon: Zap, text: "Preview before publishing" },
  { icon: Globe, text: "Publish with public URL" },
];

export function ProblemSolutionSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Stop struggling with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 mt-2 inline-block">
              outdated builders
            </span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            We replaced the complex, time-consuming process of traditional web
            dev with a single AI prompt.
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left: Problems */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 md:p-10 rounded-[2rem] bg-secondary/30 border border-border/50 relative overflow-hidden shadow-lg"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-2xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                <XCircle className="size-6 text-orange-500/70" />
              </div>
              <h3 className="text-xl font-bold text-foreground">The Old Way</h3>
            </div>

            <ul className="space-y-5">
              {problems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    <div className="size-10 rounded-xl bg-background/50 border border-border/40 flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground line-through decoration-muted-foreground/30">
                      {item.text}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Right: Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 20, rotate: 1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 md:p-10 rounded-[2rem] bg-foreground relative overflow-hidden shadow-2xl shadow-emerald-500/10 border border-emerald-500/20"
          >
            {/* Glows */}
            <div className="absolute -top-24 right-0 size-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 left-0 size-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="size-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="size-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-background dark:text-foreground">
                SiteCraft AI
              </h3>
            </div>

            <ul className="space-y-5 relative z-10">
              {solutions.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <Icon
                        className="size-4 text-emerald-500"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="text-sm font-bold text-background dark:text-foreground">
                      {item.text}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
