import React from "react";
import { getTheme } from "@/lib/themes/presets";

// Custom hook to inject CSS variables for a specific theme into a component scope
// This allows templates to run inside the main app without clashing with global layout themes
export function useThemeVariables(themeKey) {
  const theme = getTheme(themeKey);
  const colors = theme.colors;

  return {
    "--template-primary": colors.primary,
    "--template-secondary": colors.secondary,
    "--template-accent": colors.accent,
    "--template-bg": colors.background,
    "--template-soft-bg": colors.softBackground,
    "--template-text": colors.text,
    "--template-muted": colors.mutedText,
    "--template-border": colors.border,

    // We can use these variables inline via style={{ ...variables }}
    // and map tailwind classes to them if we configure tailwind
  };
}

export function ThemeProvider({ themeKey, children, className = "" }) {
  const variables = useThemeVariables(themeKey);

  return (
    <div className={`template-theme-root ${className}`} style={variables}>
      {children}
    </div>
  );
}
