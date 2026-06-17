"use client";

import React from "react";
import { CheckCircle2, Zap, Layout, Palette, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GenerateSummaryCard({ formData, isPending, onGenerate }) {
  const { fullName, websiteTitle, description, templateId, themeKey } =
    formData;

  const steps = [
    {
      label: "Website Info",
      ready: !!fullName && !!websiteTitle && !!description,
      icon: FileText,
    },
    { label: "Template", ready: !!templateId, icon: Layout },
    { label: "Theme", ready: !!themeKey, icon: Palette },
  ];

  const readyCount = steps.filter((s) => s.ready).length;
  const isReady = readyCount === steps.length;

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl p-6 sticky top-24">
      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">
        Generation Summary
      </h3>

      <div className="space-y-4 mb-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${step.ready ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/50"}`}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <span
                className={`text-sm font-bold ${step.ready ? "text-foreground" : "text-muted-foreground/60"}`}
              >
                {step.label}
              </span>
            </div>
            {step.ready && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase text-muted-foreground">
              Generation Cost
            </span>
            <span className="text-lg font-black text-foreground">1 Credit</span>
          </div>
          <Zap className="w-6 h-6 text-primary fill-primary/20" />
        </div>

        <Button
          onClick={onGenerate}
          disabled={!isReady || isPending}
          className="w-full h-14 rounded-xl text-md font-bold shadow-lg shadow-primary/20 site-primary-button gap-2"
        >
          {isPending ? "Generating..." : "Generate My Website"}
        </Button>
        <p className="mt-4 text-[12px] text-center text-muted-foreground font-medium leading-normal">
          AI will create your website content, SEO structure, template layout,
          and preview.
        </p>
      </div>
    </div>
  );
}
