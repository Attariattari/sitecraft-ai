"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Utensils,
  Stethoscope,
  Home,
  Users,
  GraduationCap,
  Globe,
  ShoppingCart,
  ArrowRight,
  Lock,
  Sparkles,
  Scissors,
  ShoppingBag,
  Layout,
} from "lucide-react";
import Link from "next/link";

const iconMap = {
  User: Briefcase,
  Briefcase: Briefcase,
  Scissors: Scissors,
  ShoppingBag: ShoppingBag,
  Utensils: Utensils,
  GraduationCap: GraduationCap,
  Building2: Building2,
  Stethoscope: Stethoscope,
  Layout: Layout,
  Home: Home,
  Globe: Globe,
  ShoppingCart: ShoppingBag,
  Users: Users,
};

export function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories/available?context=home");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch home categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Filter categories by showOnHome (should already be done by API but to be safe)
  const homeCategories = categories.filter((c) => c.showOnHome);
  const activeCategory =
    homeCategories.find((c) => c.isAvailable && !c.isLocked) || null;
  const comingSoon = homeCategories.filter((c) => c !== activeCategory);

  if (loading && categories.length === 0) {
    return (
      <div className="py-24 text-center">
        <Sparkles className="w-8 h-8 text-primary animate-pulse mx-auto" />
      </div>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background layer */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-30 dark:opacity-20 z-0">
        <div className="w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] absolute -top-[20%]" />
        <div className="w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] absolute -bottom-[10%] -right-[10%]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-5">
            Endless industry{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
              possibilities
            </span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            We're scaling our AI models across every industry, making
            professional website generation accessible to everyone.
          </p>
        </motion.div>

        {/* Highlight MVP vertically/horizontally */}
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto mb-12"
          >
            <div className="relative rounded-[2.5rem] bg-secondary/30 border border-emerald-500/30 dark:border-emerald-500/40 overflow-hidden shadow-2xl shadow-emerald-500/5 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
              {/* Left side info */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full mb-6 border border-emerald-500/20">
                  <Sparkles className="size-3.5" />
                  {activeCategory.badge || "Fully Active Platform"}
                </div>

                <h3 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                  {activeCategory.label} Websites
                </h3>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-8 max-w-xl">
                  {activeCategory.description}
                </p>

                <Link
                  href="/signup"
                  className="inline-flex h-12 px-6 bg-emerald-600 hover:bg-emerald-700 rounded-xl items-center justify-center gap-2 text-white font-bold transition-all group shadow-xl shadow-emerald-500/20 border border-emerald-500/50"
                >
                  Start Building
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right side Visual Node */}
              <div className="relative w-full md:w-[320px] shrink-0 aspect-square rounded-[2rem] bg-background border border-emerald-500/20 flex flex-col items-center justify-center overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

                <div className="size-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 relative z-10 animate-pulse">
                  <div className="size-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    {(() => {
                      const ActiveIcon =
                        iconMap[activeCategory.icon] || Briefcase;
                      return <ActiveIcon className="size-6 text-white" />;
                    })()}
                  </div>
                </div>
                <div className="text-center relative z-10">
                  <div className="text-sm font-bold text-foreground mb-1">
                    {activeCategory.name} Output
                  </div>
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Ready in 60s
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {comingSoon.length > 0 && (
          <>
            {/* Separator / Title for roadmap list */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-5xl mx-auto flex items-center gap-4 py-4 mb-4"
            >
              <div className="h-px bg-border flex-1" />
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Lock className="size-3" /> Coming Soon on Roadmap
              </div>
              <div className="h-px bg-border flex-1" />
            </motion.div>

            {/* Coming Soon List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
            >
              {comingSoon.map((item, i) => {
                const Icon = iconMap[item.icon] || Layout;
                return (
                  <div
                    key={item._id || i}
                    className="group relative flex flex-col p-5 rounded-[1.5rem] bg-secondary/50 border border-border/60 hover:bg-secondary hover:border-border transition-all duration-300 items-center text-center cursor-default grayscale-[0.2] hover:grayscale-0"
                  >
                    <div className="absolute top-3 right-3 text-[9px] font-bold text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded-sm">
                      {item.isLocked ? "Locked" : "Soon"}
                    </div>

                    <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center mb-3 group-hover:text-orange-500 group-hover:scale-110 group-hover:border-orange-500/30 shadow-sm transition-all duration-300 text-muted-foreground">
                      <Icon className="size-5" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
