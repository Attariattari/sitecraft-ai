export const PLATFORM_THEME_VARIABLES = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "border",
  "input",
  "ring",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "soft-bg",
  "primary-dark",
  "primary-soft",
  "accent-soft",
  "glass-bg",
  "card-border",
  "glow-emerald",
  "glow-orange",
];

export function resolvePlatformThemeMode(mode) {
  return mode === "dark" ? "dark" : "light";
}

export function applyPlatformTheme(theme, mode) {
  if (!theme || typeof document === "undefined") return "light";

  const resolvedMode = resolvePlatformThemeMode(mode || theme.defaultMode || "light");
  const tokens = resolvedMode === "dark" ? theme.darkTokens : theme.lightTokens;
  const root = document.documentElement;

  for (const key of PLATFORM_THEME_VARIABLES) {
    const value = tokens?.[key];
    if (value) root.style.setProperty(`--${key}`, value);
  }

  root.dataset.platformTheme = theme.activeThemeId || theme.lightThemeId || "default";
  root.dataset.themeMode = resolvedMode;
  root.dataset.platformThemeLight = theme.lightThemeId || "";
  root.dataset.platformThemeDark = theme.darkThemeId || "";
  root.classList.toggle("dark", resolvedMode === "dark");

  try {
    sessionStorage.setItem(
      "sitecraft_platform_theme_active",
      JSON.stringify({
        activeThemeId: theme.activeThemeId,
        lightThemeId: theme.lightThemeId,
        darkThemeId: theme.darkThemeId,
        currentMode: resolvedMode,
      })
    );
  } catch {
    // Storage can be unavailable in private browsing.
  }

  return resolvedMode;
}
