"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ThemeSelectionCard } from "@/components/admin/ThemeSelectionCard";
import { ThemeSelectionModal } from "@/components/admin/ThemeSelectionModal";
import { toast } from "sonner";
import { 
  Palette, Save, RotateCcw, AlertCircle, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const MODE_STORAGE_KEY = "sitecraft_platform_theme_mode";

function clearLocalModeOverride() {
  try {
    localStorage.removeItem(MODE_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

function notifyPlatformThemeUpdated() {
  try {
    if (!("BroadcastChannel" in window)) return;
    const bc = new BroadcastChannel("sitecraft-platform-theme");
    bc.postMessage({ type: "platform-theme:updated" });
    bc.close();
  } catch {
    // BroadcastChannel can be unavailable in older/private browser contexts.
  }
}

/**
 * Professional Theme Selection Page
 * Displays all themes as cards in a grid, with modal preview on click
 */

export default function PlatformThemePage() {
  const [setting, setSetting] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewingTheme, setPreviewingTheme] = useState(null);

  // Local form state
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const [defaultMode, setDefaultMode] = useState("light");
  const [allowUserOverride, setAllowUserOverride] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load current platform theme setting
      const settingRes = await fetch("/api/admin/platform-theme");
      if (settingRes.ok) {
        const settingData = await settingRes.json();
        if (settingData.setting) {
          setSetting(settingData.setting);
          setSelectedThemeId(
            settingData.setting.activeThemeId ||
              settingData.setting.lightThemeId ||
              settingData.setting.darkThemeId ||
              ""
          );
          setDefaultMode(settingData.setting.defaultMode === "dark" ? "dark" : "light");
          setAllowUserOverride(settingData.setting.allowUserOverride);
        }
      }

      // Load all available themes
      const themesRes = await fetch("/api/admin/themes");
      if (themesRes.ok) {
        const themesData = await themesRes.json();
        if (themesData.themes) {
          // Filter for selectable themes (active, available, not locked)
          const selectableThemes = themesData.themes.filter(
            t => t.isActive && t.isAvailable && !t.isLocked
          );
          setThemes(selectableThemes);
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load platform theme data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load current setting and themes
  useEffect(() => {
    const id = window.setTimeout(() => {
      loadData();
    }, 0);

    return () => window.clearTimeout(id);
  }, [loadData]);

  async function handleSave() {
    if (!selectedThemeId) {
      toast.error("Please select a platform theme");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/platform-theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeThemeId: selectedThemeId,
          lightThemeId: selectedThemeId,
          darkThemeId: selectedThemeId,
          defaultMode,
          allowUserOverride,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSetting(data.setting);
        setSelectedThemeId(data.setting.activeThemeId || data.setting.lightThemeId);
        setDefaultMode(data.setting.defaultMode === "dark" ? "dark" : "light");
        setAllowUserOverride(data.setting.allowUserOverride);
        clearLocalModeOverride();
        notifyPlatformThemeUpdated();
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

  function handleSelectTheme(themeId, mode) {
    setSelectedThemeId(themeId);
    if (mode === "light" || mode === "dark") {
      setDefaultMode(mode);
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      "Reset to fallback platform theme?\n\nThis will set all platforms to the default SiteCraft theme."
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/platform-theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeThemeId: "emerald",
          lightThemeId: "emerald",
          darkThemeId: "emerald",
          defaultMode: "light",
          allowUserOverride: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSetting(data.setting);
        setSelectedThemeId(data.setting.activeThemeId || data.setting.lightThemeId);
        setDefaultMode(data.setting.defaultMode);
        setAllowUserOverride(data.setting.allowUserOverride);
        clearLocalModeOverride();
        notifyPlatformThemeUpdated();
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
      <div className="bg-background text-foreground">
        <AdminPageHeader 
          title="Platform Theme" 
          description="Control the default visual theme for the public website and user dashboard"
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 inline-block">
              <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground">Loading platform themes...</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedTheme = themes.find(t => t.themeId === selectedThemeId);

  return (
    <div className="space-y-8 bg-background text-foreground">
      <AdminPageHeader 
        title="Platform Theme" 
        description="Control the default visual theme for the public website and user dashboard"
      />

      <div className="max-w-7xl mx-auto px-8 pb-8">
        {/* Info Banner */}
        <div className="mb-8 bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Note:</span> This setting only affects the main platform UI (public website, auth pages, and user dashboard). 
            It does not affect user-generated website themes.
          </p>
        </div>

        {/* Current Active Theme Card */}
        {setting && (
          <div className="mb-8 bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Current Platform Theme</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Theme</p>
                    <p className="font-medium">{selectedTheme?.name || selectedThemeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mode Pair</p>
                    <p className="font-medium">Light and dark from same theme</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Default Mode</p>
                      <p className="font-medium capitalize">{defaultMode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">User Override</p>
                      <p className="font-medium">{allowUserOverride ? "Allowed" : "Disabled"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Last Updated Info */}
              <div className="flex flex-col justify-between">
                <div>
                  {setting.updatedAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Last updated: {new Date(setting.updatedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Selection Grid */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Available Themes
                </h3>
                <p className="text-muted-foreground">
                  Click any theme to preview it. Selecting a new theme replaces the previous selection.
                </p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {themes.length} themes available
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {themes.map((theme) => (
              <ThemeSelectionCard
                key={theme.themeId}
                theme={theme}
                isSelected={selectedThemeId === theme.themeId}
                isLocked={theme.isLocked}
                isInactive={!theme.isActive}
                onPreview={() => setPreviewingTheme(theme)}
              />
            ))}
          </div>

          {themes.length === 0 && (
            <div className="text-center py-16">
              <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No themes available</p>
            </div>
          )}
        </div>

        {/* Theme Preview Modal */}
        <ThemeSelectionModal
          theme={previewingTheme}
          isOpen={!!previewingTheme}
          onClose={() => setPreviewingTheme(null)}
          onSelectTheme={handleSelectTheme}
          selectedThemeId={selectedThemeId}
        />

        {/* Settings Section */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6 mb-8 shadow-sm">
          {/* Default Mode */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Default Mode for New Users
            </label>
            <p className="text-sm text-muted-foreground mb-3">
              Determines what mode visitors see first
            </p>
            <div className="flex gap-3 flex-wrap">
              {["light", "dark"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDefaultMode(mode)}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-all",
                    defaultMode === mode
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* User Override Toggle */}
          <div className="border-t border-border pt-6">
            <label className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={allowUserOverride}
                onChange={(e) => setAllowUserOverride(e.target.checked)}
                className="w-5 h-5 mt-1 rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-foreground">Allow Users to Change Platform Theme</div>
                <p className="text-sm text-muted-foreground mt-1">
                  If enabled, users and guests can toggle between light/dark modes and save their preference
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleReset}
            disabled={saving}
            className={cn(
              "px-4 py-2 rounded-lg border border-border text-foreground font-medium transition-all flex items-center gap-2",
              saving ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Fallback
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all flex items-center gap-2",
              saving ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            )}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-accent/10 border border-accent/20 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              <p className="font-semibold mb-2">What happens when you update the platform theme?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All users and guests will see the new theme applied instantly</li>
                <li>Users without a saved preference will see the new default</li>
                <li>Users with custom theme preferences will keep their choice (if override is enabled)</li>
                <li>The change applies in real-time across all open sessions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
