"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Play,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { value: "10K+", label: "Websites Built", icon: TrendingUp },
  { value: "50+", label: "Premium Themes", icon: Sparkles },
  { value: "< 2min", label: "Time to Deploy", icon: Zap },
  { value: "99.9%", label: "Uptime SLA", icon: Star },
];

const floatingCards = [
  { title: "Portfolio Site", badge: "Generated in 58s", color: "#10B981" },
  { title: "SaaS Landing Page", badge: "Generated in 72s", color: "#F97316" },
  { title: "Restaurant Website", badge: "Generated in 45s", color: "#10B981" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-primary/12 via-primary/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-gradient-radial from-accent/10 via-accent/3 to-transparent rounded-full blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 mb-8"
          >
            <span className="site-badge-emerald inline-flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-primary" />
              </span>
              Open Beta — Free to Start
              <ArrowRight className="size-3" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-extrabold tracking-tight text-foreground mb-7 leading-[1.05]"
          >
            Build a{" "}
            <span className="relative inline-block">
              <span className="site-gradient-text">Professional</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
                className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/40 to-primary/10 rounded-full origin-left"
              />
            </span>{" "}
            Website
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-accent">
              with One Prompt
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            SiteCraft AI turns your idea into a fully-designed, content-rich
            website in minutes. No code, no designers, no waiting — just
            results.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <Button
              size="lg"
              className="h-14 px-10 site-primary-button !rounded-2xl w-full sm:w-auto text-base font-bold gap-2 group shadow-2xl shadow-primary/25"
              asChild
            >
              <Link href="/dashboard">
                Start Building Free
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-10 site-secondary-button !rounded-2xl w-full sm:w-auto text-base font-bold gap-2 group"
            >
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="size-3 fill-primary text-primary ml-0.5" />
              </div>
              Watch Demo
            </Button>
          </motion.div>

          {/* Social proof row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 mb-20"
          >
            <div className="flex -space-x-2">
              {["#10B981", "#34D399", "#F97316", "#FB923C", "#6EE7B7"].map(
                (c, i) => (
                  <div
                    key={i}
                    className="size-8 rounded-full border-2 border-background shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${c}cc, ${c}66)`,
                    }}
                  />
                ),
              )}
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
              <span className="text-amber-500">★★★★★</span>
              <span className="text-foreground font-bold">10,000+</span> happy
              builders
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-24"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.45 + i * 0.07 }}
                  className="relative group flex flex-col items-center gap-2 p-5 rounded-2xl site-glass-card"
                >
                  <Icon className="size-4 text-primary opacity-70 mb-1" />
                  <span className="text-2xl font-black text-foreground tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground text-center leading-tight">
                    {stat.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Hero visual — premium dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Floating decorative cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 top-12 z-20 hidden lg:block"
            >
              <div className="site-glass-card !rounded-2xl px-5 py-4 shadow-2xl min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-7 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Sparkles className="size-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-black text-foreground">
                    AI Writing
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[90, 70, 55].map((w, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full bg-primary/20"
                      style={{ width: `${w}%` }}
                    >
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 1.5,
                          delay: 0.8 + i * 0.2,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -right-4 bottom-16 z-20 hidden lg:block"
            >
              <div className="site-glass-card !rounded-2xl px-5 py-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Zap className="size-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-foreground">
                      Site Published!
                    </p>
                    <p className="text-[10px] text-primary font-bold mt-0.5">
                      sitecraft.ai/yoursite
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main mockup */}
            <div className="relative overflow-hidden site-glass-card !rounded-[2.5rem] shadow-2xl shadow-black/10 dark:shadow-black/40 border border-border/60">
              {/* Browser chrome */}
              <div className="flex items-center gap-3 px-6 py-4 bg-secondary/40 border-b border-border/40">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-400/60" />
                  <div className="size-3 rounded-full bg-amber-400/60" />
                  <div className="size-3 rounded-full bg-emerald-400/60" />
                </div>
                <div className="flex-1 bg-background/70 border border-border/50 rounded-lg px-4 py-1.5 text-xs text-muted-foreground font-mono max-w-xs mx-auto text-center">
                  ✦ sitecraft.ai/dashboard
                </div>
                <div className="size-6 rounded-md bg-primary/15 flex items-center justify-center">
                  <div className="size-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-8 md:p-12 bg-background/20">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-lg font-black text-foreground">
                      My Workspace
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">
                      3 sites generated this week
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="site-badge-emerald !text-[10px] !px-2.5 !py-1">
                      <Sparkles className="size-3" /> 240 credits
                    </div>
                    <div className="h-8 px-4 site-primary-button rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="size-3" /> Generate Site
                    </div>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {floatingCards.map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + i * 0.12 }}
                      className="group flex flex-col gap-3 p-5 rounded-2xl border border-border/50 bg-background/60 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                    >
                      <div
                        className="h-28 rounded-xl flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${card.color}18, ${card.color}06)`,
                          borderColor: `${card.color}25`,
                          border: `1px solid ${card.color}25`,
                        }}
                      >
                        <div className="absolute inset-0 flex flex-col gap-1.5 p-3 opacity-50">
                          {[85, 65, 80, 40].map((w, j) => (
                            <div
                              key={j}
                              className={`h-1.5 rounded-full`}
                              style={{
                                width: `${w}%`,
                                background: card.color + "40",
                              }}
                            />
                          ))}
                        </div>
                        <span
                          className="relative text-[10px] font-black px-3 py-1.5 rounded-lg"
                          style={{
                            background: card.color + "20",
                            color: card.color,
                          }}
                        >
                          Preview
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          {card.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <div className="size-1.5 rounded-full bg-emerald-500" />
                          {card.badge}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom prompt bar */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-background/60 border border-border/50">
                  <div className="size-8 site-primary-button rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="flex-1 text-sm text-muted-foreground font-medium">
                    Describe your business and let AI build your website...
                  </div>
                  <div className="h-9 px-5 site-primary-button rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                    Generate <ArrowRight className="size-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
