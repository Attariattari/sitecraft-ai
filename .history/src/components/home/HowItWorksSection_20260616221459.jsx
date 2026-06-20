"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Wand2,
  Palette,
  Globe,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe Your Vision",
    description:
      "Tell us about your business, audience, and goals in plain English. The more detail you give, the more tailored your site becomes.",
    detail: "Works with any niche — from freelancers to enterprise SaaS",
    color: "#10B981",
  },
  {
    number: "02",
    icon: Palette,
    title: "Pick Your Theme",
    description:
      "Browse 20+ hand-crafted theme presets. Each has light and dark variants, and can be fine-tuned to match your exact brand identity.",
    detail: "Live preview before you commit — switch anytime",
    color: "#F97316",
  },
  {
    number: "03",
    icon: Wand2,
    title: "AI Builds Your Site",
    description:
      "Our AI engine writes your headlines, body copy, features, and CTAs — then assembles them into a pixel-perfect layout instantly.",
    detail: "Powered by the latest large language models",
    color: "#10B981",
  },
  {
    number: "04",
    icon: Globe,
    title: "Publish & Go Live",
    description:
      "Hit publish and your site is live in seconds. Connect a custom domain or use your free sitecraft.ai subdomain to start getting traffic.",
    detail: "Free SSL certificate included on every plan",
    color: "#F97316",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="py-28 bg-secondary/20 relative overflow-hidden"
      id="how-it-works"
    >
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="site-badge-orange mb-5">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            From idea to live in{" "}
            <span className="site-gradient-text">4 simple steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            No complex setup, no learning curve. Our AI handles everything so
            you can focus on growing your business.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-primary/30 via-accent/20 to-primary/10 hidden md:block" />

            <div className="flex flex-col gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: i * 0.1 }}
                    className="relative flex gap-6 md:gap-8 group"
                  >
                    {/* Icon node */}
                    <div className="relative shrink-0 flex items-start">
                      {/* Connector dot */}
                      <div
                        className="relative z-10 size-16 rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}22, ${step.color}0a)`,
                          border: `1.5px solid ${step.color}30`,
                        }}
                      >
                        <Icon
                          className="size-7"
                          style={{ color: step.color }}
                        />
                      </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 pb-6">
                      <div className="relative p-7 md:p-8 rounded-3xl site-glass-card group-hover:border-primary/30 transition-all duration-300 overflow-hidden">
                        {/* Big number watermark */}
                        <span
                          className="absolute -top-3 -right-2 text-8xl font-black tracking-tighter select-none leading-none opacity-[0.06]"
                          style={{ color: step.color }}
                        >
                          {step.number}
                        </span>

                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                              style={{
                                background: `${step.color}18`,
                                color: step.color,
                              }}
                            >
                              Step {step.number}
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-4 font-medium">
                            {step.description}
                          </p>
                          <div
                            className="flex items-center gap-2 text-sm font-bold"
                            style={{ color: step.color }}
                          >
                            <CheckCircle2 className="size-4 shrink-0" />
                            {step.detail}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CTA bridge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
            >
              Try it now — no account required
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
