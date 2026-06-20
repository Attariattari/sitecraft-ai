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
} from "lucide-react";

const categories = [
  {
    icon: Briefcase,
    name: "Portfolio",
    description:
      "Showcase your work, skills, and experience with a stunning personal or agency portfolio.",
    themes: ["Minimal Black", "Premium Purple", "Clean Mint"],
    available: true,
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15 text-primary",
    badge: "Available Now",
    badgeClass: "bg-primary/15 text-primary border-primary/30",
  },
  {
    icon: Store,
    name: "E-Commerce",
    description:
      "Sell products online with a high-converting storefront powered by AI copy.",
    themes: ["Startup Coral", "Fashion Rose", "Warm Business"],
    available: false,
    gradient: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/15 text-accent",
    badge: "Coming Soon",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  {
    icon: Stethoscope,
    name: "Health & Medical",
    description:
      "Professional sites for clinics, practitioners, and wellness brands.",
    themes: ["Medical Clean", "Nature Organic"],
    available: false,
    gradient: "from-blue-500/15 to-blue-500/5",
    iconBg: "bg-blue-500/15 text-blue-500",
    badge: "Coming Soon",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  {
    icon: GraduationCap,
    name: "Education",
    description:
      "Courses, academies, and schools with structured layouts that drive enrollment.",
    themes: ["Education Calm", "Royal Blue"],
    available: false,
    gradient: "from-violet-500/15 to-violet-500/5",
    iconBg: "bg-violet-500/15 text-violet-500",
    badge: "Coming Soon",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  {
    icon: Building2,
    name: "Corporate / SaaS",
    description:
      "Enterprise-grade landing pages and SaaS sites that convert visitors to leads.",
    themes: ["Modern Dark", "Tech Neon", "Corporate Slate"],
    available: false,
    gradient: "from-slate-500/15 to-slate-500/5",
    iconBg: "bg-slate-500/15 text-slate-500",
    badge: "Coming Soon",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  {
    icon: UtensilsCrossed,
    name: "Restaurant & Food",
    description:
      "Mouth-watering websites for restaurants, cafes, bakeries, and food trucks.",
    themes: ["Restaurant Warm", "Warm Business"],
    available: false,
    gradient: "from-orange-500/15 to-orange-500/5",
    iconBg: "bg-orange-500/15 text-orange-500",
    badge: "Coming Soon",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  {
    icon: ShoppingBag,
    name: "Fashion & Beauty",
    description:
      "Elegant, editorial-style sites for fashion brands and beauty professionals.",
    themes: ["Fashion Rose", "Creative Studio"],
    available: false,
    gradient: "from-pink-500/15 to-pink-500/5",
    iconBg: "bg-pink-500/15 text-pink-500",
    badge: "Coming Soon",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  {
    icon: Landmark,
    name: "Finance & Legal",
    description:
      "Authoritative, trust-building sites for financial advisors and law firms.",
    themes: ["Finance Emerald", "Corporate Slate"],
    available: false,
    gradient: "from-emerald-600/15 to-emerald-600/5",
    iconBg: "bg-emerald-600/15 text-emerald-700",
    badge: "Coming Soon",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export function CategoriesSection() {
  return (
    <section className="py-28 bg-soft" id="categories">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-5">
            Website Categories
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            Built for every industry,{" "}
            <span className="text-primary">every goal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SiteCraft AI launches with Portfolio support — and we're rapidly
            expanding to cover every niche and industry.
          </p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className={`group relative flex flex-col gap-5 p-7 rounded-3xl border bg-background overflow-hidden transition-all duration-300 cursor-default
                  ${
                    cat.available
                      ? "border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]"
                      : "border-border opacity-70 hover:opacity-90"
                  }`}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                {/* Lock overlay for unavailable */}
                {!cat.available && (
                  <div className="absolute top-4 right-4 size-7 rounded-full bg-muted flex items-center justify-center z-10">
                    <Lock className="size-3.5 text-muted-foreground" />
                  </div>
                )}

                {/* Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${cat.iconBg} group-hover:scale-110 transition-transform duration-300 relative z-10`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cat.badgeClass} shrink-0 relative z-10`}
                  >
                    {cat.badge}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Theme pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {cat.themes.map((theme, j) => (
                      <span
                        key={j}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-soft border border-border text-muted-foreground font-medium"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
