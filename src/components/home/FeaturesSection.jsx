"use client";

import { motion } from "framer-motion";
import {
  Wand2,
  Palette,
  Zap,
  Globe,
  ShieldCheck,
  LayoutTemplate,
  BrainCircuit,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Content Generation",
    description:
      "Describe your business in plain English. Our AI writes compelling copy, headlines, and CTAs tailored to your niche — automatically.",
    tone: "primary",
    wide: true,
  },
  {
    icon: Palette,
    title: "20+ Premium Themes",
    description:
      "Choose from 20 professionally curated themes, each with light and dark modes.",
    tone: "accent",
    wide: false,
  },
  {
    icon: Wand2,
    title: "One-Click Publish",
    description:
      "From idea to live website in under 2 minutes. Hosting, domain, and SSL — all handled.",
    tone: "primary",
    wide: false,
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description:
      "Every site is pixel-perfect on mobile, tablet, and desktop — no extra effort required.",
    tone: "accent",
    wide: true,
  },
  {
    icon: LayoutTemplate,
    title: "Smart Layouts",
    description:
      "AI picks the optimal section structure for your site type — portfolio, SaaS, restaurant, and more.",
    tone: "primary",
    wide: false,
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Static-first architecture delivers sub-second load times and top Core Web Vitals scores.",
    tone: "accent",
    wide: false,
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description:
      "Connect your own domain or use a free sitecraft.ai subdomain. Propagation in minutes.",
    tone: "primary",
    wide: false,
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "SSL by default, data encryption at rest, SOC 2 compliant infrastructure, and automated backups.",
    tone: "accent",
    wide: true,
  },
];

const featureTones = {
  primary: {
    color: "var(--primary)",
    soft: "var(--primary-soft)",
    glow: "color-mix(in srgb, var(--primary) 10%, transparent)",
    line: "color-mix(in srgb, var(--primary) 38%, transparent)",
  },
  accent: {
    color: "var(--accent)",
    soft: "var(--accent-soft)",
    glow: "color-mix(in srgb, var(--accent) 10%, transparent)",
    line: "color-mix(in srgb, var(--accent) 38%, transparent)",
  },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeaturesSection() {
  return (
    <section className="py-28 relative" id="features">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="site-badge-emerald mb-5">Platform Features</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            Everything you need,{" "}
            <span className="site-gradient-text">nothing you don&apos;t</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            SiteCraft AI bundles an entire web agency into one platform.
            Powerful for pros, effortless for beginners.
          </p>
        </motion.div>

        {/* Feature grid — masonry-style */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const tone = featureTones[feature.tone] || featureTones.primary;
            return (
              <motion.div
                key={i}
                variants={item}
                className={`group relative flex flex-col gap-5 p-8 md:p-10 rounded-3xl border border-border/60 bg-card hover:border-opacity-100 overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20
                  ${feature.wide ? "md:col-span-2" : "md:col-span-1"}`}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${tone.glow}, transparent 60%)`,
                  }}
                />

                {/* Top accent line */}
                <div
                  className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${tone.line}, transparent)`,
                  }}
                />

                <div
                  className="size-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10"
                  style={{
                    background: tone.soft,
                    color: tone.color,
                  }}
                >
                  <Icon className="size-6" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                    {feature.description}
                  </p>
                </div>

                {/* Corner badge for large cards */}
                {feature.wide && (
                  <div
                    className="absolute bottom-6 right-6 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: tone.soft,
                      color: tone.color,
                    }}
                  >
                    Key Feature
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
