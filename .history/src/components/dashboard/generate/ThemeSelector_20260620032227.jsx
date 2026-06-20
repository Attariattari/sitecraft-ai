"use client";

import React, { useState } from "react";
import { Check, Palette, ChevronDown } from "lucide-react";
import { WEBSITE_THEMES } from "@/lib/themes/presets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { getRecommendedThemesForPurpose } from "@/lib/accountPurposeResolver";

export function ThemeSelector({
  value,
  onChange,
  accountPurpose = "portfolio",
}) {
  const [showAll, setShowAll] = useState(false);
  const [dbThemes, setDbThemes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchThemes() {
      try {
        const res = await fetch("/api/themes/available?context=generate");
        const data = await res.json();
        if (
          data.success &&
          Array.isArray(data.themes) &&
          data.themes.length > 0
        ) {
          setDbThemes(data.themes);

          // Re-check if current value is still available — only call onChange if it's a function
          const isStillAvailable = data.themes.some((t) => t.themeId === value);
          if (!isStillAvailable && typeof onChange === "function") {
            onChange(data.themes[0].themeId);
          }
        }
        // If DB empty, dbThemes stays [] → fallback to allPresets below
      } catch (err) {
        console.error("Failed to fetch available themes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();

    // Polling every 30s for real-time admin changes
    const interval = setInterval(fetchThemes, 30000);

    // BroadcastChannel for instant cross-tab refresh
    let bc = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("sitecraft-data");
        bc.addEventListener("message", (ev) => {
          const d = ev.data || {};
          if (d.type === "themes:refresh") fetchThemes();
        });
      }
    } catch (e) {
      // ignore
    }

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allPresets = Object.values(WEBSITE_THEMES);

  // If DB has themes → intersect with presets. If DB empty → use all local presets as fallback.
  const availableThemes =
    dbThemes.length > 0
      ? allPresets.filter((preset) =>
          dbThemes.some((dbTheme) => dbTheme.themeId === preset.id),
        )
      : allPresets;

  // Get recommended theme IDs for the purpose
  const recommendedIds = getRecommendedThemesForPurpose(accountPurpose);

  const recommendedThemes = availableThemes.filter((t) =>
    recommendedIds.includes(t.id),
  );

  // Fallback: if no recommended match, show first 6 available
  const displayThemes = showAll
    ? availableThemes
    : recommendedThemes.length > 0
      ? recommendedThemes
      : availableThemes.slice(0, 6);

  if (loading && dbThemes.length === 0) {
    return (
      <div className="flex items-center gap-2 py-4">
        <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Warming Up Themes...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayThemes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => typeof onChange === "function" && onChange(theme.id)}
            className={cn(
              "relative flex flex-col p-4 rounded-xl border-2 text-left transition-all duration-200",
              value === theme.id
                ? "bg-primary/5 border-primary"
                : "bg-card border-border/50 hover:border-border",
            )}
          >
            {/* Color Chips */}
            <div className="flex gap-1 h-3 w-full rounded-full overflow-hidden mb-3">
              <div
                className="flex-1"
                style={{ backgroundColor: theme.modes.light.primary }}
              />
              <div
                className="flex-1"
                style={{ backgroundColor: theme.modes.light.accent }}
              />
              <div
                className="flex-1"
                style={{ backgroundColor: theme.modes.light.background }}
              />
            </div>

            <div className="flex items-center justify-between gap-1">
              <span className="text-[13px] font-bold text-foreground truncate">
                {theme.name}
              </span>
              {value === theme.id && (
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-foreground/20" />
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">
                L/D Support
              </span>
            </div>
          </button>
        ))}
      </div>

      {!showAll && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAll(true)}
          className="w-full sm:w-auto h-11 rounded-xl text-sm font-bold gap-2"
        >
          View all themes <ChevronDown className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
