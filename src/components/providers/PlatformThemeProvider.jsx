"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

/**
 * PlatformThemeProvider
 * 
 * Loads and applies the platform theme globally:
 * 1. Super Admin default (from DB)
 * 2. User custom preference (if logged in)
 * 3. Guest localStorage (if allowed by admin)
 * 4. System preference fallback
 */
export function PlatformThemeProvider({ children }) {
  const { user } = useUser();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeTheme();
  }, [user]);

  async function initializeTheme() {
    try {
      let finalTheme = null;

      // 1. Logged-in user preference
      if (user?.preferences?.platformTheme?.lightThemeId && user?.preferences?.platformTheme?.darkThemeId) {
        finalTheme = {
          lightThemeId: user.preferences.platformTheme.lightThemeId,
          darkThemeId: user.preferences.platformTheme.darkThemeId,
          mode: user.preferences.platformTheme.mode || "system",
        };
      } else {
        // 2. Guest localStorage or admin default
        let storedTheme = null;
        try {
          const stored = localStorage.getItem("sitecraft_platform_theme");
          if (stored) {
            storedTheme = JSON.parse(stored);
          }
        } catch (e) {
          console.warn("Failed to parse stored theme:", e);
        }

        if (storedTheme?.allowedByAdmin && storedTheme.lightThemeId && storedTheme.darkThemeId) {
          finalTheme = {
            lightThemeId: storedTheme.lightThemeId,
            darkThemeId: storedTheme.darkThemeId,
            mode: storedTheme.mode || "system",
          };
        } else {
          // 3. Fetch admin default
          try {
            const res = await fetch("/api/platform-theme");
            if (res.ok) {
              const data = await res.json();
              if (data.theme) {
                finalTheme = {
                  lightThemeId: data.theme.lightThemeId,
                  darkThemeId: data.theme.darkThemeId,
                  mode: data.theme.defaultMode,
                };
                // Cache admin default in localStorage for guests
                localStorage.setItem(
                  "sitecraft_platform_theme",
                  JSON.stringify({
                    ...finalTheme,
                    allowedByAdmin: data.theme.allowUserOverride,
                    source: "admin-default",
                  })
                );
              }
            }
          } catch (error) {
            console.error("Failed to fetch platform theme:", error);
          }
        }
      }

      // Apply theme
      if (finalTheme) {
        applyTheme(finalTheme);
      }

      setInitialized(true);
    } catch (error) {
      console.error("Failed to initialize theme:", error);
      setInitialized(true);
    }
  }

  function applyTheme(theme) {
    if (!theme) return;

    // Determine current mode
    let currentMode = theme.mode;
    if (currentMode === "system") {
      currentMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    // Apply dark class if needed
    const html = document.documentElement;
    if (currentMode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    // Set data attribute for CSS
    html.setAttribute("data-platform-theme-light", theme.lightThemeId);
    html.setAttribute("data-platform-theme-dark", theme.darkThemeId);
    html.setAttribute("data-platform-theme-mode", currentMode);

    // Store in sessionStorage for realtime access
    sessionStorage.setItem(
      "sitecraft_platform_theme_active",
      JSON.stringify({
        lightThemeId: theme.lightThemeId,
        darkThemeId: theme.darkThemeId,
        currentMode,
      })
    );
  }

  // Listen for realtime platform theme updates
  useEffect(() => {
    if (!initialized) return;

    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("sitecraft-platform-theme");
        bc.addEventListener("message", (event) => {
          const data = event.data || {};
          if (data.type === "platform-theme:updated") {
            // Refresh if user doesn't have custom preference
            if (!user?.preferences?.platformTheme?.lightThemeId) {
              initializeTheme();
            }
          }
        });
        return () => bc.close();
      }
    } catch (error) {
      console.warn("BroadcastChannel not available:", error);
    }
  }, [initialized, user]);

  return <>{children}</>;
}
