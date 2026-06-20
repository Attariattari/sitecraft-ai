"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for students & beginners",
    features: [
      "1 AI-generated portfolio website",
      "Basic templates & themes",
      "Free sitecraft.ai subdomain",
      "Limited AI generation credits",
      "Community support",
    ],
    cta: "Start Free",
    href: "/dashboard/generate",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "Coming Soon",
    period: "",
    description: "Best for freelancers & professionals",
    features: [
      "Multiple websites",
      "Premium templates & themes",
      "Advanced SEO optimization",
      "Full analytics dashboard",
      "Expanded AI credits",
      "Priority support",
    ],
    cta: "Join Waitlist",
    href: "/pricing",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Agency",
    price: "Coming Soon",
    period: "",
    description: "Best for agencies & teams",
    features: [
      "Unlimited client websites",
      "Team workspace & roles",
      "Custom branding & white label",
      "Priority AI generation",
      "Advanced analytics",
      "Dedicated account manager",
    ],
    cta: "Contact Us",
    href: "/contact",
    highlight: false,
    badge: null,
  },
];

export function PricingPreviewSection() {
  return (
    <section
      className="py-28 bg-secondary/20 relative overflow-hidden"
      id="pricing"
    >
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="site-badge-emerald mb-5">
            <Sparkles className="size-3.5" /> Flexible Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            Simple pricing,{" "}
            <span className="site-gradient-text">zero surprises</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            Start free, generate your first AI-powered website, and upgrade when
            you need more power.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300
                ${
                  plan.highlight
                    ? "bg-foreground border-primary/50 shadow-2xl shadow-primary/10 scale-[1.03] z-10"
                    : "site-glass-card hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
                }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="site-badge-emerald !bg-primary !text-white !border-primary shadow-lg shadow-primary/30">
                    ★ {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3
                  className={`text-xl font-black mb-1 ${plan.highlight ? "text-white" : "text-foreground"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm font-medium mb-5 ${plan.highlight ? "text-slate-400" : "text-muted-foreground"}`}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-black tracking-tight ${plan.highlight ? "text-white" : "text-foreground"}`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm font-semibold ${plan.highlight ? "text-slate-500" : "text-muted-foreground"}`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div
                className={`h-px mb-6 ${plan.highlight ? "bg-white/10" : "bg-border/60"}`}
              />

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 size-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-primary/30" : "bg-primary/15"}`}
                    >
                      <CheckCircle2
                        className="size-2.5 text-primary"
                        strokeWidth={3}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium leading-snug ${plan.highlight ? "text-slate-300" : "text-muted-foreground"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                size="lg"
                className={`h-12 rounded-2xl font-bold text-sm gap-2 w-full transition-all duration-300
                  ${plan.highlight ? "site-primary-button" : "site-secondary-button"}`}
                asChild
              >
                <Link href={plan.href}>
                  {plan.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs font-bold text-muted-foreground/60"
        >
          {[
            "No credit card required",
            "Cancel anytime",
            "Free SSL on all plans",
            "GDPR compliant",
          ].map((t, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary/60" /> {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
