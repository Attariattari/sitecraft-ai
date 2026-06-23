"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutTemplate, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[3rem] overflow-hidden bg-card border border-border shadow-2xl"
        >
          {/* Animated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-transparent to-accent-soft pointer-events-none" />
          <div className="absolute top-[-20%] left-1/4 w-[500px] h-[500px] bg-primary-soft rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-1/4 w-[500px] h-[500px] bg-accent-soft rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 text-center px-6 py-20 md:py-32 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-border bg-background/60 text-foreground text-xs font-bold shadow-lg backdrop-blur-sm"
            >
              <Sparkles className="size-3.5 text-primary" />
              Ready to launch?
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-8 leading-[1.1] max-w-4xl"
            >
              Your website is{" "}
              <span className="text-primary">
                one prompt away.
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
            >
              <Button
                size="lg"
              className="h-14 px-8 bg-primary hover:opacity-90 text-primary-foreground rounded-2xl w-full sm:w-auto text-base font-bold gap-2 group shadow-xl transition-all border border-primary/30"
                asChild
              >
                <Link href="/generate">
                  Generate Website
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-2xl w-full sm:w-auto text-base font-bold gap-2 group border-border text-foreground bg-background/40 hover:bg-secondary"
                asChild
              >
                <Link href="/templates">
                  <LayoutTemplate className="size-4" />
                  Explore Templates
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
