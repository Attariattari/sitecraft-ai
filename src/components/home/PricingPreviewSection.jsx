"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { formatLimitValue, getPublicPlans } from "@/lib/plans/planEntitlements";

const plans = getPublicPlans();

export function PricingPreviewSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
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
            <span className="text-primary">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Start building for free today. Upgrade when you need more power and
            custom branding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col p-6 rounded-lg border transition-all duration-300 ${
                plan.isPopular
                  ? "bg-card border-primary shadow-2xl scale-100 md:scale-105 z-10"
                  : "bg-card/70 border-border scale-95 md:scale-100"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  Popular
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <div
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border inline-block ${
                      plan.isPopular
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-foreground text-background border-foreground/20"
                    }`}
                  >
                    {plan.badge}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-extrabold text-foreground">
                  {plan.priceMonthly === 0 ? "$0" : `$${plan.priceMonthly}`}
                </span>
                <span className="text-muted-foreground font-medium">
                  {" "}
                  /month
                </span>
              </div>

              <div className="mb-6 grid gap-2 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Websites</span>
                  <span className="font-black text-foreground">
                    {formatLimitValue(plan.limits.websites)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Themes</span>
                  <span className="font-black text-foreground">
                    {formatLimitValue(plan.limits.themes, "High limit")}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.highlights.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2
                      className="size-5 shrink-0 text-primary"
                      strokeWidth={2.4}
                    />
                    <span className="text-sm font-medium text-foreground/75">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className={`w-full rounded-lg py-4 text-center text-sm font-bold transition-all ${
                  plan.isPopular
                    ? "bg-primary hover:opacity-90 text-primary-foreground shadow-lg"
                    : "bg-foreground text-background border border-border"
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
