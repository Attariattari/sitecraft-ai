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
        if (data.success) {
          setDbThemes(data.themes);

          // Re-check if current value is still available
          const isStillAvailable = data.themes.some((t) => t.themeId === value);
          if (!isStillAvailable && data.themes.length > 0) {
            onChange(data.themes[0].themeId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch available themes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();

    // Polling for "realtime" visibility changes
    const interval = setInterval(fetchThemes, 30000);
    return () => clearInterval(interval);
  }, [value, onChange]);

  const allPresets = Object.values(WEBSITE_THEMES);

  // Only show themes that exist in presets AND are active in DB
  const availableThemes = allPresets.filter((preset) =>
    dbThemes.some((dbTheme) => dbTheme.themeId === preset.id),
  );

  // Get recommended theme IDs for the purpose
  const recommendedIds = getRecommendedThemesForPurpose(accountPurpose);

  const recommendedThemes = availableThemes.filter((t) =>
    recommendedIds.includes(t.id),
  );
  const otherThemes = availableThemes.filter(
    (t) => !recommendedIds.includes(t.id),
  );

  const displayThemes = showAll ? availableThemes : recommendedThemes;

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
            onClick={() => onChange(theme.id)}
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
