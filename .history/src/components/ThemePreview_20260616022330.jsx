"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/lib/themes/ThemeProvider";
import { WEBSITE_THEMES } from "@/lib/themes/presets";
import { Moon, Sun } from "lucide-react";

export function ThemePreview({ children }) {
  const [activeTheme, setActiveTheme] = useState("emerald");
  const [activeMode, setActiveMode] = useState("light");

  const currentTheme = WEBSITE_THEMES[activeTheme];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Theme Selector Bar */}
      <div className="bg-white border-b border-border p-4 shadow-sm z-50 flex flex-col lg:flex-row lg:items-center justify-between sticky top-0 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground">
              Template Theme
            </span>
            <span className="text-xs text-secondary-foreground hidden sm:block">
              {currentTheme?.name} - {currentTheme?.categoryFit}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar max-w-[600px] xl:max-w-[800px]">
            {Object.values(WEBSITE_THEMES).map((theme) => {
              const previewColors = theme.modes[activeMode];
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 transition-all min-w-[70px] ${
                    activeTheme === theme.id
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-soft"
                  }`}
                  title={`${theme.name} - ${theme.description}`}
                >
                  <div className="flex h-5 w-full rounded overflow-hidden border border-border/50">
                    <div
                      className="flex-1"
                      style={{ backgroundColor: previewColors.primary }}
                    ></div>
                    <div
                      className="flex-1"
                      style={{ backgroundColor: previewColors.accent }}
                    ></div>
                    <div
                      className="flex-1"
                      style={{ backgroundColor: previewColors.background }}
                    ></div>
                  </div>
                  <span className="text-[10px] whitespace-nowrap text-foreground font-medium truncate max-w-[60px]">
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 bg-soft p-1 rounded-lg border border-border shrink-0 self-start lg:self-auto">
          <button
            onClick={() => setActiveMode("light")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
              activeMode === "light"
                ? "bg-white shadow-sm font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="size-4" />
            Light
          </button>
          <button
            onClick={() => setActiveMode("dark")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
              activeMode === "dark"
                ? "bg-white shadow-sm font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon className="size-4" />
            Dark
          </button>
        </div>
      </div>

      {/* Template Preview Area */}
      <div className="flex-1 bg-zinc-100 overflow-y-auto w-full relative">
        <ThemeProvider
          themeKey={activeTheme}
          mode={activeMode}
          className={`min-h-full w-full bg-[var(--template-background)] ${activeMode === "dark" ? "dark" : ""}`}
        >
          {typeof children === "function" ? children() : children}
        </ThemeProvider>
      </div>
    </div>
  );
}
