"use client";

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
} from "lucide-react";
import Link from "next/link";

const comingSoon = [
  {
    icon: Building2,
    title: "Business Websites",
    desc: "Corporate sites for agencies & brands.",
  },
  {
    icon: Utensils,
    title: "Restaurant Websites",
    desc: "Menus, reservations & food displays.",
  },
  {
    icon: Stethoscope,
    title: "Clinic Websites",
    desc: "Professional layouts for healthcare.",
  },
  {
    icon: Home,
    title: "Real Estate Websites",
    desc: "Property listings & agent portfolios.",
  },
  {
    icon: Users,
    title: "Agency Websites",
    desc: "Showcase client work & team expertise.",
  },
  {
    icon: GraduationCap,
    title: "School Websites",
    desc: "Portals for educational institutions.",
  },
  {
    icon: Globe,
    title: "Landing Pages",
    desc: "High-converting campaign pages.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Stores",
    desc: "Full catalogs with AI marketing.",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-28 relative overflow-hidden bg-background">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            Endless industry <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
              possibilities
            </span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            We&apos;re starting strong with our MVP Portfolio generation, and
            rolling out an array of specialized industries soon.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {/* Main MVP Card - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-[45%] shrink-0"
          >
            <div className="relative h-full flex flex-col p-8 md:p-12 rounded-[2.5rem] bg-foreground overflow-hidden border border-emerald-500/30 group shadow-2xl shadow-emerald-500/20">
              {/* Card Ambient Glows */}
              <div className="absolute -top-32 -left-32 w-72 h-72 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-orange-500/15 blur-[100px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />

              {/* Content */}
              <div className="relative z-10 mb-8 flex-1">
                <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full mb-8 border border-emerald-500/20">
                  <span className="relative flex size-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
                  </span>
                  MVP Active Engine
                </div>

                <div className="size-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <Briefcase className="size-8 text-white" />
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 tracking-tight">
                  Portfolio Websites
                </h3>

                <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
                  Perfect for freelancers, designers, and developers. Build a
                  high-converting, professional portfolio in seconds with
                  perfectly paired fonts, semantic structure, and striking
                  visuals.
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-auto border-t border-white/10">
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors group/link"
                >
                  Start Building Your Portfolio
                  <ArrowRight className="size-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Grid - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {comingSoon.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group flex flex-col p-6 rounded-[1.5rem] bg-secondary/30 border border-border/40 relative overflow-hidden transition-all duration-300 hover:bg-secondary/60 grayscale-[0.3] hover:grayscale-0 hover:border-border"
                >
                  <div className="absolute top-5 right-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 bg-background/80 border border-border/50 px-2.5 py-1 rounded-md flex items-center gap-1 group-hover:text-foreground transition-colors backdrop-blur-sm">
                    <Lock className="size-3" strokeWidth={2.5} /> Soon
                  </div>

                  <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center mb-4 text-muted-foreground group-hover:text-orange-500 group-hover:border-orange-500/30 transition-colors shadow-sm">
                    <Icon className="size-5" />
                  </div>

                  <h4 className="text-base font-bold text-foreground mb-1.5 group-hover:text-orange-500 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
