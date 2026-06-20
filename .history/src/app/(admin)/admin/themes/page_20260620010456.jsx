"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Palette,
  Plus,
  MoreHorizontal,
  RefreshCcw,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  Zap,
  AlertCircle,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminThemesPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchThemes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/themes");
      const data = await res.json();
      if (data.success) {
        setThemes(data.themes);
      } else {
        toast.error("Failed to fetch themes.");
      }
    } catch (err) {
      toast.error("Network error fetching themes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchThemes();
  };

  const toggleStatus = async (id, field, currentValue) => {
    try {
      const res = await fetch(`/api/admin/themes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      const data = await res.json();
      if (data.success) {
        setThemes((ths) => ths.map((t) => (t.themeId === id ? data.theme : t)));
        toast.success(`Theme updated successfully.`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update theme status");
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Themes Management"
        description="Manage dynamic platform theme presets, lock states, and visibility availability."
        route="/admin/themes"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-all disabled:opacity-50"
          >
            <RefreshCcw
              className={cn("w-5 h-5", refreshing && "animate-spin")}
            />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            Add New Theme
          </button>
        </div>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Palette}
          label="Total Themes"
          value={themes.length.toString()}
          sub="All records"
        />
        <AdminStatCard
          icon={CheckCircle2}
          label="Active"
          value={themes.filter((t) => t.isActive).length.toString()}
          sub="Platform wide"
          iconClass="text-emerald-500 bg-emerald-500/10"
        />
        <AdminStatCard
          icon={Lock}
          label="Locked"
          value={themes.filter((t) => t.isLocked).length.toString()}
          sub="User restricted"
          iconClass="text-amber-500 bg-amber-500/10"
        />
        <AdminStatCard
          icon={Zap}
          label="Total Uses"
          value={themes.reduce((a, t) => a + (t.usageCount || 0), 0).toString()}
          sub="Across all sites"
          iconClass="text-blue-500 bg-blue-500/10"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center text-muted-foreground border border-border border-dashed rounded-2xl bg-card">
            <RefreshCcw className="w-8 h-8 animate-spin mb-4 opacity-50" />
            <p className="font-bold">Loading themes...</p>
          </div>
        ) : themes.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-muted-foreground border border-border border-dashed rounded-2xl bg-card">
            <AlertCircle className="w-10 h-10 mb-4 opacity-30" />
            <p className="font-bold text-lg">No themes found in database</p>
            <p className="text-sm">
              Themes will auto-seed or add them manually.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-black text-muted-foreground uppercase tracking-widest bg-muted/20">
                  <th className="px-4 py-4">Theme Details</th>
                  <th className="px-4 py-4">Toggles</th>
                  <th className="px-4 py-4 text-center">Visibility Targets</th>
                  <th className="px-4 py-4 text-center">Usage</th>
                  <th className="px-4 py-4">Order</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {themes.map((t) => (
                  <tr
                    key={t.themeId}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {t.label || t.name}
                          </p>
                          <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/60">
                            ID: {t.themeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() =>
                            toggleStatus(t.themeId, "isActive", t.isActive)
                          }
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all",
                            t.isActive
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"
                              : "bg-muted border-border text-muted-foreground hover:bg-muted-foreground/10",
                          )}
                        >
                          {t.isActive ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() =>
                            toggleStatus(
                              t.themeId,
                              "isAvailable",
                              t.isAvailable,
                            )
                          }
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all",
                            t.isAvailable
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500/20"
                              : "bg-muted border-border text-muted-foreground hover:bg-muted-foreground/10",
                          )}
                        >
                          {t.isAvailable ? "Available" : "Restricted"}
                        </button>
                        <button
                          onClick={() =>
                            toggleStatus(t.themeId, "isLocked", t.isLocked)
                          }
                          className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all flex items-center gap-1",
                            t.isLocked
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20"
                              : "bg-muted border-border text-muted-foreground hover:bg-muted-foreground/10",
                          )}
                        >
                          {t.isLocked ? (
                            <Lock className="w-2.5 h-2.5" />
                          ) : (
                            <Unlock className="w-2.5 h-2.5" />
                          )}
                          {t.isLocked ? "Locked" : "Unlocked"}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            toggleStatus(t.themeId, "showOnHome", t.showOnHome)
                          }
                          className={cn(
                            "w-7 h-7 rounded flex items-center justify-center border transition-all",
                            t.showOnHome
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : "bg-transparent border-transparent text-muted-foreground hover:bg-muted",
                          )}
                          title="Show on Home Showcase"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            toggleStatus(
                              t.themeId,
                              "showInGenerate",
                              t.showInGenerate,
                            )
                          }
                          className={cn(
                            "w-7 h-7 rounded flex items-center justify-center border transition-all",
                            t.showInGenerate
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : "bg-transparent border-transparent text-muted-foreground hover:bg-muted",
                          )}
                          title="Show in Editor form"
                        >
                          <Palette className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted font-black text-xs text-foreground">
                        {t.usageCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-black text-muted-foreground">
                        {t.sortOrder || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
