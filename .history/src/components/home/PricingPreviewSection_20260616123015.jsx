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
      className="py-24 bg-background relative overflow-hidden"
      id="pricing"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 size-96 bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 size-96 bg-accent rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[var(--accent)]">
              stage
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground leading-relaxed"
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
              className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500
                ${
                  plan.highlight
                    ? "bg-foreground border-primary shadow-2xl shadow-primary/20 scale-105 z-20"
                    : "bg-soft border-border hover:border-primary/30 z-10"
                }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                  Recommended
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlight ? "text-background" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    plan.highlight
                      ? "text-background/60"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-black ${
                      plan.highlight ? "text-background" : "text-foreground"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== "Coming Soon" && (
                    <span
                      className={`text-sm ${
                        plan.highlight
                          ? "text-background/60"
                          : "text-muted-foreground"
                      }`}
                    >
                      /month
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div
                      className={`mt-1 size-5 rounded-full flex items-center justify-center shrink-0
                      ${
                        plan.highlight
                          ? "bg-primary text-primary-foreground font-bold"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Check className="size-3" />
                    </div>
                    <span
                      className={`text-sm ${
                        plan.highlight
                          ? "text-background/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? "default" : "outline"}
                size="lg"
                className={`h-14 rounded-2xl font-bold text-lg transition-all duration-300
                  ${
                    plan.highlight
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                      : ""
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
