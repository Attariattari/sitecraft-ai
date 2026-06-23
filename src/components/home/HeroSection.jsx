"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  LayoutTemplate,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-[9%] top-[18%] hidden w-48 rounded-2xl border border-border bg-card/70 p-4 shadow-2xl backdrop-blur-xl lg:block"
          animate={{ y: [0, -14, 0], rotate: [-1, 1.5, -1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              AI composing
            </span>
          </div>
          <div className="space-y-2">
            <motion.div
              className="h-2 rounded-full bg-primary"
              animate={{ width: ["42%", "78%", "52%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="h-2 rounded-full bg-muted"
              animate={{ width: ["72%", "48%", "82%"] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
        <motion.div
          className="absolute right-[8%] top-[25%] hidden w-56 rounded-2xl border border-border bg-background/70 p-4 shadow-2xl backdrop-blur-xl lg:block"
          animate={{ y: [0, 16, 0], rotate: [1, -1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Live theme
            </span>
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[9px] font-black text-primary">
              Synced
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-7 rounded-full bg-primary shadow-sm" />
            <span className="size-7 rounded-full bg-accent shadow-sm" />
            <span className="size-7 rounded-full bg-background border border-border shadow-sm" />
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[13%] hidden h-px w-80 origin-left bg-gradient-to-r from-transparent via-primary/50 to-transparent lg:block"
          animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[18%] bottom-[16%] hidden h-px w-72 origin-right bg-gradient-to-r from-transparent via-accent/45 to-transparent lg:block"
          animate={{ scaleX: [1, 0.45, 1], opacity: [0.55, 0.18, 0.55] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-[58%] hidden size-24 -translate-x-1/2 rounded-full border border-primary/20 lg:block"
          animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0.45, 0.18] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-[58%] hidden size-10 -translate-x-1/2 rounded-full bg-primary/20 blur-sm lg:block"
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-primary/30 bg-primary-soft text-primary text-xs font-bold shadow-lg"
          >
            <Sparkles className="size-3.5" />
            <span>SiteCraft AI V1 is Now Live</span>
            <span className="w-1 h-4 bg-primary/30 mx-1 rounded-full" />
            <Link
              href="/templates"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              Explore Templates <ArrowRight className="size-3" />
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.05]"
          >
            Build Beautiful Websites <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                with AI
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 right-0 h-[4px] bg-gradient-to-r from-primary/60 to-primary/5 rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            From idea to published website in minutes. Let our AI write content,
            recommend layouts, and apply premium themes for you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button
              size="lg"
              className="h-14 px-8 bg-primary hover:opacity-90 text-primary-foreground rounded-2xl w-full sm:w-auto text-base font-bold gap-2 group shadow-xl transition-all"
              asChild
            >
              <Link href="/generate">
                <Sparkles className="size-4 group-hover:scale-110 transition-transform" />
                Generate Website
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 rounded-2xl w-full sm:w-auto text-base font-bold gap-2 group border-border/60 hover:bg-secondary/40"
              asChild
            >
              <Link href="/templates">
                <LayoutTemplate className="size-4 text-primary" />
                View Templates
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Hero visual — premium browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 top-16 z-20 hidden lg:block"
            >
              <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl pb-5">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      SEO Score
                    </p>
                    <p className="text-[10px] text-primary font-bold">
                      Excellent 98/100
                    </p>
                  </div>
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
              className="absolute -right-6 bottom-24 z-20 hidden lg:block"
            >
              <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shadow-sm">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Publish Ready
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      in 12 seconds
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Mockup */}
            <div className="relative overflow-hidden rounded-t-2xl lg:rounded-[2rem] border border-border/60 bg-background/50 backdrop-blur-lg shadow-2xl shadow-primary/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-3 px-6 py-4 bg-secondary/30 border-b border-border/40">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-400/60" />
                  <div className="size-3 rounded-full bg-amber-400/60" />
                  <div className="size-3 rounded-full bg-primary/60" />
                </div>
                <div className="flex-1 bg-background border border-border/50 rounded-full px-4 py-1.5 text-[10px] sm:text-xs text-muted-foreground font-mono max-w-sm mx-auto text-center flex justify-center items-center gap-2">
                  <span className="text-primary">
                    <ShieldCheck className="size-3" />
                  </span>
                  sitecraft.ai/dashboard
                </div>
              </div>

              {/* Website Preview Skeleton */}
              <div className="p-4 sm:p-8 md:p-12 bg-secondary/10 flex flex-col gap-6">
                {/* Navbar mimic */}
                <div className="flex justify-between items-center bg-background/60 p-4 rounded-2xl border border-border/40">
                  <div className="w-24 h-6 rounded-lg bg-primary/20" />
                  <div className="hidden sm:flex gap-4">
                    <div className="w-16 h-4 rounded-full bg-muted" />
                    <div className="w-16 h-4 rounded-full bg-muted" />
                    <div className="w-16 h-4 rounded-full bg-muted" />
                  </div>
                </div>

                {/* Hero mimic */}
                <div className="grid md:grid-cols-2 gap-8 items-center bg-background/40 p-8 rounded-3xl border border-border/40">
                  <div className="flex flex-col gap-4">
                    <div className="w-3/4 h-8 rounded-lg bg-foreground/80" />
                    <div className="w-full h-8 rounded-lg bg-foreground/80" />
                    <div className="w-5/6 h-4 rounded-md bg-muted mt-2" />
                    <div className="w-4/6 h-4 rounded-md bg-muted" />
                    <div className="flex gap-3 mt-4">
                      <div className="w-24 h-10 rounded-xl bg-primary/80" />
                      <div className="w-24 h-10 rounded-xl bg-secondary" />
                    </div>
                  </div>
                  <div className="h-48 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/30 flex items-center justify-center relative overflow-hidden">
                    <Orbit className="size-16 text-primary/30 absolute animate-pulse" />
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
                  </div>
                </div>

                {/* Features mimic */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 sm:h-32 bg-background/50 rounded-2xl border border-border/40 p-4 flex flex-col gap-3"
                    >
                      <div className="size-8 rounded-lg bg-primary/10" />
                      <div className="w-2/3 h-3 rounded-full bg-foreground/60" />
                      <div className="w-full h-2 rounded-full bg-muted" />
                      <div className="w-4/5 h-2 rounded-full bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Ensure `Orbit` is imported if not previously.
function Orbit(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
