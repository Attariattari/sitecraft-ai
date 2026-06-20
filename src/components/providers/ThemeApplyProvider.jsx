"use client";

import { useThemeApply } from "@/hooks/useThemeApply";

export function ThemeApplyProvider({ children }) {
  useThemeApply();
  return <>{children}</>;
}
