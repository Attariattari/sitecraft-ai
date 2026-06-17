"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

// Mocking some theme presets since we do not want to pull heavy actual data
const themes = [
  {
    name: "Emerald Elite",
    mode: "Light & Dark",
    colors: ["#10B981", "#064E3B", "#F8FAFC"],
    available: true,
  },
  {
    name: "Sunset Orange",
    mode: "Light & Dark",
    colors: ["#F97316", "#7C2D12", "#FFFFFF"],
    available: true,
  },
  {
    name: "Ocean Blue",
    mode: "Light & Dark",
    colors: ["#3B82F6", "#1E3A8A", "#F1F5F9"],
    available: true,
  },
  {
    name: "Minimal Dark",
    mode: "Dark Only",
    colors: ["#0F172A", "#334155", "#E2E8F0"],
    available: true,
  },
  {
    name: "Rose Gold",
    mode: "Light Only",
    colors: ["#F43F5E", "#881337", "#FFF1F2"],
    available: true,
  },
  {
    name: "Cyber Neon",
    mode: "Dark Only",
    colors: ["#A855F7", "#D946EF", "#000000"],
    available: true,
  },
];

export function ThemeShowcaseSection() {
  return (
    <section className="py-24 bg-secondary/10 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Premium <span className="text-emerald-500">Theme</span> presets
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Start with 20 professionally crafted themes. Instantly swap them out
            without losing any content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {themes.map((theme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group rounded-3xl border border-border/50 bg-background overflow-hidden relative shadow-md hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300"
            >
              {/* Mini Preview Background (fake) */}
              <div className="h-40 bg-secondary/30 border-b border-border/50 relative overflow-hidden flex flex-col gap-2 p-4">
                <div
                  className="w-1/2 h-4 rounded-md"
                  style={{ backgroundColor: theme.colors[0] }}
                />
                <div className="w-3/4 h-2 rounded-md bg-foreground/20" />
                <div className="w-5/6 h-2 rounded-md bg-foreground/20" />
                <div className="mt-auto flex gap-2">
                  <div
                    className="w-16 h-6 rounded-md"
                    style={{ backgroundColor: theme.colors[0] }}
                  />
                  <div className="w-16 h-6 rounded-md bg-background border border-border/60" />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-foreground">
                    {theme.name}
                  </h3>
                  {theme.available && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                      <CheckCircle2 className="size-3" /> Available
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium text-xs bg-secondary px-2 py-1 rounded-md border border-border/40">
                    {theme.mode}
                  </span>

                  {/* Color chips */}
                  <div className="flex -space-x-1">
                    {theme.colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="size-5 rounded-full border border-border"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
