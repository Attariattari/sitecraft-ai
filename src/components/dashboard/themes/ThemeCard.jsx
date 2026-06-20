"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Check } from "lucide-react";
import { WEBSITE_THEMES } from "@/lib/themes/presets";

export function ThemeCard({ theme, isRecommended, isDefault, onPreview, onUseTheme, isLoading }) {
  const presetTheme = WEBSITE_THEMES[theme.slug] || WEBSITE_THEMES[theme.themeId];
  const lightMode = presetTheme?.modes?.light;

  if (!lightMode) return null;

  return (
    <div className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Theme Preview */}
      <div
        className="aspect-video relative overflow-hidden bg-gradient-to-br"
        style={{
          background: `linear-gradient(135deg, ${lightMode.primary} 0%, ${lightMode.secondary} 100%)`,
        }}
      >
        {/* Mockup content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div
              className="h-6 rounded"
              style={{
                backgroundColor: lightMode.background,
                opacity: 0.9,
                width: "60%",
              }}
            />
            <div
              className="h-3 rounded"
              style={{
                backgroundColor: lightMode.background,
                opacity: 0.7,
                width: "80%",
              }}
            />
          </div>
          <div className="flex gap-2">
            <div
              className="px-3 py-1 rounded text-sm font-medium"
              style={{
                backgroundColor: lightMode.accent,
                color: lightMode.background,
              }}
            >
              Action
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onPreview(theme)}
            className="gap-1"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isRecommended && (
            <div className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
              AI Recommended
            </div>
          )}
          {isDefault && (
            <div className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded flex gap-1 items-center">
              <Check className="w-3 h-3" />
              Default
            </div>
          )}
        </div>
      </div>

      {/* Theme Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1">{theme.name}</h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {theme.description}
        </p>

        {/* Color dots */}
        <div className="flex gap-2 mb-4">
          {[
            lightMode.primary,
            lightMode.secondary,
            lightMode.accent,
          ].map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUseTheme(theme.themeId)}
          disabled={isLoading || isDefault}
          className="w-full"
        >
          {isDefault ? "Default Theme" : isLoading ? "Setting..." : "Use Theme"}
        </Button>
      </div>
    </div>
  );
}
