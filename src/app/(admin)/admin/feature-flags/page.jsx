"use client";

import { useState } from "react";
import { Flag, Plus, AlertTriangle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const initialFlags = [
  { key: "ai_generation_enabled", name: "AI Generation", description: "Enable AI website generation for all users.", enabled: true, audience: "All Users" },
  { key: "pro_plan_signup", name: "Pro Plan Signup", description: "Allow new users to subscribe to the Pro plan.", enabled: true, audience: "All Users" },
  { key: "agency_plan_signup", name: "Agency Plan Signup", description: "Allow new users to subscribe to the Agency plan.", enabled: true, audience: "All Users" },
  { key: "maintenance_mode", name: "Maintenance Mode", description: "Put the platform into read-only maintenance mode.", enabled: false, audience: "All Users" },
  { key: "new_template_engine", name: "New Template Engine", description: "Roll out the redesigned template rendering system.", enabled: false, audience: "Beta Users" },
  { key: "ai_image_generation", name: "AI Image Generation", description: "Enable AI-generated images within websites (experimental).", enabled: false, audience: "Pro+" },
  { key: "team_collaboration", name: "Team Collaboration", description: "Allow multiple users to manage a single website.", enabled: false, audience: "Agency+" },
  { key: "custom_domains", name: "Custom Domains", description: "Allow users to connect their own domain names.", enabled: true, audience: "Pro+" },
];

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState(initialFlags);

  const toggle = (key) => {
    setFlags((prev) => prev.map((f) => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  const enabledCount = flags.filter((f) => f.enabled).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Feature Flags"
        description="Enable or disable platform features globally. Changes take effect immediately."
        route="/admin/feature-flags"
        badge="System"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          New Flag
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Flag} label="Total Flags" value={String(flags.length)} sub="All feature flags" />
        <AdminStatCard icon={Flag} label="Enabled" value={String(enabledCount)} sub="Currently active" iconClass="bg-emerald-500" />
        <AdminStatCard icon={Flag} label="Disabled" value={String(flags.length - enabledCount)} sub="Inactive features" iconClass="bg-muted" />
        <AdminStatCard icon={AlertTriangle} label="Beta Flags" value={String(flags.filter(f => f.audience === "Beta Users").length)} sub="In testing" iconClass="bg-amber-500" />
      </div>

      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
            Feature flags are stored as UI state only. Connect to backend to persist changes.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">All Feature Flags</h2>
          </div>
          <span className="text-xs text-muted-foreground">{flags.length} flags</span>
        </div>
        <div className="divide-y divide-border/50">
          {flags.map((flag) => (
            <div key={flag.key} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-foreground">{flag.name}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-bold">{flag.audience}</span>
                </div>
                <p className="text-xs text-muted-foreground">{flag.description}</p>
                <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">{flag.key}</p>
              </div>
              <button
                onClick={() => toggle(flag.key)}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${flag.enabled ? "bg-primary" : "bg-muted border border-border"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${flag.enabled ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
