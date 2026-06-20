"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Best for students and beginners",
    features: [
      "1 AI-generated portfolio website",
      "Basic templates",
      "Basic theme presets",
      "Public SiteCraft link",
      "Limited AI credits",
    ],
    cta: "Start Free",
    href: "/dashboard/generate",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Coming Soon",
    description: "Best for freelancers and professionals",
    features: [
      "Multiple websites",
      "Premium templates",
      "Advanced theme presets",
      "SEO optimization",
      "Analytics access",
      "More AI credits",
    ],
    cta: "Join Waitlist",
    href: "/pricing",
    highlight: true,
  },
  {
    name: "Agency",
    price: "Coming Soon",
    description: "Best for agencies and teams",
    features: [
      "Client websites",
      "Team workspace",
      "Custom branding",
      "Priority generation",
      "Advanced analytics",
      "Higher AI limits",
    ],
    cta: "Contact Us",
    href: "/contact",
    highlight: false,
  },
];

export function PricingPreviewSection() {
  return (
    <section
      className="py-24 site-bg-premium relative overflow-hidden"
      id="pricing"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="site-badge-emerald mb-6"
          >
            <Sparkles className="size-4" />
            Flexible Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6"
          >
            Simple pricing for every{" "}
            <span className="site-gradient-text font-black">stage</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-secondary-foreground leading-relaxed"
          >
            Start free, generate your first AI-powered website, and upgrade when
            you need more power.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500
                ${
                  plan.highlight
                    ? "bg-foreground border-primary shadow-premium-dark scale-105 z-20"
                    : "site-glass-card z-10"
                }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="site-badge-emerald !bg-primary !text-white shadow-xl shadow-primary/20">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlight ? "text-white" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    plan.highlight
                      ? "text-slate-400"
                      : "text-secondary-foreground"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-5xl font-black ${
                      plan.highlight ? "text-white" : "text-foreground"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== "Coming Soon" && (
                    <span
                      className={`text-sm font-bold ${
                        plan.highlight
                          ? "text-slate-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      /month
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div
                      className={`mt-1 size-5 rounded-full flex items-center justify-center shrink-0
                      ${
                        plan.highlight
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        plan.highlight
                          ? "text-slate-300"
                          : "text-secondary-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`h-14 rounded-2xl font-bold text-lg transition-all duration-300
                  ${
                    plan.highlight
                      ? "site-primary-button"
                      : "site-secondary-button"
                  }`}
                asChild
              >
                <Link href={plan.href}>
                  {plan.cta}
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
