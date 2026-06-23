import PlatformThemeSetting from "@/models/PlatformThemeSetting";
import dbConnect from "@/lib/dbConnect";
import Theme from "@/models/Theme";
import { WEBSITE_THEMES } from "@/lib/themes/presets";

const FALLBACK_PLATFORM_THEME = {
  activeThemeId: "emerald",
  lightThemeId: "emerald",
  darkThemeId: "modernDark",
  defaultMode: "light",
  allowUserOverride: true,
  lightTokens: normalizeThemeTokens(WEBSITE_THEMES.emerald.modes.light),
  darkTokens: normalizeThemeTokens(WEBSITE_THEMES.modernDark.modes.dark),
};

function normalizeThemeTokens(tokens = {}) {
  const primary = tokens.primary || "#10B981";
  const secondary = tokens.secondary || "#EEFDF6";
  const accent = tokens.accent || "#F97316";
  const background = tokens.background || "#FFFFFF";
  const softBackground = tokens.softBackground || tokens.card || "#F8FAFC";
  const foreground = tokens.foreground || tokens.text || "#0F172A";
  const mutedForeground = tokens.mutedForeground || tokens.mutedText || "#64748B";
  const border = tokens.border || "#E2E8F0";

  return {
    background,
    foreground,
    card: tokens.card || softBackground,
    "card-foreground": tokens.cardForeground || foreground,
    popover: tokens.popover || softBackground,
    "popover-foreground": tokens.popoverForeground || foreground,
    primary,
    "primary-foreground": tokens.primaryForeground || readableForeground(primary),
    secondary: tokens.secondaryBackground || secondary,
    "secondary-foreground": tokens.secondaryForeground || foreground,
    border,
    input: tokens.input || border,
    ring: tokens.ring || primary,
    muted: tokens.muted || softBackground,
    "muted-foreground": mutedForeground,
    accent,
    "accent-foreground": tokens.accentForeground || readableForeground(accent),
    "soft-bg": softBackground,
    "primary-dark": tokens.primaryDark || tokens.secondary || primary,
    "primary-soft": tokens.primarySoft || withAlpha(primary, 0.16),
    "accent-soft": tokens.accentSoft || withAlpha(accent, 0.16),
    "glass-bg": tokens.glassBg || withAlpha(background, 0.72),
    "card-border": tokens.cardBorder || withAlpha(primary, 0.16),
    "glow-emerald": tokens.glowEmerald || withAlpha(primary, 0.18),
    "glow-orange": tokens.glowOrange || withAlpha(accent, 0.14),
  };
}

function readableForeground(hex) {
  const color = String(hex || "").replace("#", "");
  if (color.length !== 6) return "#FFFFFF";
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? "#0F172A" : "#FFFFFF";
}

function withAlpha(hex, alpha) {
  const color = String(hex || "").replace("#", "");
  if (color.length !== 6) return hex;
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

async function getThemeTokens(themeId, mode) {
  const fallback = WEBSITE_THEMES[themeId]?.modes?.[mode];
  const theme = await Theme.findOne({
    $or: [{ themeId }, { slug: themeId }],
    isActive: true,
    isAvailable: true,
    isLocked: false,
  }).lean();

  if (theme?.tokens?.[mode]) {
    return normalizeThemeTokens(theme.tokens[mode]);
  }

  if (theme?.colors) {
    return normalizeThemeTokens(theme.colors);
  }

  if (fallback) {
    return normalizeThemeTokens(fallback);
  }

  return mode === "dark" ? FALLBACK_PLATFORM_THEME.darkTokens : FALLBACK_PLATFORM_THEME.lightTokens;
}

async function buildPlatformThemePayload(setting, source) {
  const lightThemeId = setting?.lightThemeId || FALLBACK_PLATFORM_THEME.lightThemeId;
  const darkThemeId = setting?.darkThemeId || FALLBACK_PLATFORM_THEME.darkThemeId;

  return {
    source,
    theme: {
      activeThemeId: setting?.activeThemeId || lightThemeId || FALLBACK_PLATFORM_THEME.activeThemeId,
      lightThemeId,
      darkThemeId,
      defaultMode: setting?.defaultMode === "dark" ? "dark" : "light",
      allowUserOverride: setting?.allowUserOverride ?? FALLBACK_PLATFORM_THEME.allowUserOverride,
      lightTokens: await getThemeTokens(lightThemeId, "light"),
      darkTokens: await getThemeTokens(darkThemeId, "dark"),
    },
  };
}

/**
 * Resolve platform theme based on priority:
 * 1. Super Admin global platform theme setting
 * 2. User/guest mode preference only
 * 3. Hardcoded fallback
 */
export async function resolvePlatformTheme(userPlatformTheme, guestLocalStorage) {
  try {
    await dbConnect();

    const setting = await PlatformThemeSetting.getOrCreate();
    const payload = await buildPlatformThemePayload(setting, "database");
    const mode = [userPlatformTheme?.mode, guestLocalStorage?.mode, payload.theme.defaultMode].find((value) =>
      ["light", "dark"].includes(value)
    ) || "light";

    return {
      source: payload.source,
      ...payload.theme,
      defaultMode: mode,
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
    const setting = await PlatformThemeSetting.findOne({});
    return setting
      ? await buildPlatformThemePayload(setting, "database")
      : { source: "fallback", theme: FALLBACK_PLATFORM_THEME };
  } catch (error) {
    console.error("Failed to get guest platform theme:", error);
    return { source: "fallback", theme: FALLBACK_PLATFORM_THEME };
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
