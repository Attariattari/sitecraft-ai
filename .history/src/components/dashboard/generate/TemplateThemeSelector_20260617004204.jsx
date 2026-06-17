"use client";

import React from "react";
import { Check, Layout, Zap, Eye, Monitor, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { WEBSITE_THEMES } from "@/lib/themes/presets";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Portfolio",
    desc: "Sleek, clean, high-impact.",
  },
  {
    id: "minimal",
    name: "Minimalist Grid",
    desc: "Focus on content and space.",
  },
  {
    id: "creative",
    name: "Creative Studio",
    desc: "Bold colors and transitions.",
  },
];

export function TemplateThemeSelector({
  selectedTemplate,
  onTemplateSelect,
  selectedTheme,
  onThemeSelect,
  colorMode,
  onColorModeSelect,
}) {
  return (
    <div className="space-y-10">
      {/* 1. Template Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Layout className="w-4 h-4" /> 1. Select Structure
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onTemplateSelect(tpl.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selectedTemplate === tpl.id
                  ? "bg-primary/5 border-primary shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-background border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedTemplate === tpl.id ? "bg-primary text-white" : "bg-muted"}`}
                >
                  <Layout className="w-4 h-4" />
                </div>
                {selectedTemplate === tpl.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
              <p className="text-xs font-black uppercase tracking-wider mb-1">
                {tpl.name}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium leading-tight">
                {tpl.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Color Mode */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Monitor className="w-4 h-4" /> 2. Viewing Mode
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "light", icon: Sun, label: "Light" },
            { id: "dark", icon: Moon, label: "Dark" },
            { id: "system", icon: Monitor, label: "System" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onColorModeSelect(mode.id)}
              className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${
                colorMode === mode.id
                  ? "bg-primary/5 border-primary text-primary"
                  : "bg-background border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <mode.icon className="w-5 h-5 mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {mode.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Theme Preset Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Zap className="w-4 h-4" /> 3. Brand Identity
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {Object.values(WEBSITE_THEMES)
            .slice(0, 12)
            .map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeSelect(theme.id)}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  selectedTheme === theme.id
                    ? "bg-primary/5 border-primary"
                    : "bg-background border-border hover:border-primary/20"
                }`}
              >
                <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden mb-3">
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
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[80px]">
                    {theme.name}
                  </span>
                  {selectedTheme === theme.id && (
                    <Check className="w-3 h-3 text-primary shrink-0" />
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground font-bold italic">
                  {theme.categoryFit}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
