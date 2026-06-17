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
    gradient: "from-muted to-transparent",
    iconBg: "bg-secondary text-muted-foreground",
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
    gradient: "from-muted to-transparent",
    iconBg: "bg-secondary text-muted-foreground",
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
    gradient: "from-muted to-transparent",
    iconBg: "bg-secondary text-muted-foreground",
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
    gradient: "from-muted to-transparent",
    iconBg: "bg-secondary text-muted-foreground",
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
    gradient: "from-muted to-transparent",
    iconBg: "bg-secondary text-muted-foreground",
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
    gradient: "from-muted to-transparent",
    iconBg: "bg-secondary text-muted-foreground",
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
    gradient: "from-muted to-transparent",
    iconBg: "bg-secondary text-muted-foreground",
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
    <section className="py-28 site-bg-premium" id="categories">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="site-badge-emerald mb-5">Website Categories</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            Built for every industry,{" "}
            <span className="site-gradient-text font-black">every goal</span>
          </h2>
          <p className="text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed">
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
                className={`group relative flex flex-col gap-6 p-8 rounded-[2rem] border transition-all duration-300 cursor-default
                  ${
                    cat.available
                      ? "site-glass-card hover:scale-[1.02]"
                      : "border-border opacity-70 bg-secondary/50 grayscale-[0.5]"
                  }`}
              >
                {/* Lock overlay for unavailable */}
                {!cat.available && (
                  <div className="absolute top-4 right-4 size-8 rounded-full site-glass-card flex items-center justify-center z-10 scale-75 opacity-50">
                    <Lock className="size-4 text-foreground" />
                  </div>
                )}

                {/* Badge */}
                <div className="flex flex-col items-start gap-4">
                  <div
                    className={`size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${cat.iconBg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10`}
                  >
                    <Icon className="size-7" />
                  </div>
                  <span
                    className={`${cat.available ? "site-badge-emerald" : "site-badge-orange opacity-60"} !text-[9px] !px-2 !py-0.5`}
                  >
                    {cat.badge}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-secondary-foreground leading-relaxed mb-6 flex-1">
                    {cat.description}
                  </p>

                  {/* Theme pills */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/10">
                    {cat.themes.map((theme, j) => (
                      <span
                        key={j}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-secondary/30 text-muted-foreground font-bold tracking-tight"
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
