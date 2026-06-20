"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    interval: "forever",
    status: "MVP Active",
    features: [
      "1 AI portfolio website",
      "Basic templates",
      "Basic themes",
      "Public SiteCraft link",
      "Limited AI credits",
    ],
    cta: "Start Free",
    active: true,
  },
  {
    name: "Pro",
    price: "$12",
    interval: "/month",
    status: "Coming Soon",
    features: [
      "Multiple websites",
      "Premium templates",
      "Advanced themes",
      "SEO tools",
      "Analytics dashboards",
    ],
    cta: "Join Waitlist",
    active: false,
  },
  {
    name: "Agency",
    price: "$49",
    interval: "/month",
    status: "Coming Soon",
    features: [
      "Client websites management",
      "Team workspace",
      "Custom branding",
      "Higher AI limits",
      "Priority Support",
    ],
    cta: "Join Waitlist",
    active: false,
  },
];

export function PricingPreviewSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Simple, transparent{" "}
            <span className="text-emerald-500">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Start building for free today. Upgrade when you need more power and
            custom branding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2rem] border transition-all duration-300 ${
                plan.active
                  ? "bg-background border-emerald-500/40 shadow-2xl shadow-emerald-500/10 scale-100 md:scale-105 z-10"
                  : "bg-secondary/20 border-border/40 opacity-90 scale-95 md:scale-100 grayscale-[0.2]"
              }`}
            >
              {plan.active && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/30">
                  Current MVP
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <div className="text-[11px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border/50 inline-block">
                    {plan.status}
                  </div>
                </div>
                {!plan.active && (
                  <Lock className="size-5 text-muted-foreground/50" />
                )}
              </div>

              <div className="mb-8">
                <span className="text-4xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground font-medium">
                  {" "}
                  {plan.interval}
                </span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`size-5 shrink-0 ${plan.active ? "text-emerald-500" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl text-sm font-bold transition-all ${
                  plan.active
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-secondary border border-border text-muted-foreground hover:text-foreground"
                }`}
                disabled={!plan.active}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
