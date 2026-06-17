"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Wand2,
  Palette,
  Globe,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe Your Vision",
    description:
      "Tell us about your business, target audience, and goals in plain language. The more detail you give, the better your site becomes.",
    detail: "Works with any niche — from freelancers to enterprise SaaS",
    color: "primary",
  },
  {
    number: "02",
    icon: Palette,
    title: "Pick Your Theme",
    description:
      "Browse 20+ hand-crafted theme presets. Each has light and dark variants, and can be customized to match your exact brand colors.",
    detail: "Live preview before you commit — switch anytime",
    color: "accent",
  },
  {
    number: "03",
    icon: Wand2,
    title: "AI Generates Your Site",
    description:
      "Our AI engine writes your headlines, body copy, feature lists, and CTAs — then assembles them into a pixel-perfect layout.",
    detail: "Powered by the latest large language models",
    color: "primary",
  },
  {
    number: "04",
    icon: Globe,
    title: "Publish & Go Live",
    description:
      "Hit publish and your site is live in seconds. Connect a custom domain or use your free sitecraft.ai subdomain to start getting traffic.",
    detail: "Free SSL certificate included on every plan",
    color: "accent",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-28 site-bg-premium" id="how-it-works">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="site-badge-orange mb-5">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            From idea to live in{" "}
            <span className="site-gradient-text font-black">4 steps</span>
          </h2>
          <p className="text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed">
            No complex setup, no learning curve. Our AI handles the heavy
            lifting so you can focus on growing your business.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-accent/30 to-transparent hidden md:block -translate-x-1/2" />

          <div className="flex flex-col gap-12 md:gap-20">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isPrimary = step.color === "primary";
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-14 ${
                    !isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step icon — center on desktop */}
                  <div className="md:absolute md:left-1/2 md:-translate-x-1/2 shrink-0 z-10">
                    <div
                      className={`size-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-500 hover:rotate-12
                        ${
                          isPrimary
                            ? "site-primary-button"
                            : "bg-accent text-accent-foreground shadow-accent/30"
                        }`}
                    >
                      <Icon className="size-10" />
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`flex-1 ${isEven ? "md:pr-[calc(50%+4rem)]" : "md:pl-[calc(50%+4rem)]"}`}
                  >
                    <div className="group relative site-glass-card rounded-[2.5rem] p-10 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`text-6xl font-black tracking-tighter leading-none select-none ${
                            isPrimary ? "text-primary/10" : "text-accent/10"
                          }`}
                        >
                          {step.number}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground relative z-10">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-muted-foreground leading-relaxed mb-4 relative z-10">
                        {step.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-primary font-medium relative z-10">
                        <CheckCircle2 className="size-4 shrink-0" />
                        {step.detail}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
