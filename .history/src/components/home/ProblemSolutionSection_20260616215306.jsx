"use client";

import { motion } from "framer-motion";
import {
  XCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  DollarSign,
  Palette,
  Search,
  Zap,
  Layout,
} from "lucide-react";

const problems = [
  {
    icon: Layout,
    text: "Website builders feel complicated",
  },
  {
    icon: DollarSign,
    text: "Hiring designers is expensive",
  },
  {
    icon: AlertCircle,
    text: "Writing website content is difficult",
  },
  {
    icon: Palette,
    text: "Choosing templates and colors is confusing",
  },
  {
    icon: Search,
    text: "SEO setup is often ignored",
  },
  {
    icon: Clock,
    text: "Publishing takes too much time",
  },
];

const solutions = [
  {
    icon: Zap,
    text: "AI generates website content",
  },
  {
    icon: Layout,
    text: "AI recommends template",
  },
  {
    icon: Palette,
    text: "AI recommends theme",
  },
  {
    icon: Search,
    text: "SEO content is generated automatically",
  },
  {
    icon: Clock,
    text: "Live preview before publishing",
  },
  {
    icon: CheckCircle2,
    text: "Public website route after publishing",
  },
];

export function ProblemSolutionSection() {
  return (
    <section className="py-24 site-bg-premium overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6"
          >
            Stop spending weeks building a{" "}
            <span className="site-gradient-text underline decoration-primary/20 underline-offset-8">
              website manually
            </span>
            .
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-secondary-foreground leading-relaxed"
          >
            SiteCraft AI turns your information into a professional website
            structure, content, SEO plan, template direction, and live preview
            in minutes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Leftside: Problems */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-10 rounded-[2.5rem] bg-secondary/50 border border-border/50 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 opacity-[0.03]">
              <XCircle className="size-64 text-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm">
                <HelpCircle className="size-6 text-muted-foreground" />
              </div>
              The Challenge
            </h3>
            <ul className="space-y-6">
              {problems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-center gap-4 text-secondary-foreground"
                  >
                    <div className="size-10 rounded-xl bg-white dark:bg-white/5 border border-border/50 flex items-center justify-center shrink-0 shadow-sm">
                      <Icon className="size-5 opacity-40" />
                    </div>
                    <span className="font-semibold text-base">{item.text}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Rightside: Solution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-10 rounded-[2.5rem] bg-foreground border border-primary shadow-premium-dark relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 opacity-10">
              <CheckCircle2 className="size-64 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4 relative z-10">
              <div className="size-12 rounded-2xl site-primary-button flex items-center justify-center">
                <Zap className="size-6" />
              </div>
              The AI Solution
            </h3>
            <ul className="space-y-6 relative z-10">
              {solutions.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-center gap-4 text-slate-100"
                  >
                    <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <Icon className="size-5" strokeWidth={3} />
                    </div>
                    <span className="font-bold text-base">{item.text}</span>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative z-10">
              <p className="text-sm font-bold text-primary leading-relaxed">
                "Our AI engine replaces 4 tools and 3 freelancers, saving you
                weeks of development and thousands in costs."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
