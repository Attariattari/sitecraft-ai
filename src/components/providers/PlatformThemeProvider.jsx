"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { applyPlatformTheme } from "@/lib/theme/applyPlatformTheme";

const MODE_STORAGE_KEY = "sitecraft_platform_theme_mode";
const LEGACY_THEME_STORAGE_KEY = "sitecraft_platform_theme";
const PlatformThemeContext = createContext(null);

function normalizeMode(mode) {
  return mode === "dark" ? "dark" : "light";
}

function removeLegacyThemeChoice() {
  try {
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

export function usePlatformThemeContext() {
  return useContext(PlatformThemeContext);
}

/**
 * Loads the Super Admin platform theme and lets users override only light/dark mode.
 */
export function PlatformThemeProvider({ children, initialTheme = null }) {
  const [theme, setTheme] = useState(initialTheme);
  const [source, setSource] = useState("fallback");
  const [mode, setMode] = useState(normalizeMode(initialTheme?.defaultMode));
  const [resolvedMode, setResolvedMode] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );
  const [mounted, setMounted] = useState(Boolean(initialTheme));

  const fetchAndApplyTheme = useCallback(
    async ({ showToast = false } = {}) => {
      try {
        removeLegacyThemeChoice();
        try {
          localStorage.removeItem(MODE_STORAGE_KEY);
        } catch {
          // Storage can be unavailable in private browsing.
        }

        const res = await fetch("/api/platform-theme", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load platform theme");

        const data = await res.json();
        const nextTheme = data.theme;
        if (!nextTheme) return;

        const nextMode = normalizeMode(nextTheme.defaultMode);
        const nextResolvedMode = applyPlatformTheme(nextTheme, nextMode);

        setTheme(nextTheme);
        setSource(data.source || "fallback");
        setMode(nextMode);
        setResolvedMode(nextResolvedMode);

        if (showToast) toast.success("Platform theme updated.");
      } catch (error) {
        console.error("Failed to fetch platform theme:", error);
      } finally {
        setMounted(true);
      }
    },
    []
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      fetchAndApplyTheme();
    }, 0);

    return () => window.clearTimeout(id);
  }, [fetchAndApplyTheme]);

  useEffect(() => {
    try {
      if (!("BroadcastChannel" in window)) return;

      const bc = new BroadcastChannel("sitecraft-platform-theme");
      bc.addEventListener("message", (event) => {
        if (event.data?.type === "platform-theme:updated") {
          fetchAndApplyTheme({ showToast: true });
        }
      });

      return () => bc.close();
    } catch (error) {
      console.warn("BroadcastChannel not available:", error);
    }
  }, [fetchAndApplyTheme]);

  const setThemeMode = useCallback(
    async (nextMode, currentUser) => {
      if (!["light", "dark"].includes(nextMode)) return;
      if (theme && !theme.allowUserOverride) return;

      try {
        localStorage.setItem(MODE_STORAGE_KEY, nextMode);
      } catch {
        // Storage can be unavailable in private browsing.
      }

      setMode(nextMode);
      if (theme) {
        setResolvedMode(applyPlatformTheme(theme, nextMode));
      }

      if (currentUser?.id) {
        try {
          await fetch("/api/user/platform-theme", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: nextMode }),
          });
        } catch (error) {
          console.error("Failed to save theme mode:", error);
        }
      }
    },
    [theme]
  );

  const toggleTheme = useCallback(
    (currentUser) => {
      const nextMode = resolvedMode === "dark" ? "light" : "dark";
      return setThemeMode(nextMode, currentUser);
    },
    [resolvedMode, setThemeMode]
  );

  const value = useMemo(
    () => ({
      theme,
      source,
      mode,
      resolvedMode,
      isDark: resolvedMode === "dark",
      mounted,
      setThemeMode,
      toggleTheme,
      refreshPlatformTheme: fetchAndApplyTheme,
    }),
    [fetchAndApplyTheme, mode, mounted, resolvedMode, setThemeMode, source, theme, toggleTheme]
  );

  return (
    <PlatformThemeContext.Provider value={value}>
      {children}
    </PlatformThemeContext.Provider>
  );
}
