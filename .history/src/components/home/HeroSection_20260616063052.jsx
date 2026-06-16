"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const floatingOrbs = [
  { size: 500, top: "-10%", right: "-5%", color: "var(--primary)", delay: 0 },
  {
    size: 400,
    bottom: "-15%",
    left: "-8%",
    color: "var(--accent)",
    delay: 0.3,
  },
  { size: 300, top: "40%", left: "30%", color: "var(--primary)", delay: 0.6 },
];

const stats = [
  { value: "10,000+", label: "Websites Built" },
  { value: "50+", label: "Premium Themes" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 2min", label: "Time to Deploy" },
];

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden bg-background">
      {/* Ambient orbs */}
      {floatingOrbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            background: orb.color,
            opacity: 0.06,
            filter: "blur(100px)",
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(to right, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8"
          >
            <Sparkles className="size-4" />
            <span>AI-Powered Website Builder — Now in Open Beta</span>
            <ArrowRight className="size-4" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.05]"
          >
            Build Beautiful{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Websites</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full origin-left"
              />
            </span>{" "}
            with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[var(--accent)]">
              AI
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            SiteCraft AI turns your idea into a fully-designed, content-rich
            website in minutes. Choose your niche, pick a theme, and go live —
            no code, no designer required.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              asChild
            >
              <Link href="/dashboard">
                Start Building Free <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-10 text-lg font-semibold rounded-2xl border-2 hover:bg-soft hover:scale-105 transition-all duration-300 w-full sm:w-auto gap-2"
            >
              <Play className="size-4 fill-current" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-3xl font-extrabold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Hero visual — browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-3 px-5 py-4 bg-soft border-b border-border">
              <div className="flex gap-2">
                <div className="size-3 rounded-full bg-muted-foreground/20" />
                <div className="size-3 rounded-full bg-muted-foreground/20" />
                <div className="size-3 rounded-full bg-muted-foreground/20" />
              </div>
              <div className="flex-1 bg-background border border-border rounded-lg px-4 py-1.5 text-xs text-muted-foreground font-mono max-w-xs mx-auto text-center">
                sitecraft.ai/dashboard
              </div>
            </div>
            {/* Mockup content */}
            <div className="bg-soft p-6 md:p-10 min-h-[280px] flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    Welcome to SiteCraft
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Your AI workspace is ready.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="rounded-xl border border-border bg-background p-4 flex flex-col gap-2"
                  >
                    <div className="h-20 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                      <span className="text-primary/40 text-xs font-medium">
                        Theme Preview
                      </span>
                    </div>
                    <div className="h-2.5 w-3/4 bg-foreground/10 rounded-full mt-2" />
                    <div className="h-2 w-1/2 bg-foreground/5 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/20">
                  Generate Site
                </div>
                <div className="h-9 px-4 rounded-xl bg-foreground/5 text-muted-foreground text-xs font-semibold flex items-center justify-center border border-border">
                  Settings
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
