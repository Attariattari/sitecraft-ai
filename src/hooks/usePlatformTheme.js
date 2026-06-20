import { useEffect, useState } from "react";

/**
 * Hook to manage platform theme persistence
 * Handles both user preferences and guest localStorage
 */
export function usePlatformTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    
    // Check current mode from DOM
    const html = document.documentElement;
    const hasDarkClass = html.classList.contains("dark");
    setIsDark(hasDarkClass);
  }, []);

  const toggleTheme = async (user) => {
    const newDark = !isDark;
    setIsDark(newDark);
    
    // Apply to DOM immediately
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to DB if logged in
    if (user && user.id) {
      try {
        await fetch("/api/user/platform-theme", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: newDark ? "dark" : "light",
          }),
        });
      } catch (error) {
        console.error("Failed to save theme to DB:", error);
      }
    } else {
      // Save to localStorage for guests
      try {
        const stored = JSON.parse(localStorage.getItem("sitecraft_platform_theme") || "{}");
        localStorage.setItem(
          "sitecraft_platform_theme",
          JSON.stringify({
            ...stored,
            mode: newDark ? "dark" : "light",
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error("Failed to save theme to localStorage:", error);
      }
    }
  };

  return { isDark, toggleTheme, mounted };
}
