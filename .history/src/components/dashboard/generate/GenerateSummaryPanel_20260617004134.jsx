"use client";

import React from "react";
import {
  CheckCircle2,
  Circle,
  Layout,
  Palette,
  Zap,
  Sparkles,
} from "lucide-react";

export function GenerateSummaryPanel({ formData, steps }) {
  const {
    fullName,
    profession,
    websiteGoal,
    themeKey,
    skills = [],
    projects = [],
  } = formData;

  const currentStepIndex = steps.findIndex((s) => s.active); // Dummy logic placeholder

  const items = [
    { label: "Website Owner", value: fullName, icon: Layout },
    { label: "Profession", value: profession, icon: Zap },
    { label: "Project Goal", value: websiteGoal, icon: Sparkles },
    {
      label: "Skills Count",
      value: skills.length > 0 ? `${skills.length} skills added` : null,
      icon: CheckCircle2,
    },
    {
      label: "Portfolio Items",
      value: projects.length > 0 ? `${projects.length} projects` : null,
      icon: Layout,
    },
    { label: "Selected Theme", value: themeKey, icon: Palette },
  ];

  const completedCount = items.filter((i) => !!i.value).length;
  const totalCount = items.length;

  return (
    <div className="bg-muted/30 border border-border/40 rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Configuration Summary
        </h3>
        <span className="text-[10px] font-black text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
          {completedCount}/{totalCount}
        </span>
      </div>

      <div className="space-y-4 flex-1">
        {items.map((item, idx) => (
          <div key={idx} className="group">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-4 h-4 shrink-0 transition-colors ${item.value ? "text-primary" : "text-muted-foreground/30"}`}
              >
                <item.icon className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                  {item.label}
                </p>
                <p
                  className={`text-xs font-bold truncate ${item.value ? "text-foreground" : "text-muted-foreground/40 italic"}`}
                >
                  {item.value || "Not set yet"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 mt-6 border-t border-border/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold text-muted-foreground">
            Generation Cost
          </span>
          <span className="text-[11px] font-black text-foreground">
            1 Credit
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
          <Zap className="w-4 h-4 text-primary" />
          <div className="text-[10px] text-primary font-bold leading-snug">
            SEO & Theme variables will be auto-generated.
          </div>
        </div>
      </div>
    </div>
  );
}
