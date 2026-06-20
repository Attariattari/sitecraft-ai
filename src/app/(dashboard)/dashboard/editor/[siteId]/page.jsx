"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  LayoutTemplate,
  Palette,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { toast } from "@/components/dashboard/Toast";

// Simple editor for now (MVP)
export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // In a real app we would load the site data and allow inline editing
  // Let's create an MVP interface structure

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate save
      await new Promise((r) => setTimeout(r, 1000));
      toast("Changes saved successfully!");
    } catch {
      toast("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Editor Topbar */}
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/sites/${params.siteId}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-bold truncate max-w-[200px]">
            Site Editor
          </h1>
          <span className="site-badge-emerald text-[10px]">Beta</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`/preview/${params.siteId}`, "_blank")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="site-primary-button flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
          >
            {saving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Changes
          </button>
        </div>
      </header>

      {/* Editor Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Sections) */}
        <div className="w-64 border-r border-border bg-card overflow-y-auto hidden md:block">
          <div className="p-4 border-b border-border">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Sections
            </h2>
          </div>
          <nav className="p-2 space-y-1">
            {[
              "Hero",
              "About",
              "Skills",
              "Services",
              "Projects",
              "CTA",
              "Contact",
              "SEO",
            ].map((section, i) => (
              <button
                key={section}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Edit Area */}
        <div className="flex-1 overflow-y-auto bg-muted/30 p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Edit3 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                Visual Editor Coming Soon
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Full visual editing capabilities are currently under
                development. You will soon be able to edit generated content
                directly here.
              </p>
            </div>

            <DashboardCard>
              <h3 className="text-sm font-semibold mb-4">Quick Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Theme Preset
                  </label>
                  <div className="flex items-center gap-2">
                    <select className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary">
                      <option>Emerald</option>
                      <option>Ocean</option>
                      <option>Midnight</option>
                    </select>
                    <button className="h-9 px-3 rounded-md border border-border bg-muted/50 text-xs font-medium whitespace-nowrap">
                      Change Theme
                    </button>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Right Sidebar (Mini Preview/Settings) */}
        <div className="w-80 border-l border-border bg-card overflow-y-auto hidden xl:block p-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Live Preview
          </h2>
          <div className="aspect-[9/16] rounded-xl border border-border bg-muted/30 flex items-center justify-center relative overflow-hidden shadow-inner">
            <p className="text-xs text-muted-foreground font-medium">
              Mini Preview
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
