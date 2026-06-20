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
    <section className="py-24 bg-background overflow-hidden">
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
            <span className="text-primary underline decoration-primary/30 underline-offset-8">
              website manually
            </span>
            .
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            SiteCraft AI turns your information into a professional website
            structure, content, SEO plan, template direction, and live preview
            in minutes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Leftside: Problems */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-10 rounded-[2.5rem] bg-secondary/5 border border-border/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <XCircle className="size-48 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="size-10 rounded-xl bg-muted/20 flex items-center justify-center">
                <HelpCircle className="size-5 text-muted-foreground" />
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
                    className="flex items-center gap-4 text-muted-foreground"
                  >
                    <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                      <Icon className="size-5 opacity-40" />
                    </div>
                    <span className="font-medium">{item.text}</span>
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
            className="p-8 md:p-10 rounded-[2.5rem] bg-primary/10 border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CheckCircle2 className="size-48 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap className="size-5" />
              </div>
              The SiteCraft Solution
            </h3>
            <ul className="space-y-6">
              {solutions.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-center gap-4 text-foreground"
                  >
                    <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md">
                      <Icon className="size-5" />
                    </div>
                    <span className="font-bold">{item.text}</span>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-10 p-6 rounded-2xl bg-background/50 border border-primary/10 backdrop-blur-sm">
              <p className="text-sm font-medium text-primary">
                "Our AI engine replaces 4 tools and 3 freelancers, saving you
                hours of trial and error."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
