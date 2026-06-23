"use client";

import React from "react";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSelectionCard({
  theme,
  isSelected,
  isLocked,
  isInactive,
  onPreview,
}) {
  const getColors = () => {
    if (theme.tokens?.light?.primary) {
      return {
        primary: theme.tokens.light.primary,
        secondary: theme.tokens.light.secondary || theme.tokens.light.softBackground,
        accent: theme.tokens.light.accent,
      };
    }
    if (theme.colors) {
      return {
        primary: theme.colors.primary || "#000",
        secondary: theme.colors.secondary || "#666",
        accent: theme.colors.accent || "#999",
      };
    }
    return { primary: "#e5e7eb", secondary: "#d1d5db", accent: "#9ca3af" };
  };

  const colors = getColors();

  return (
    <button
      onClick={onPreview}
      disabled={isLocked || isInactive}
      className={cn(
        "relative group h-full rounded-xl border overflow-hidden transition-all duration-300 text-left",
        "hover:shadow-lg hover:border-primary",
        isSelected
          ? "border-primary bg-primary/10 shadow-lg"
          : "border-border bg-card hover:shadow-lg",
        (isLocked || isInactive) && "opacity-60 cursor-not-allowed hover:shadow-none hover:border-border"
      )}
    >
      {/* Color Preview Bar */}
      <div className="h-20 bg-gradient-to-r flex rounded-t-xl overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`
        }}
      />

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-foreground text-sm leading-tight">
              {theme.name || theme.label}
            </h3>
            {isSelected && (
              <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
            {isLocked && (
              <div className="flex-shrink-0 bg-amber-500 text-white rounded-full p-1">
                <Lock className="w-3 h-3" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
            {theme.description || "Theme description"}
          </p>
        </div>

        {/* Color Dots */}
        <div className="flex gap-2 pt-1">
          {[colors.primary, colors.secondary, colors.accent].map((color, idx) => (
            <div
              key={idx}
              className="w-3 h-3 rounded-full border border-border shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {theme.isActive && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
              Active
            </span>
          )}
          {theme.isAvailable && (
            <span className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
              Available
            </span>
          )}
          {isLocked && (
            <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
              {theme.lockedReason || "Locked"}
            </span>
          )}
        </div>

        {/* Selection Info */}
        {isSelected && (
          <div className="pt-2 border-t border-border text-xs font-medium text-primary">
            Selected platform theme
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
    </button>
  );
}
