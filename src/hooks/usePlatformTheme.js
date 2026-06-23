import { useState } from "react";
import { usePlatformThemeContext } from "@/components/providers/PlatformThemeProvider";

export function usePlatformTheme() {
  const context = usePlatformThemeContext();
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );

  if (context) {
    return context;
  }

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
  };

  return { isDark, toggleTheme, mounted: typeof document !== "undefined" };
}
