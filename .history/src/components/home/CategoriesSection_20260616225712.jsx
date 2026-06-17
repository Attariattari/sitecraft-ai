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
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const comingSoon = [
  { icon: Building2, title: "Business Sites", desc: "For agencies & brands" },
  { icon: Utensils, title: "Restaurant Sites", desc: "Menus & reservations" },
  { icon: Stethoscope, title: "Clinic Sites", desc: "Healthcare setups" },
  { icon: Home, title: "Real Estate", desc: "Property listings" },
  { icon: Users, title: "Agency Sites", desc: "Client work showcase" },
  { icon: GraduationCap, title: "School Sites", desc: "Educational portals" },
  { icon: Globe, title: "Landing Pages", desc: "Campaign conversions" },
  { icon: ShoppingCart, title: "E-commerce", desc: "AI marketing catalogs" },
];

export function CategoriesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background layer */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute -top-[10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-5">
            Endless industry{" "}
            <span className="text-orange-400">possibilities</span>
          </h2>
          <p className="text-lg text-slate-400 font-medium">
            We&apos;re starting strong with our MVP Portfolio generation, and
            rolling out an array of specialized industries soon.
          </p>
        </motion.div>

        {/* Highlight MVP horizontally */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <div className="relative rounded-[2.5rem] bg-emerald-950/20 border border-emerald-500/30 overflow-hidden shadow-2xl shadow-emerald-900/40 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
            {/* Left side info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full mb-6 border border-emerald-500/20">
                <Sparkles className="size-3.5" />
                Fully Active Platform MVP
              </div>

              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Portfolio Websites
              </h3>
              <p className="text-lg text-emerald-100/70 font-medium leading-relaxed mb-8 max-w-lg">
                Perfect for freelancers, designers, and developers. Build a
                high-converting, professional portfolio in seconds. Let the AI
                handle the heavy lifting while you focus on showcasing your best
                work.
              </p>

              <ButtonOrLink />
            </div>

            {/* Right side Visual Node */}
            <div className="relative w-full md:w-[320px] shrink-0 aspect-square rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-50" />
              <div className="size-32 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
                <div className="size-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  <Briefcase className="size-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Separator / Title for roadmap list */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto flex items-center gap-4 py-8"
        >
          <div className="h-px bg-white/10 flex-1" />
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Lock className="size-3" /> Coming Soon on Roadmap
          </div>
          <div className="h-px bg-white/10 flex-1" />
        </motion.div>

        {/* Coming Soon List (Sleek minimalist grid) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {comingSoon.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative flex flex-col p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 items-center text-center cursor-default"
              >
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:text-orange-400 group-hover:scale-110 transition-all duration-300 text-slate-400">
                  <Icon className="size-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-400 transition-colors">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ButtonOrLink() {
  return (
    <Link
      href="/generate"
      className="inline-flex h-12 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-xl items-center justify-center gap-2 text-white font-bold transition-all group shadow-xl shadow-emerald-500/20"
    >
      Start Building
      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
