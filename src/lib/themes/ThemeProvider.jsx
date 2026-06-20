import React from "react";
import { getTheme } from "@/lib/themes/presets";

// Helper to determine whether text should be dark or light based on background color
export function getContrastForeground(hexcolor) {
  if (!hexcolor) return "#FFFFFF";
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#0F172A" : "#FFFFFF"; // Dark slate for light backgrounds, White for dark backgrounds
}

// Custom hook to inject CSS variables for a specific theme into a component scope
// This allows templates to run inside the main app without clashing with global layout themes
export function useThemeVariables(themeKey, mode = "light") {
  const theme = getTheme(themeKey, mode);
  const colors = theme.colors;

  return {
    "--template-primary": colors.primary,
    "--template-primary-foreground": getContrastForeground(colors.primary),
    "--template-secondary": colors.secondary,
    "--template-secondary-foreground": getContrastForeground(colors.secondary),
    "--template-accent": colors.accent,
    "--template-accent-foreground": getContrastForeground(colors.accent),
    "--template-background": colors.background,
    "--template-soft-background": colors.softBackground,
    "--template-foreground": colors.text,
    "--template-muted-foreground": colors.mutedText,
    "--template-border": colors.border,

    // We can use these variables inline via style={{ ...variables }}
    // and map tailwind classes to them if we configure tailwind
  };
}

export function ThemeProvider({
  themeKey,
  mode = "light",
  children,
  className = "",
}) {
  const variables = useThemeVariables(themeKey, mode);

  return (
    <div className={`template-theme-root ${className}`} style={variables}>
      {children}
    </div>
  );
}
