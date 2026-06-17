"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Store,
  Stethoscope,
  GraduationCap,
  Building2,
  UtensilsCrossed,
  ShoppingBag,
  Landmark,
  Lock,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    icon: Briefcase,
    name: "Portfolio",
    description:
      "Showcase your work, skills, and experience with a stunning personal or agency portfolio.",
    themes: ["Minimal Black", "Premium Purple", "Clean Mint"],
    available: true,
    color: "#10B981",
    badge: "Live Now",
  },
  {
    icon: Store,
    name: "E-Commerce",
    description:
      "Sell products online with a high-converting storefront powered by AI copy.",
    themes: ["Startup Coral", "Fashion Rose", "Warm Business"],
    available: false,
    color: "#94A3B8",
    badge: "Coming Soon",
  },
  {
    icon: Stethoscope,
    name: "Health & Medical",
    description:
      "Professional sites for clinics, practitioners, and wellness brands.",
    themes: ["Medical Clean", "Nature Organic"],
    available: false,
    color: "#94A3B8",
    badge: "Coming Soon",
  },
  {
    icon: GraduationCap,
    name: "Education",
    description:
      "Courses, academies, and schools with structured layouts that drive enrollment.",
    themes: ["Education Calm", "Royal Blue"],
    available: false,
    color: "#94A3B8",
    badge: "Coming Soon",
  },
  {
    icon: Building2,
    name: "Corporate / SaaS",
    description:
      "Enterprise-grade landing pages and SaaS sites that convert visitors to leads.",
    themes: ["Modern Dark", "Tech Neon", "Corporate Slate"],
    available: false,
    color: "#94A3B8",
    badge: "Coming Soon",
  },
  {
    icon: UtensilsCrossed,
    name: "Restaurant & Food",
    description:
      "Mouth-watering websites for restaurants, cafes, bakeries, and food trucks.",
    themes: ["Restaurant Warm", "Warm Business"],
    available: false,
    color: "#94A3B8",
    badge: "Coming Soon",
  },
  {
    icon: ShoppingBag,
    name: "Fashion & Beauty",
    description:
      "Elegant, editorial-style sites for fashion brands and beauty professionals.",
    themes: ["Fashion Rose", "Creative Studio"],
    available: false,
    color: "#94A3B8",
    badge: "Coming Soon",
  },
  {
    icon: Landmark,
    name: "Finance & Legal",
    description:
      "Authoritative, trust-building sites for financial advisors and law firms.",
    themes: ["Finance Emerald", "Corporate Slate"],
    available: false,
    color: "#94A3B8",
    badge: "Coming Soon",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export function CategoriesSection() {
  return (
    <section className="py-28 relative" id="categories">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-32 top-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl" />
        <div className="absolute -right-32 bottom-1/3 w-96 h-96 bg-accent/4 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="site-badge-emerald mb-5">Website Categories</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            Built for every industry,{" "}
            <span className="site-gradient-text">every goal</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            Starting with Portfolio — with 7 more categories launching soon.
            Build your niche website before your competitors do.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={i}
                variants={card}
                className={`group relative flex flex-col gap-5 p-7 rounded-3xl border transition-all duration-300 cursor-default
                  ${
                    cat.available
                      ? "site-glass-card hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/8 hover:border-primary/30"
                      : "border-border/40 bg-secondary/20 opacity-60 grayscale-[0.6]"
                  }`}
              >
                {/* Lock for unavailable */}
                {!cat.available && (
                  <div className="absolute top-4 right-4 size-7 rounded-lg bg-secondary/60 border border-border/50 flex items-center justify-center">
                    <Lock className="size-3.5 text-muted-foreground/50" />
                  </div>
                )}

                {/* Icon + Badge */}
                <div className="flex items-start justify-between">
                  <div
                    className="size-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={
                      cat.available
                        ? { background: "#10B98118", color: "#10B981" }
                        : {
                            background: "var(--secondary)",
                            color: "var(--muted-foreground)",
                          }
                    }
                  >
                    <Icon className="size-6" />
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl ${
                      cat.available
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground/50"
                    }`}
                  >
                    {cat.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {cat.description}
                  </p>
                </div>

                {/* Theme pills */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/20">
                  {cat.themes.map((theme, j) => (
                    <span
                      key={j}
                      className="text-[9px] px-2.5 py-1 rounded-lg bg-secondary/60 text-muted-foreground font-bold tracking-tight"
                    >
                      {theme}
                    </span>
                  ))}
                </div>

                {/* Available card CTA hint */}
                {cat.available && (
                  <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">
                    Start building <ArrowRight className="size-3" />
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
