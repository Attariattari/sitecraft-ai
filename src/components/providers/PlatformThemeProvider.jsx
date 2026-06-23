"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { applyPlatformTheme } from "@/lib/theme/applyPlatformTheme";
import { createRealtimeBroadcastChannel } from "@/lib/realtime/broadcastChannel";

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

function getStoredMode() {
  try {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

export function usePlatformThemeContext() {
  return useContext(PlatformThemeContext);
}

/**
 * Loads the Super Admin platform theme and lets users override only light/dark mode.
 */
export function PlatformThemeProvider({ children, initialTheme = null }) {
  const themeSignatureRef = useRef("");
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
        const res = await fetch("/api/platform-theme", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load platform theme");

        const data = await res.json();
        const nextTheme = data.theme;
        if (!nextTheme) return;

        const storedMode = getStoredMode();
        const nextMode = nextTheme.allowUserOverride && storedMode
          ? storedMode
          : normalizeMode(nextTheme.defaultMode);
        const nextResolvedMode = applyPlatformTheme(nextTheme, nextMode);

        const nextSignature = [
          nextTheme.activeThemeId,
          nextTheme.lightThemeId,
          nextTheme.darkThemeId,
          nextTheme.defaultMode,
          nextTheme.allowUserOverride,
        ].join(":");
        const changed = themeSignatureRef.current && themeSignatureRef.current !== nextSignature;
        themeSignatureRef.current = nextSignature;

        setTheme(nextTheme);
        setSource(data.source || "fallback");
        setMode(nextMode);
        setResolvedMode(nextResolvedMode);

        if (showToast || changed) toast.success("Platform theme updated.");
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
    const id = window.setInterval(() => {
      fetchAndApplyTheme();
    }, 5000);

    return () => window.clearInterval(id);
  }, [fetchAndApplyTheme]);

  useEffect(() => {
    try {
      const bc = createRealtimeBroadcastChannel((message) => {
        if (message?.type === "platform-theme:updated") {
          fetchAndApplyTheme({ showToast: true });
        }
      });

      return () => bc?.close();
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
