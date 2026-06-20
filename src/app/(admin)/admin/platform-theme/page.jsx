"use client";

import { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { toast } from "sonner";
import { Palette, Save, RotateCcw } from "lucide-react";

const PLATFORM_THEME_OPTIONS = [
  { id: "white-green-orange", name: "White + Green + Orange", description: "Fresh and vibrant" },
  { id: "white-gray", name: "White + Gray", description: "Clean and minimal" },
  { id: "soft-saas", name: "Soft SaaS", description: "Soft and friendly" },
  { id: "dark-slate", name: "Dark Slate", description: "Dark professional" },
  { id: "emerald-dark", name: "Emerald Dark", description: "Dark with emerald accent" },
  { id: "minimal-white", name: "Minimal White", description: "Minimal white theme" },
];

export default function PlatformThemePage() {
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local form state
  const [lightThemeId, setLightThemeId] = useState("");
  const [darkThemeId, setDarkThemeId] = useState("");
  const [defaultMode, setDefaultMode] = useState("system");
  const [allowUserOverride, setAllowUserOverride] = useState(true);

  // Load current setting
  useEffect(() => {
    loadSetting();
  }, []);

  async function loadSetting() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/platform-theme");
      if (res.ok) {
        const data = await res.json();
        if (data.setting) {
          setSetting(data.setting);
          setLightThemeId(data.setting.lightThemeId);
          setDarkThemeId(data.setting.darkThemeId);
          setDefaultMode(data.setting.defaultMode);
          setAllowUserOverride(data.setting.allowUserOverride);
        }
      } else {
        toast.error("Failed to load platform theme setting");
      }
    } catch (error) {
      console.error("Failed to load setting:", error);
      toast.error("Failed to load platform theme setting");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/platform-theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lightThemeId,
          darkThemeId,
          defaultMode,
          allowUserOverride,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSetting(data.setting);
        toast.success("Platform theme updated successfully");
      } else {
        toast.error(data.message || "Failed to save platform theme");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save platform theme");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      "Reset to fallback platform theme? This will set:\n- Light: White + Green + Orange\n- Dark: Dark Slate + Emerald"
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/platform-theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lightThemeId: "white-green-orange",
          darkThemeId: "dark-slate-emerald",
          defaultMode: "system",
          allowUserOverride: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSetting(data.setting);
        setLightThemeId(data.setting.lightThemeId);
        setDarkThemeId(data.setting.darkThemeId);
        setDefaultMode(data.setting.defaultMode);
        setAllowUserOverride(data.setting.allowUserOverride);
        toast.success("Reset to fallback platform theme");
      } else {
        toast.error(data.message || "Failed to reset");
      }
    } catch (error) {
      console.error("Failed to reset:", error);
      toast.error("Failed to reset to fallback");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Platform Theme" description="Manage the default theme for public website and user dashboard" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-block">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <p className="text-gray-600">Loading platform theme settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Platform Theme" description="Manage the default theme for public website and user dashboard" />

      <div className="max-w-4xl mx-auto space-y-8 p-8">
        {/* Current Active Card */}
        {setting && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Current Active Platform Theme</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-600">Light Theme:</span>{" "}
                    <span className="font-medium">{PLATFORM_THEME_OPTIONS.find((t) => t.id === setting.lightThemeId)?.name || setting.lightThemeId}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Dark Theme:</span>{" "}
                    <span className="font-medium">{PLATFORM_THEME_OPTIONS.find((t) => t.id === setting.darkThemeId)?.name || setting.darkThemeId}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Default Mode:</span>{" "}
                    <span className="font-medium capitalize">{setting.defaultMode}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">User Override:</span>{" "}
                    <span className="font-medium">{setting.allowUserOverride ? "Allowed" : "Disabled"}</span>
                  </p>
                </div>
              </div>
              <Palette className="w-8 h-8 text-blue-600 flex-shrink-0" />
            </div>
          </div>
        )}

        {/* Theme Selection */}
        <div className="space-y-6 border rounded-lg p-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Light Theme</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PLATFORM_THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setLightThemeId(theme.id)}
                  className={`p-3 rounded-lg text-left border-2 transition-all ${
                    lightThemeId === theme.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-sm">{theme.name}</div>
                  <div className="text-xs text-gray-600">{theme.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Dark Theme</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PLATFORM_THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setDarkThemeId(theme.id)}
                  className={`p-3 rounded-lg text-left border-2 transition-all ${
                    darkThemeId === theme.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-sm">{theme.name}</div>
                  <div className="text-xs text-gray-600">{theme.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Default Mode for New Users</label>
            <div className="flex gap-3">
              {["light", "dark", "system"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDefaultMode(mode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    defaultMode === mode
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={allowUserOverride}
                onChange={(e) => setAllowUserOverride(e.target.checked)}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium">Allow Users to Override Platform Theme</div>
                <div className="text-sm text-gray-600">Users and guests can select their own theme if enabled</div>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Fallback
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
          <p className="font-medium mb-1">ℹ️ What happens when you update?</p>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            <li>New visitors will see the new default theme</li>
            <li>Users without custom preference will see the new theme</li>
            <li>Users with saved theme preference will keep their choice (unless override is disabled)</li>
            <li>All logged-in users will be notified of the change</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
