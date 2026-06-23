"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Palette } from "lucide-react";
import { WEBSITE_THEMES } from "@/lib/themes/presets";

/* ── Fallback data from local presets (when DB is empty) ── */
const LOCAL_FALLBACK = Object.values(WEBSITE_THEMES)
  .slice(0, 6)
  .map((t) => ({
    themeId: t.id,
    name: t.name,
    description: t.description || "",
    colors: [
      t.modes?.light?.primary,
      t.modes?.light?.secondary ?? t.modes?.light?.background,
      t.modes?.dark?.primary,
    ].filter(Boolean),
    isAvailable: true,
    _fromLocal: true,
  }));

/* ── Mini website mockup preview ── */
function ThemeCard({ theme, index }) {
  const [primary, secondary, accent] = theme.colors || [
    "var(--primary)",
    "var(--accent)",
    "var(--background)",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group rounded-3xl border border-border/50 bg-background overflow-hidden relative shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300"
    >
      {/* Mini website preview */}
      <div
        className="h-44 relative overflow-hidden flex flex-col p-4 gap-2"
        style={{
          background: `linear-gradient(135deg, ${primary}18, ${secondary}10)`,
        }}
      >
        {/* Fake navbar */}
        <div className="flex items-center justify-between mb-1">
          <div
            className="w-16 h-2.5 rounded-full"
            style={{ backgroundColor: primary }}
          />
          <div className="flex gap-1.5">
            <div className="w-8 h-2 rounded-full bg-foreground/10" />
            <div className="w-8 h-2 rounded-full bg-foreground/10" />
            <div className="w-8 h-2 rounded-full bg-foreground/10" />
          </div>
        </div>

        {/* Fake hero */}
        <div className="mt-2 space-y-1.5 flex-1">
          <div className="w-2/3 h-3.5 rounded-md bg-foreground/20" />
          <div className="w-1/2 h-2.5 rounded-md bg-foreground/10" />
          <div className="w-3/4 h-2 rounded-md bg-foreground/10" />
        </div>

        {/* Fake CTA buttons */}
        <div className="flex gap-2 mt-auto">
          <div
            className="w-20 h-6 rounded-lg"
            style={{ backgroundColor: primary }}
          />
          <div
            className="w-20 h-6 rounded-lg border"
            style={{ borderColor: primary + "60" }}
          />
        </div>

        {/* Color chip row */}
        <div className="absolute top-3 right-3 flex -space-x-1">
          {theme.colors.slice(0, 3).map((c, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-background shadow-sm ring-1 ring-border/20"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-foreground leading-tight">
            {theme.name}
          </h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary-soft px-2 py-1 rounded-md shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            Available
          </div>
        </div>

        {theme.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {theme.description}
          </p>
        )}

        {/* Color chips row */}
        <div className="flex items-center gap-1.5 mt-3">
          {theme.colors.slice(0, 4).map((c, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border border-border/60"
              style={{ backgroundColor: c }}
            />
          ))}
          {theme._fromLocal && (
            <span className="ml-auto text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">
              Local
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Section ── */
export function ThemeShowcaseSection() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchThemes = async () => {
    try {
      const res = await fetch("/api/themes/available?context=showcase");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      if (
        data.success &&
        Array.isArray(data.themes) &&
        data.themes.length > 0
      ) {
        // Take up to 6, map colors from DB or fallback to preset
        const mapped = data.themes.slice(0, 6).map((t) => {
          const preset = WEBSITE_THEMES[t.themeId] || WEBSITE_THEMES[t.slug];
          const colors = preset
            ? [
                preset.modes?.light?.primary,
                preset.modes?.dark?.primary,
                preset.modes?.light?.accent,
              ].filter(Boolean)
            : [t.colors?.primary, t.colors?.secondary, t.colors?.accent].filter(
                Boolean,
              );

          return {
            ...t,
            colors,
            description: t.description || preset?.description || "",
          };
        });
        setThemes(mapped);
      } else {
        // DB is empty → use local fallback
        setThemes(LOCAL_FALLBACK);
      }
    } catch {
      // Network error → fallback to local
      setThemes(LOCAL_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
    // Realtime polling every 30s — reflects admin changes instantly
    const interval = setInterval(fetchThemes, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-secondary/10 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Premium <span className="text-primary">Theme</span> presets
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Start with {themes.length > 0 ? themes.length : "20"} professionally
            crafted themes. Instantly swap them out without losing any content.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-border/50 bg-background overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-muted/40" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-1/2 bg-muted rounded-lg" />
                  <div className="h-3 w-3/4 bg-muted/60 rounded-lg" />
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="w-4 h-4 rounded-full bg-muted" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {themes.map((theme, i) => (
              <ThemeCard key={theme.themeId || i} theme={theme} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
