import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

/**
 * Hook to apply user's theme preference to the entire app
 * Should be used in a client component early in the component tree
 */
export function useThemeApply() {
  const { user, userTheme } = useUser();

  useEffect(() => {
    if (!user) return;

    // Apply theme to document root
    if (userTheme) {
      document.documentElement.setAttribute("data-user-theme", userTheme);
      // Also set as CSS class for tailwind theming
      document.documentElement.classList.add(`theme-${userTheme}`);
    } else {
      document.documentElement.removeAttribute("data-user-theme");
    }
  }, [userTheme, user]);
}
