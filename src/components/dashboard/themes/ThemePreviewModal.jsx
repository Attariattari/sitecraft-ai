"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { WEBSITE_THEMES } from "@/lib/themes/presets";

export function ThemePreviewModal({ theme, isOpen, onClose, onUseTheme, isLoading }) {
  if (!theme || !isOpen) return null;

  const presetTheme = WEBSITE_THEMES[theme.slug] || WEBSITE_THEMES[theme.themeId];
  if (!presetTheme) return null;

  const lightMode = presetTheme.modes.light;
  const darkMode = presetTheme.modes.dark;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg">{theme.name}</h2>
            <p className="text-sm text-gray-600">{theme.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Light Mode Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Light Mode</h3>
            <div
              className="rounded-lg border overflow-hidden"
              style={{ backgroundColor: lightMode.background }}
            >
              {/* Hero Section */}
              <div
                className="px-8 py-12 text-center"
                style={{ backgroundColor: lightMode.softBackground }}
              >
                <h1
                  className="text-3xl font-bold mb-2"
                  style={{ color: lightMode.primary }}
                >
                  {theme.name}
                </h1>
                <p style={{ color: lightMode.mutedText }}>
                  Professional theme for your website
                </p>
              </div>

              {/* Card Section */}
              <div className="p-8 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: lightMode.background,
                      borderColor: lightMode.border,
                    }}
                  >
                    <div
                      className="h-3 rounded mb-3"
                      style={{
                        backgroundColor: lightMode.primary,
                        width: `${60 + i * 10}%`,
                      }}
                    />
                    <div
                      className="h-2 rounded mb-2"
                      style={{
                        backgroundColor: lightMode.mutedText,
                        width: "80%",
                      }}
                    />
                    <div
                      className="h-2 rounded"
                      style={{
                        backgroundColor: lightMode.border,
                        width: "60%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Button Section */}
              <div className="px-8 py-6 flex gap-3">
                <button
                  className="px-6 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: lightMode.primary }}
                >
                  Primary Action
                </button>
                <button
                  className="px-6 py-2 rounded font-medium border"
                  style={{
                    color: lightMode.primary,
                    borderColor: lightMode.primary,
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div className="flex gap-2">
              {[
                lightMode.primary,
                lightMode.secondary,
                lightMode.accent,
                lightMode.background,
              ].map((color, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Dark Mode Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Dark Mode</h3>
            <div
              className="rounded-lg border overflow-hidden"
              style={{ backgroundColor: darkMode.background }}
            >
              {/* Hero Section */}
              <div
                className="px-8 py-12 text-center"
                style={{ backgroundColor: darkMode.softBackground }}
              >
                <h1
                  className="text-3xl font-bold mb-2"
                  style={{ color: darkMode.primary }}
                >
                  {theme.name}
                </h1>
                <p style={{ color: darkMode.mutedText }}>
                  Professional theme for your website
                </p>
              </div>

              {/* Card Section */}
              <div className="p-8 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: darkMode.background,
                      borderColor: darkMode.border,
                    }}
                  >
                    <div
                      className="h-3 rounded mb-3"
                      style={{
                        backgroundColor: darkMode.primary,
                        width: `${60 + i * 10}%`,
                      }}
                    />
                    <div
                      className="h-2 rounded mb-2"
                      style={{
                        backgroundColor: darkMode.mutedText,
                        width: "80%",
                      }}
                    />
                    <div
                      className="h-2 rounded"
                      style={{
                        backgroundColor: darkMode.border,
                        width: "60%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Button Section */}
              <div className="px-8 py-6 flex gap-3">
                <button
                  className="px-6 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: darkMode.primary }}
                >
                  Primary Action
                </button>
                <button
                  className="px-6 py-2 rounded font-medium border"
                  style={{
                    color: darkMode.primary,
                    borderColor: darkMode.primary,
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div className="flex gap-2">
              {[
                darkMode.primary,
                darkMode.secondary,
                darkMode.accent,
                darkMode.background,
              ].map((color, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onUseTheme(theme.themeId)} disabled={isLoading}>
            {isLoading ? "Setting..." : "Use This Theme"}
          </Button>
        </div>
      </div>
    </>
  );
}
