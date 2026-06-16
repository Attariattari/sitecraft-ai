"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const perks = [
  "No credit card required",
  "Free subdomain on every plan",
  "Cancel anytime",
  "Full theme library access",
];

export function CTASection() {
  return (
    <section className="py-28 bg-background" id="cta">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative bg-foreground rounded-[2.5rem] p-12 lg:p-20 overflow-hidden text-center"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/15 pointer-events-none" />
          <div className="absolute -top-24 -right-24 size-96 bg-primary rounded-full blur-[100px] opacity-15 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 size-96 bg-accent rounded-full blur-[100px] opacity-10 pointer-events-none" />

          {/* Floating sparkle decorations */}
          <div className="absolute top-8 left-16 size-2 bg-primary rounded-full opacity-60 animate-pulse" />
          <div className="absolute top-16 right-24 size-3 bg-accent rounded-full opacity-40 animate-pulse delay-300" />
          <div className="absolute bottom-12 left-1/4 size-2 bg-primary rounded-full opacity-50 animate-pulse delay-700" />

          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-bold mb-8"
            >
              <Sparkles className="size-4" />
              Start for Free Today
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-background tracking-tight mb-6 leading-tight"
            >
              Your website is{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[var(--accent)]">
                one prompt away
              </span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-background/70 mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Join thousands of creators, freelancers, and businesses who launch
              with SiteCraft AI every day.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                asChild
              >
                <Link href="/dashboard">
                  Build My Website Free <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-semibold rounded-2xl border-2 border-background/30 text-background hover:bg-background/10 w-full sm:w-auto"
                asChild
              >
                <Link href="#features">See Features</Link>
              </Button>
            </motion.div>

            {/* Perks list */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            >
              {perks.map((perk, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-background/60"
                >
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  {perk}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
