"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Palette,
  Layout,
  Maximize,
  Loader2,
  ShieldCheck,
  Orbit,
} from "lucide-react";

export function AIPreviewSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            See What AI Can Build <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-300 mt-2 inline-block">
              Instantly
            </span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Watch as SiteCraft AI constructs a fully responsive, custom-designed
            website right before your eyes.
          </p>
        </motion.div>

        {/* Interactive UI Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-secondary/20 rounded-[2rem] border border-border/50 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col md:flex-row shadow-emerald-500/5">
            {/* Left sidebar - Settings Simulator */}
            <div className="w-full md:w-72 bg-background/80 border-r border-border/50 p-6 flex flex-col gap-8 shrink-0 relative z-10">
              <div>
                <h3 className="text-xs font-black uppercase text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
                  <Layout className="size-4" /> Template Selection
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Portfolio", "SaaS", "Agency", "Startup"].map((chip, i) => (
                    <div
                      key={i}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${i === 0 ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-border/60 text-muted-foreground hover:bg-secondary"}`}
                    >
                      {chip}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
                  <Palette className="size-4" /> Theme Switcher
                </h3>
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-slate-900 border-2 border-emerald-500 ring-2 ring-emerald-500/20" />
                  <div className="size-8 rounded-full bg-slate-100 border border-border" />
                  <div className="size-8 rounded-full bg-[#1e1b4b] border border-border" />
                  <div className="size-8 rounded-full bg-[#052e16] border border-border" />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-border/50">
                <div className="flex items-center gap-3 text-sm font-bold text-foreground mb-3">
                  <Loader2 className="size-4 animate-spin text-emerald-500" />
                  AI is Thinking...
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: "30%" }}
                    animate={{ width: ["30%", "60%", "100%", "30%"] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Website Preview canvas */}
            <div className="flex-1 bg-secondary/5 relative min-h-[600px] flex items-center justify-center p-4">
              <div className="absolute top-4 right-4 text-xs font-bold bg-background border border-border/60 px-3 py-1.5 rounded-lg text-muted-foreground flex items-center gap-2 shadow-sm">
                <Maximize className="size-3" /> Live Preview
              </div>

              {/* The Fake Website */}
              <div className="w-full max-w-3xl bg-background border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Fake Navbar */}
                <div className="flex justify-between items-center p-6 border-b border-border/30">
                  <div className="text-lg font-black text-foreground flex items-center gap-2">
                    <div className="size-6 bg-emerald-500 rounded-md" />
                    Portfolio.
                  </div>
                  <div className="hidden sm:flex gap-6 text-sm font-semibold text-muted-foreground">
                    <span>About</span>
                    <span>Skills</span>
                    <span>Projects</span>
                    <span>Contact</span>
                  </div>
                </div>

                {/* Fake Hero */}
                <div className="p-12 md:p-16 text-center flex flex-col items-center border-b border-border/30 relative overflow-hidden">
                  <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 size-40 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold mb-6">
                    <Sparkles className="size-3" /> Full-Stack Developer
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-4 relative z-10 text-foreground">
                    Crafting Digital <br /> Experiences
                  </h1>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">
                    I build fast, responsive, and beautiful web applications
                    using modern web technologies.
                  </p>
                  <div className="flex gap-4">
                    <div className="px-6 py-2.5 bg-foreground text-background font-bold rounded-xl text-sm">
                      View Work
                    </div>
                    <div className="px-6 py-2.5 border border-border text-foreground font-bold rounded-xl text-sm">
                      Contact Me
                    </div>
                  </div>
                </div>

                {/* Fake Skills */}
                <div className="p-8 md:p-12 bg-secondary/10 flex flex-col items-center">
                  <h2 className="text-xl font-bold mb-8 text-foreground">
                    Core Skills
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4">
                    {["React", "Next.js", "Tailwind", "Node.js"].map(
                      (skill, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center p-4 bg-background border border-border/50 rounded-xl shadow-sm text-sm font-bold text-foreground"
                        >
                          {skill}
                        </div>
                      ),
                    )}
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
