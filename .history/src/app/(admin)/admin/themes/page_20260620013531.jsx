"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import {
  Palette,
  MoreHorizontal,
  RefreshCcw,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  Zap,
  AlertCircle,
  PenTool,
  Save,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Dropdown per-row ─────────────────────────────────────── */
function ThemeActionsMenu({ theme, onEdit, onToggleActive, onSeed }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit(theme);
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
          >
            <PenTool className="w-3.5 h-3.5 text-primary" />
            Quick Edit
          </button>

          {/* Toggle Active */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onToggleActive(theme);
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
          >
            {theme.isActive ? (
              <ToggleLeft className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ToggleRight className="w-3.5 h-3.5 text-emerald-500" />
            )}
            {theme.isActive ? "Deactivate" : "Activate"}
          </button>

          {/* Import to DB (only if unsaved) */}
          {!theme._id && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSeed();
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold hover:bg-amber-500/10 text-amber-500 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Import to DB
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Edit Modal ───────────────────────────────────────────── */
function EditThemeModal({ theme, onClose, onSave }) {
  const [form, setForm] = useState({ ...theme });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form._id) {
      toast.error("Import this theme to DB first before editing.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/themes/${form.themeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: form.isActive,
          isAvailable: form.isAvailable,
          isLocked: form.isLocked,
          showOnHome: form.showOnHome,
          showInGenerate: form.showInGenerate,
          showInDashboard: form.showInDashboard,
          lockedReason: form.lockedReason,
          sortOrder: form.sortOrder,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Theme updated!");
        onSave(data.theme);
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to save theme.");
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ label, field }) => (
    <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-border hover:bg-muted/50 transition-all">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => setForm((f) => ({ ...f, [field]: !f[field] }))}
        className={cn(
          "w-11 h-6 rounded-full relative transition-all",
          form[field] ? "bg-primary" : "bg-muted",
        )}
      >
        <div
          className={cn(
            "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
            form[field] ? "left-6" : "left-1",
          )}
        />
      </button>
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <PenTool className="w-4 h-4 text-primary" />
              Edit: {form.label || form.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              ID: {form.themeId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <XCircle className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-2">
          <Toggle label="Active" field="isActive" />
          <Toggle label="Available to Users" field="isAvailable" />
          <Toggle label="Locked" field="isLocked" />
          <Toggle label="Show on Home" field="showOnHome" />
          <Toggle label="Show in Generate" field="showInGenerate" />
          <Toggle label="Show in Dashboard" field="showInDashboard" />
        </div>

        {/* Locked Reason */}
        {form.isLocked && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Lock Reason
            </label>
            <select
              value={form.lockedReason || "Coming soon"}
              onChange={(e) =>
                setForm((f) => ({ ...f, lockedReason: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 text-sm font-semibold outline-none"
            >
              <option>Coming soon</option>
              <option>Roadmap</option>
              <option>Planned</option>
              <option>Under Review</option>
              <option>Premium only</option>
            </select>
          </div>
        )}

        {/* Sort Order */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Sort Order
          </label>
          <input
            type="number"
            value={form.sortOrder || 0}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                sortOrder: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 text-sm font-semibold outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !form._id}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {!form._id && (
          <p className="text-xs text-amber-500 text-center">
            ⚠️ This theme is not in DB yet. Import it first to enable edits.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function AdminThemesPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const { confirm, ConfirmDialog } = useConfirm();

  const fetchThemes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/themes");
      const data = await res.json();
      if (data.success) {
        setThemes(data.themes);
      } else {
        toast.error("Failed to fetch themes.");
      }
    } catch {
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

  const handleSeed = async () => {
    const ok = await confirm({
      title: "Import Themes to Database",
      description:
        "This will sync all local theme presets into the database. Existing records will NOT be overwritten — only missing themes will be added.",
      confirmText: "Yes, Import",
      cancelText: "Cancel",
      variant: "warning",
    });
    if (!ok) return;
    try {
      const res = await fetch("/api/admin/themes/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchThemes();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to seed themes");
    }
  };

  const toggleField = async (themeId, dbId, field, currentValue) => {
    if (!dbId) {
      toast.error("Import this theme to DB first.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/themes/${themeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      const data = await res.json();
      if (data.success) {
        setThemes((ths) =>
          ths.map((t) => (t.themeId === themeId ? data.theme : t)),
        );
        toast.success("Theme updated.");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleEditSave = (updated) => {
    setThemes((ths) =>
      ths.map((t) => (t.themeId === updated.themeId ? updated : t)),
    );
  };

  const missingCount = themes.filter((t) => !t._id).length;

  return (
    <div className="space-y-8">
      <ConfirmDialog />
      {/* ─ Unsynchronized banner ─ */}
      {missingCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-500">
              {missingCount} Unsynchronized Local Theme
              {missingCount > 1 ? "s" : ""}
            </h4>
            <p className="text-xs text-amber-600/80 mt-0.5">
              These exist in code but not in DB. Click "Import Themes" to add
              them and unlock controls.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSeed}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shrink-0"
          >
            Import Missing
          </button>
        </div>
      )}

      {/* ─ Header ─ */}
      <AdminPageHeader
        title="Themes Management"
        description="Manage dynamic platform theme presets, lock states, and visibility."
        route="/admin/themes"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-all disabled:opacity-50"
          >
            <RefreshCcw
              className={cn("w-5 h-5", refreshing && "animate-spin")}
            />
          </button>
          <button
            type="button"
            onClick={handleSeed}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Import Themes
          </button>
        </div>
      </AdminPageHeader>

      {/* ─ Stats ─ */}
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

      {/* ─ Table ─ */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card">
          <RefreshCcw className="w-8 h-8 animate-spin mb-4 opacity-40" />
          <p className="font-bold">Loading themes…</p>
        </div>
      ) : themes.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card">
          <AlertCircle className="w-10 h-10 mb-4 opacity-30" />
          <p className="font-bold text-lg">No themes found</p>
          <p className="text-sm">Click "Import Themes" to sync presets.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-black text-muted-foreground uppercase tracking-widest bg-muted/20">
                <th className="px-5 py-4">Theme</th>
                <th className="px-5 py-4">Status Toggles</th>
                <th className="px-5 py-4 text-center">Visibility</th>
                <th className="px-5 py-4 text-center">Uses</th>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {themes.map((t) => (
                <tr
                  key={t.themeId}
                  className={cn(
                    "transition-colors hover:bg-muted/20",
                    !t._id && "opacity-70 bg-amber-500/5",
                  )}
                >
                  {/* Theme info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border",
                          t._id
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-muted border-border text-muted-foreground",
                        )}
                      >
                        <Palette className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {t.label || t.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/50">
                            {t.themeId}
                          </span>
                          {!t._id && (
                            <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full uppercase font-black">
                              Unsaved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Toggles */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          toggleField(t.themeId, t._id, "isActive", t.isActive)
                        }
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all",
                          t.isActive
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                            : "bg-muted border-border text-muted-foreground",
                          !t._id &&
                            "opacity-40 cursor-not-allowed pointer-events-none",
                        )}
                      >
                        {t.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleField(
                            t.themeId,
                            t._id,
                            "isAvailable",
                            t.isAvailable,
                          )
                        }
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all",
                          t.isAvailable
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                            : "bg-muted border-border text-muted-foreground",
                          !t._id &&
                            "opacity-40 cursor-not-allowed pointer-events-none",
                        )}
                      >
                        {t.isAvailable ? "Available" : "Restricted"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleField(t.themeId, t._id, "isLocked", t.isLocked)
                        }
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all flex items-center gap-1",
                          t.isLocked
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                            : "bg-muted border-border text-muted-foreground",
                          !t._id &&
                            "opacity-40 cursor-not-allowed pointer-events-none",
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

                  {/* Visibility icons */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleField(
                            t.themeId,
                            t._id,
                            "showOnHome",
                            t.showOnHome,
                          )
                        }
                        title="Show on Home"
                        disabled={!t._id}
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center border transition-all",
                          t.showOnHome
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-transparent border-transparent text-muted-foreground/30 hover:bg-muted",
                          !t._id && "opacity-30 cursor-not-allowed",
                        )}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleField(
                            t.themeId,
                            t._id,
                            "showInGenerate",
                            t.showInGenerate,
                          )
                        }
                        title="Show in Generator"
                        disabled={!t._id}
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center border transition-all",
                          t.showInGenerate
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-transparent border-transparent text-muted-foreground/30 hover:bg-muted",
                          !t._id && "opacity-30 cursor-not-allowed",
                        )}
                      >
                        <Palette className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Usage */}
                  <td className="px-5 py-4 text-center">
                    <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-muted font-black text-xs">
                      {t.usageCount || 0}
                    </span>
                  </td>

                  {/* Sort order */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-black text-muted-foreground">
                      {t.sortOrder || 0}
                    </span>
                  </td>

                  {/* 3-dot actions */}
                  <td className="px-5 py-4 text-right">
                    <ThemeActionsMenu
                      theme={t}
                      onEdit={setEditingTheme}
                      onToggleActive={() =>
                        toggleField(t.themeId, t._id, "isActive", t.isActive)
                      }
                      onSeed={handleSeed}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─ Edit Modal ─ */}
      {editingTheme && (
        <EditThemeModal
          theme={editingTheme}
          onClose={() => setEditingTheme(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
