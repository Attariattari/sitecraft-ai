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
} from "lucide-react";

const categories = [
  {
    icon: Briefcase,
    title: "Portfolio Websites",
    status: "MVP",
    color: "emerald",
    desc: "Perfect for freelancers, designers, and developers.",
  },
  {
    icon: Building2,
    title: "Business Websites",
    status: "Coming Soon",
    color: "muted",
    desc: "Corporate sites for agencies and established brands.",
  },
  {
    icon: Utensils,
    title: "Restaurant Websites",
    status: "Coming Soon",
    color: "muted",
    desc: "Menus, reservations, and stunning food displays.",
  },
  {
    icon: Stethoscope,
    title: "Clinic Websites",
    status: "Coming Soon",
    color: "muted",
    desc: "Professional layouts for healthcare providers.",
  },
  {
    icon: Home,
    title: "Real Estate Websites",
    status: "Coming Soon",
    color: "muted",
    desc: "Property listings and agent portfolios.",
  },
  {
    icon: Users,
    title: "Agency Websites",
    status: "Coming Soon",
    color: "muted",
    desc: "Showcase client work and team expertise.",
  },
  {
    icon: GraduationCap,
    title: "School Websites",
    status: "Coming Soon",
    color: "muted",
    desc: "Info portals for educational institutions.",
  },
  {
    icon: Globe,
    title: "Landing Pages",
    status: "Coming Soon",
    color: "muted",
    desc: "High-converting single pages for campaigns.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Stores",
    status: "Coming Soon",
    color: "muted",
    desc: "Full online catalogs with integrated AI marketing.",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Endless industry{" "}
            <span className="text-orange-500">possibilities</span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            We&apos;re starting strong with our MVP Portfolio generation, and
            rolling out an array of specialized industries soon.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isMVP = cat.status === "MVP";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`group relative flex flex-col p-6 rounded-[1.5rem] border transition-all duration-300 ${isMVP ? "bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/10 hover:border-emerald-500/50" : "bg-secondary/20 border-border/40"}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${isMVP ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-background border border-border text-muted-foreground"}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${isMVP ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-background border border-border text-muted-foreground/60"}`}
                  >
                    {cat.status}
                  </div>
                </div>
                <h3
                  className={`text-lg font-bold mb-1 ${isMVP ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {cat.title}
                </h3>
                <p
                  className={`text-sm font-medium ${isMVP ? "text-muted-foreground text-opacity-90" : "text-muted-foreground/60"}`}
                >
                  {cat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
