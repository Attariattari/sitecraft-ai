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
import { cn } from "@/lib/utils";
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
  const activeCategories = homeCategories.filter(
    (c) => c.isAvailable && !c.isLocked,
  );
  const comingSoon = homeCategories.filter((c) => !c.isAvailable || c.isLocked);

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
        <div className="w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] absolute -top-[20%]" />
        <div className="w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] absolute -bottom-[10%] -right-[10%]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Platform Availability
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6">
            One AI Model. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
              Multiple Industries.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            We've specialized our AI to understand industry-specific nuances,
            delivering high-converting websites for every sector.
          </p>
        </motion.div>

        {/* Active categories Grid */}
        {activeCategories.length > 0 && (
          <div
            className={cn(
              "grid gap-6 mb-16 max-w-6xl mx-auto",
              activeCategories.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2",
            )}
          >
            {activeCategories.map((cat, i) => {
              const Icon = iconMap[cat.icon] || Briefcase;
              return (
                <motion.div
                  key={cat._id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="relative rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-2xl shadow-primary/5 p-8 md:p-10 flex flex-col sm:flex-row items-center gap-8 h-full">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-all duration-700" />

                    {/* Visual Node */}
                    <div className="relative size-40 sm:size-48 shrink-0 rounded-[2rem] bg-background border border-border flex flex-col items-center justify-center overflow-hidden shadow-inner group-hover:border-primary/20 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                      <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-3 relative z-10">
                        <div className="size-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
                          <Icon className="size-6 text-white" />
                        </div>
                      </div>
                      <div className="text-center relative z-10">
                        <p className="text-xs font-black text-foreground mb-0.5 tracking-tight uppercase">
                          Live Now
                        </p>
                        <p className="text-[10px] font-bold text-primary italic">
                          60s Generation
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-lg mb-4 border border-emerald-500/20">
                        {cat.badge || "Fully Optimized"}
                      </div>
                      <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-base text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-3">
                        {cat.description}
                      </p>

                      <Link
                        href="/signup"
                        className="inline-flex h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl items-center justify-center gap-2 font-bold transition-all group/btn shadow-lg shadow-primary/20"
                      >
                        Launch Now
                        <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {comingSoon.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-6 mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 whitespace-nowrap">
                <Lock className="w-3.5 h-3.5 mb-0.5" />
                Industry Roadmap
              </h3>
              <div className="h-px bg-border/60 flex-1" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {comingSoon.map((item, i) => {
                const Icon = iconMap[item.icon] || Layout;
                return (
                  <motion.div
                    key={item._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group relative p-6 rounded-3xl bg-secondary/30 border border-border/40 hover:bg-card hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 px-2 py-1 bg-muted text-[8px] font-black uppercase tracking-tighter text-muted-foreground rounded-bl-xl border-l border-b border-border opacity-60 group-hover:opacity-100 transition-opacity">
                      {item.isLocked ? "Planned" : "Soon"}
                    </div>

                    <div className="size-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-primary/30 group-hover:text-primary shadow-sm transition-all duration-500 text-muted-foreground/60">
                      <Icon className="size-6" />
                    </div>

                    <h4 className="text-base font-black text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-xs text-muted-foreground font-semibold leading-relaxed line-clamp-2 px-1">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-border/50 w-full">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                        Enabling Soon
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
