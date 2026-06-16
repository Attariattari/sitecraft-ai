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
      "Describe your business in plain English. Our AI writes compelling copy, headlines, and CTAs tailored to your niche automatically.",
    color: "primary",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Palette,
    title: "20+ Premium Themes",
    description:
      "Choose from 20 professionally curated themes — each with a light and dark mode variant — and switch instantly.",
    color: "accent",
    span: "col-span-1",
  },
  {
    icon: Wand2,
    title: "One-Click Publish",
    description:
      "Go from idea to live website in under 2 minutes. Hosting, domain, SSL — all handled for you.",
    color: "primary",
    span: "col-span-1",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description:
      "Every site is pixel-perfect on mobile, tablet, and desktop — no extra effort required.",
    color: "accent",
    span: "col-span-1",
  },
  {
    icon: LayoutTemplate,
    title: "Smart Layouts",
    description:
      "AI picks the optimal section structure for your site type — portfolio, SaaS, restaurant, and more.",
    color: "primary",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Static-first architecture delivers sub-second load times and top Core Web Vitals scores out of the box.",
    color: "accent",
    span: "col-span-1",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description:
      "Connect your own domain or use a free sitecraft.ai subdomain. Propagation happens in minutes.",
    color: "primary",
    span: "col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "SSL by default, data encryption at rest, SOC 2 compliant infrastructure, and automated backups.",
    color: "accent",
    span: "col-span-1",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeaturesSection() {
  return (
    <section className="py-28 bg-soft" id="features">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-5">
            Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            Everything you need,{" "}
            <span className="text-primary">nothing you don't</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SiteCraft AI bundles an entire web agency into a single platform.
            Powerful for pros, effortless for beginners.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const isPrimary = feature.color === "primary";
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className={`group relative flex flex-col gap-5 p-8 rounded-3xl border border-border bg-background overflow-hidden cursor-default
                  hover:border-${isPrimary ? "primary" : "accent"}/40
                  hover:shadow-xl transition-all duration-300`}
              >
                {/* Hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${isPrimary ? "primary" : "accent"}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div
                  className={`size-14 rounded-2xl flex items-center justify-center shrink-0
                    ${isPrimary ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}
                    group-hover:scale-110 transition-transform duration-300 relative z-10`}
                >
                  <Icon className="size-7" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
