"use client";

import React from "react";
import { Check, Layout, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

import { siteCraftTemplates } from "@/lib/data";
import { getCategoryTemplates } from "@/lib/accountPurposeResolver";

export function TemplateSelector({
  value,
  onChange,
  accountPurpose = "portfolio",
}) {
  const templates = getCategoryTemplates(accountPurpose);
  // Optional: slice to top 3 or 6 to keep UI clean, but let's show all available or just top 3
  const displayTemplates =
    templates.length > 0
      ? templates.slice(0, 3)
      : siteCraftTemplates.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {displayTemplates.map((tpl) => (
        <button
          key={tpl.id}
          type="button"
          onClick={() => onChange(tpl.id)}
          className={cn(
            "relative flex flex-col p-6 rounded-2xl border-2 text-left transition-all duration-200 group",
            value === tpl.id
              ? "bg-primary/5 border-primary shadow-[0_4px_20px_rgba(16,185,129,0.1)]"
              : "bg-card border-border/50 hover:border-primary/30",
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                value === tpl.id
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground group-hover:text-primary",
              )}
            >
              <Layout className="w-6 h-6" />
            </div>
            {value === tpl.id && (
              <div className="bg-primary text-white p-1 rounded-full shadow-sm">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-bold text-foreground mb-1">
              {tpl.name}
            </h4>
            <p className="text-sm text-muted-foreground leading-snug">
              {tpl.desc}
            </p>
          </div>

          <div className="mt-auto">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
              {tpl.bestFor}
            </span>
          </div>

          {/* Simple Mock Preview Overlay on selection */}
          {value === tpl.id && (
            <div className="absolute inset-x-0 -bottom-1 h-1 bg-primary rounded-b-2xl" />
          )}
        </button>
      ))}
    </div>
  );
}
