import PlatformThemeSetting from "@/models/PlatformThemeSetting";
import dbConnect from "@/lib/dbConnect";

const FALLBACK_PLATFORM_THEME = {
  lightThemeId: "white-green-orange",
  darkThemeId: "dark-slate-emerald",
  defaultMode: "system",
  allowUserOverride: true,
};

/**
 * Resolve platform theme based on priority:
 * 1. Logged-in user custom platform preference
 * 2. Guest localStorage preference (if allowed)
 * 3. Super Admin global platform theme setting
 * 4. Hardcoded fallback
 */
export async function resolvePlatformTheme(userPlatformTheme, guestLocalStorage) {
  try {
    await dbConnect();

    // 1. Logged-in user preference takes priority
    if (userPlatformTheme && userPlatformTheme.lightThemeId && userPlatformTheme.darkThemeId) {
      return {
        source: "user",
        lightThemeId: userPlatformTheme.lightThemeId,
        darkThemeId: userPlatformTheme.darkThemeId,
        defaultMode: userPlatformTheme.mode || "system",
      };
    }

    // 2. Guest localStorage preference (if allowed by admin)
    if (guestLocalStorage && guestLocalStorage.source === "guest") {
      // Check if admin allows guest override
      const setting = await PlatformThemeSetting.getOrCreate();
      if (setting.allowUserOverride && guestLocalStorage.lightThemeId && guestLocalStorage.darkThemeId) {
        return {
          source: "guest-local",
          lightThemeId: guestLocalStorage.lightThemeId,
          darkThemeId: guestLocalStorage.darkThemeId,
          defaultMode: guestLocalStorage.mode || "system",
        };
      }
    }

    // 3. Super Admin global default
    const setting = await PlatformThemeSetting.getOrCreate();
    return {
      source: "admin-default",
      lightThemeId: setting.lightThemeId || FALLBACK_PLATFORM_THEME.lightThemeId,
      darkThemeId: setting.darkThemeId || FALLBACK_PLATFORM_THEME.darkThemeId,
      defaultMode: setting.defaultMode || FALLBACK_PLATFORM_THEME.defaultMode,
      allowUserOverride: setting.allowUserOverride,
    };
  } catch (error) {
    console.error("Failed to resolve platform theme:", error);
    // 4. Fallback if DB fails
    return {
      source: "fallback",
      ...FALLBACK_PLATFORM_THEME,
    };
  }
}

/**
 * Get current platform theme for guests (no auth)
 */
export async function getPlatformThemeForGuest() {
  try {
    await dbConnect();
    const setting = await PlatformThemeSetting.getOrCreate();
    return {
      lightThemeId: setting.lightThemeId || FALLBACK_PLATFORM_THEME.lightThemeId,
      darkThemeId: setting.darkThemeId || FALLBACK_PLATFORM_THEME.darkThemeId,
      defaultMode: setting.defaultMode || FALLBACK_PLATFORM_THEME.defaultMode,
      allowUserOverride: setting.allowUserOverride,
    };
  } catch (error) {
    console.error("Failed to get guest platform theme:", error);
    return FALLBACK_PLATFORM_THEME;
  }
}

/**
 * Get full platform theme setting for admin
 */
export async function getPlatformThemeSetting() {
  try {
    await dbConnect();
    return await PlatformThemeSetting.getOrCreate();
  } catch (error) {
    console.error("Failed to get platform theme setting:", error);
    return null;
  }
}

export { FALLBACK_PLATFORM_THEME };
