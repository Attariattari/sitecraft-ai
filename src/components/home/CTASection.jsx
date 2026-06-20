"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, Zap } from "lucide-react";
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
    <section className="py-28 relative overflow-hidden" id="cta">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[3rem] overflow-hidden"
          style={{ background: "var(--foreground)" }}
        >
          {/* Animated background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 pointer-events-none" />
          <div
            className="absolute -top-40 left-1/4 size-96 bg-primary/25 rounded-full blur-[100px] pointer-events-none animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute -bottom-40 right-1/4 size-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none animate-pulse"
            style={{ animationDuration: "6s" }}
          />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 text-center px-8 py-20 md:py-28 lg:py-32 lg:px-20">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/[0.12] text-primary text-xs font-black uppercase tracking-widest"
            >
              <Zap className="size-3.5" />
              Start for Free Today
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.05]"
            >
              Your website is <br className="hidden md:block" />
              <span className="site-gradient-text">one prompt away</span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Join thousands of creators, freelancers, and businesses who launch
              highly-professional websites with SiteCraft AI every day.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button
                size="lg"
                className="h-16 px-12 text-lg site-primary-button !rounded-2xl w-full sm:w-auto font-black gap-2 group shadow-2xl shadow-primary/30"
                asChild
              >
                <Link href="/dashboard">
                  Build My Website Free
                  <ArrowRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-12 text-lg font-bold !rounded-2xl border-2 border-white/15 text-white hover:bg-white/8 hover:border-white/25 w-full sm:w-auto transition-all duration-300 backdrop-blur-sm"
                asChild
              >
                <Link href="#features">See All Features</Link>
              </Button>
            </motion.div>

            {/* Perks */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            >
              {perks.map((perk, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm font-bold text-white/35"
                >
                  <CheckCircle2 className="size-4 text-primary/70 shrink-0" />
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
