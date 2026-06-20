"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircle2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

  const available = categories.filter((c) => c.isAvailable && !c.isLocked);
  const comingSoon = categories.filter((c) => !c.isAvailable || c.isLocked);

  if (loading && categories.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 animate-spin">
          <RefreshCcw className="size-6 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              <Zap className="size-3" /> Industry Roadmap
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none mb-6">
              AI built for your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                specific industry.
              </span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium max-w-lg leading-relaxed">
              We've specialized our AI models for 10+ industries, ensuring every
              website we generate feels handcrafted and professional.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 p-4 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm self-start md:self-end"
          >
            <div className="text-center px-4 border-r border-border/50">
              <div className="text-2xl font-black text-foreground">
                {available.length}
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">
                Active
              </div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl font-black text-muted-foreground/60">
                {comingSoon.length}
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                Planned
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Categories Grid - Premium Presentation */}
        {available.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {available.map((cat, idx) => {
              const Icon = iconMap[cat.icon] || Layout;
              return (
                <motion.div
                  key={cat._id || cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl rounded-3xl -z-10" />

                  <div className="h-full p-8 rounded-[2rem] bg-card border border-border group-hover:border-primary/30 transition-all duration-300 flex flex-col items-start shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/5">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                      <Icon className="size-7 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                          {cat.label}
                        </h3>
                        {cat.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase">
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-8">
                        {cat.description}
                      </p>
                    </div>

                    <Link
                      href={`/signup?purpose=${cat.slug}&ref=home_cat`}
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm font-bold border border-border group-hover:border-primary"
                    >
                      Use {cat.label} AI
                      <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Roadmap / Coming Soon Section - Minimalist & Intricate */}
        {comingSoon.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px bg-border flex-1" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Lock className="size-3" /> Full Road Map
              </h4>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {comingSoon.map((item, i) => {
                const Icon = iconMap[item.icon] || Layout;
                return (
                  <motion.div
                    key={item._id || item.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-2xl bg-muted/20 border border-border/40 flex items-center gap-4 grayscale group hover:grayscale-0 transition-all duration-500 cursor-default"
                  >
                    <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h5 className="text-[13px] font-black text-foreground truncate">
                          {item.label}
                        </h5>
                      </div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-wider">
                        {item.lockedReason || "Coming Soon"}
                      </div>
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

function RefreshCcw(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
