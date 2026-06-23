"use client";

import React, { useState } from "react";
import { X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSelectionModal({ 
  theme, 
  isOpen, 
  onClose, 
  onSelectTheme,
  selectedThemeId
}) {
  const [selectedMode, setSelectedMode] = useState("light");

  if (!isOpen || !theme) return null;

  const lightColors = theme.tokens?.light || theme.colors || {};
  const darkColors = theme.tokens?.dark || theme.colors || {};
  const currentColors = selectedMode === "light" ? lightColors : darkColors;

  const isSelected = selectedThemeId === theme.themeId;

  const handleSelectTheme = () => {
    onSelectTheme(theme.themeId, selectedMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-background text-foreground px-8 py-6 flex items-center justify-between border-b border-border">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{theme.name || theme.label}</h2>
            <p className="text-muted-foreground text-sm mt-1">{theme.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Mode Selector */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-muted-foreground mb-4">Preview Mode</p>
            <div className="inline-flex gap-2 bg-muted p-1 rounded-lg">
              {["light", "dark"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all",
                    selectedMode === mode
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode === "light" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                </button>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-muted-foreground mb-4">Theme Preview</p>
            <div
              className="rounded-xl p-12 border-2"
              style={{
                backgroundColor: currentColors.background || (selectedMode === "light" ? "#ffffff" : "#020617"),
                borderColor: currentColors.border || "var(--border)",
                color: currentColors.text || currentColors.foreground || (selectedMode === "light" ? "#0f172a" : "#f8fafc"),
              }}
            >
              {/* Sample UI */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 pb-6 border-b" 
                  style={{ 
                    borderColor: selectedMode === "light" ? currentColors.border || "#e5e7eb" : "#374151" 
                  }}>
                  <div 
                    className="w-10 h-10 rounded-lg"
                    style={{ backgroundColor: currentColors.primary || "#000" }}
                  />
                  <div className="flex-1">
                    <div 
                      className="h-3 rounded w-32"
                      style={{ backgroundColor: currentColors.primary || "#000" }}
                    />
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                      <div 
                        className="h-4 rounded w-full"
                        style={{ backgroundColor: currentColors.primary || "#000" }}
                      />
                      <div 
                        className="h-3 rounded w-full opacity-70"
                        style={{ backgroundColor: currentColors.secondary || "#666" }}
                      />
                      <div 
                        className="h-3 rounded w-2/3 opacity-50"
                        style={{ backgroundColor: currentColors.mutedText || "#999" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                  <button 
                    className="px-6 py-3 rounded-lg font-medium"
                    style={{
                      backgroundColor: currentColors.primary || "#000",
                      color: currentColors.primaryForeground || "#fff",
                    }}
                  >
                    Primary
                  </button>
                  <button 
                    className="px-6 py-3 rounded-lg font-medium"
                    style={{ 
                      backgroundColor: currentColors.accent || "#f97316",
                      color: selectedMode === "light" ? "#000" : "#fff"
                    }}
                  >
                    Accent
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-muted-foreground mb-4">Color Palette</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(currentColors).slice(0, 8).map(([colorName, colorValue]) => (
                <div key={colorName} className="text-center">
                  <div 
                    className="h-20 rounded-lg mb-2 border border-border shadow-sm"
                    style={{ backgroundColor: colorValue || "#e5e7eb" }}
                  />
                  <p className="text-xs font-medium text-muted-foreground capitalize truncate">
                    {colorName}
                  </p>
                  <p className="text-xs text-muted-foreground">{colorValue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end border-t border-border pt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectTheme}
              className={cn(
                "px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-colors flex items-center gap-2 hover:opacity-90",
                isSelected && "opacity-80"
              )}
            >
              {isSelected
                ? `Use ${selectedMode} Mode`
                : selectedThemeId
                  ? `Replace With ${selectedMode} Mode`
                  : `Select ${selectedMode} Mode`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
