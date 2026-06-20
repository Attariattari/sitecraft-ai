"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/lib/themes/ThemeProvider";
import { WEBSITE_THEMES } from "@/lib/themes/presets";
import { Button } from "@/components/ui/button";

export function ThemePreview({ children }) {
  const [activeTheme, setActiveTheme] = useState("emerald");

  return (
    <div className="flex flex-col h-full w-full">
      {/* Theme Selector Bar */}
      <div className="bg-white border-b border-border p-4 shadow-sm z-50 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-sm text-foreground">
            Template Theme:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {Object.values(WEBSITE_THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 transition-all min-w-[70px] ${
                  activeTheme === theme.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-soft"
                }`}
                title={theme.name}
              >
                <div className="flex h-5 w-full rounded overflow-hidden border border-border/50">
                  <div
                    className="flex-1"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div
                    className="flex-1"
                    style={{ backgroundColor: theme.colors.accent }}
                  ></div>
                  <div
                    className="flex-1"
                    style={{ backgroundColor: theme.colors.background }}
                  ></div>
                </div>
                <span className="text-[10px] whitespace-nowrap text-foreground font-medium truncate max-w-[60px]">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template Preview Area (Uses ThemeProvider to scope variables) */}
      <div className="flex-1 bg-zinc-100 overflow-y-auto w-full relative">
        <ThemeProvider
          themeKey={activeTheme}
          className="min-h-full w-full bg-[var(--template-background)]"
        >
          {typeof children === "function" ? children() : children}
        </ThemeProvider>
      </div>
    </div>
  );
}
