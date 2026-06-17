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
    <section className="py-28 site-bg-premium" id="cta">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative bg-foreground rounded-[3rem] p-12 lg:p-24 overflow-hidden text-center shadow-premium-dark ring-1 ring-white/10"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-orange-500/5 pointer-events-none" />
          <div className="absolute -top-48 -right-48 size-[40rem] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-48 -left-48 size-[40rem] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="site-badge-emerald !bg-primary/[0.15] !text-primary !border-primary/20 mb-8"
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
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]"
            >
              Your website is{" "}
              <span className="site-gradient-text">one prompt away</span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Join thousands of creators, freelancers, and businesses who launch
              highly-professional websites with SiteCraft AI every day.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14"
            >
              <Button
                size="lg"
                className="h-16 px-12 text-xl site-primary-button !rounded-2xl w-full sm:w-auto"
                asChild
              >
                <Link href="/dashboard">
                  Build My Website Free <ArrowRight className="ml-3 size-6" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-12 text-xl font-bold rounded-2xl border-2 border-white/10 text-white hover:bg-white/5 w-full sm:w-auto transition-all duration-300 backdrop-blur-sm"
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
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            >
              {perks.map((perk, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-sm font-bold text-white/40 tracking-tight"
                >
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
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
