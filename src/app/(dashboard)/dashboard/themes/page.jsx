"use client";

import React, { useState, useEffect } from "react";
import { Palette, Zap, X } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { formatThemeLimitForDisplay } from "@/lib/themes/themePlanLimits";
import { getAccountPurposeLabel } from "@/lib/accountPurposeResolver";
import { ThemeCard } from "@/components/dashboard/themes/ThemeCard";
import { ThemePreviewModal } from "@/components/dashboard/themes/ThemePreviewModal";

const PURPOSES = [
  "portfolio",
  "business",
  "salon",
  "ecommerce",
  "restaurant",
  "clinic",
  "realEstate",
  "agency",
  "school",
  "landingPage",
];

export default function ThemesPage() {
  const { user, updateUserTheme } = useUser();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [previewTheme, setPreviewTheme] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);
  const [defaultThemeId, setDefaultThemeId] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Get user's available purposes
  const userPurposes = user?.selectedPurposes?.filter((p) =>
    PURPOSES.includes(p)
  ) || ["portfolio"];

  // Initialize selected purpose
  useEffect(() => {
    if (!selectedPurpose && userPurposes.length > 0) {
      setSelectedPurpose(userPurposes[0]);
    }
  }, [user]);

  // Load default theme preference
  useEffect(() => {
    if (user?.preferences?.defaultThemeId) {
      setDefaultThemeId(user.preferences.defaultThemeId);
    }
  }, [user]);

  // Fetch recommended themes
  useEffect(() => {
    if (!selectedPurpose) return;
    
    async function fetchThemes() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/themes/recommended?purpose=${selectedPurpose}`
        );
        const data = await res.json();
        if (data.success) {
          setThemes(data.themes || []);
        } else {
          setToastMessage(data.message || "Failed to load themes");
          setThemes([]);
        }
      } catch (error) {
        console.error("Failed to fetch themes:", error);
        setToastMessage("Failed to load themes");
        setThemes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchThemes();

    // Listen for realtime theme refresh
    let bc = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("sitecraft-data");
        bc.addEventListener("message", (ev) => {
          const d = ev.data || {};
          if (d.type === "theme:list-refresh") {
            fetchThemes();
            setToastMessage("Themes updated");
          }
        });
      }
    } catch (e) {
      // ignore
    }

    return () => {
      if (bc) bc.close();
    };
  }, [selectedPurpose]);

  // Handle set default theme
  async function handleSetDefaultTheme(themeId) {
    try {
      setSettingDefault(true);
      await updateUserTheme(themeId);
      setDefaultThemeId(themeId);
      setIsPreviewOpen(false);
      setToastMessage("Default theme saved ✓");
    } catch (error) {
      console.error("Failed to set default theme:", error);
      setToastMessage("Failed to save theme");
    } finally {
      setSettingDefault(false);
    }
  }

  if (!user) {
    return (
      <DashboardShell>
        <DashboardPageHeader
          title="Themes"
          description="Loading..."
        />
      </DashboardShell>
    );
  }

  const userPlan = user.plan || "free";
  const planLimit = {
    free: 1,
    basic: 4,
    pro: 10,
  }[userPlan] || 10;

  const needsUpgrade = themes.length > planLimit;
  const isLimitedPlan = userPlan === "free" || userPlan === "basic" || userPlan === "pro";

  return (
    <DashboardShell>
      <DashboardPageHeader
        title="AI-Recommended Themes"
        description="Explore themes selected for your profile, purpose, and website needs."
      />

      {/* Toast Message */}
      {toastMessage && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-blue-900">{toastMessage}</span>
          <button
            onClick={() => setToastMessage("")}
            className="text-blue-400 hover:text-blue-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Current Plan Card */}
      <DashboardCard className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-2">Your Current Plan</h3>
            <p className="text-sm text-gray-700">
              You can access <span className="font-semibold">{formatThemeLimitForDisplay(userPlan)}</span> on the {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} plan.
            </p>
            {selectedPurpose && (
              <p className="text-sm text-gray-600 mt-1">
                Viewing themes for <span className="font-medium">{getAccountPurposeLabel(selectedPurpose)}</span>
              </p>
            )}
          </div>
          {isLimitedPlan && (
            <Button asChild size="sm">
              <a href="/dashboard/billing">Upgrade Plan</a>
            </Button>
          )}
        </div>
      </DashboardCard>

      {/* Purpose Tabs */}
      {userPurposes.length > 1 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-700 mb-3">Select Purpose:</p>
          <div className="flex gap-2 flex-wrap">
            {userPurposes.map((purpose) => (
              <Button
                key={purpose}
                variant={selectedPurpose === purpose ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPurpose(purpose)}
              >
                {getAccountPurposeLabel(purpose)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Themes Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
              <p className="text-gray-600">Loading themes...</p>
            </div>
          </div>
        ) : themes.length === 0 ? (
          <DashboardCard className="text-center py-12">
            <Palette className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Themes Available</h3>
            <p className="text-gray-600 mb-4">
              We're currently loading themes for this purpose.
            </p>
            <Button asChild variant="outline">
              <a href="/dashboard/generate">Start Generating</a>
            </Button>
          </DashboardCard>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <ThemeCard
                  key={theme.themeId}
                  theme={theme}
                  isRecommended={true}
                  isDefault={theme.themeId === defaultThemeId}
                  onPreview={() => {
                    setPreviewTheme(theme);
                    setIsPreviewOpen(true);
                  }}
                  onUseTheme={handleSetDefaultTheme}
                  isLoading={settingDefault}
                />
              ))}
            </div>

            {needsUpgrade && (
              <DashboardCard className="bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Unlock More Themes
                    </h3>
                    <p className="text-sm text-yellow-800">
                      Your plan includes {planLimit} theme{planLimit !== 1 ? "s" : ""}. We found {themes.length} strong options for you. Upgrade for more theme access.
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <a href="/dashboard/billing">Upgrade Now</a>
                  </Button>
                </div>
              </DashboardCard>
            )}

            <p className="text-xs text-gray-500 text-center">
              Themes are AI-recommended based on your profile and purpose. Your plan limits the number of themes you can set as default.
            </p>
          </>
        )}
      </div>

      {/* Theme Preview Modal */}
      <ThemePreviewModal
        theme={previewTheme}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onUseTheme={handleSetDefaultTheme}
        isLoading={settingDefault}
      />
    </DashboardShell>
  );
}
