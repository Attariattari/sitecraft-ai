import { WEBSITE_THEMES } from "./themes/presets";

/**
 * Theme Resolver
 * Resolves theme tokens based on theme ID and mode
 */

const DEFAULT_THEME = "emerald";
const DEFAULT_MODE = "light";

/**
 * Get theme object by ID
 */
export function getThemeById(themeId) {
  if (!themeId || typeof themeId !== "string") {
    return WEBSITE_THEMES[DEFAULT_THEME];
  }

  const theme = WEBSITE_THEMES[themeId];
  return theme || WEBSITE_THEMES[DEFAULT_THEME];
}

/**
 * Get theme tokens for a specific mode
 */
export function getThemeTokens(themeId, mode = "light") {
  const theme = getThemeById(themeId);
  const validMode = mode === "dark" || mode === "light" ? mode : "light";

  return {
    ...theme.modes[validMode],
    themeId,
    mode: validMode,
    themeName: theme.name,
  };
}

/**
 * Get both light and dark tokens for a theme
 */
export function getThemeTokensForBothModes(themeId) {
  const theme = getThemeById(themeId);

  return {
    light: { ...theme.modes.light, themeId, mode: "light" },
    dark: { ...theme.modes.dark, themeId, mode: "dark" },
    themeName: theme.name,
  };
}

/**
 * Get all available theme IDs
 */
export function getAllThemeIds() {
  return Object.keys(WEBSITE_THEMES);
}

/**
 * Check if a theme exists
 */
export function themeExists(themeId) {
  return themeId in WEBSITE_THEMES;
}

/**
 * Get theme metadata (name, description, etc)
 */
export function getThemeMetadata(themeId) {
  const theme = getThemeById(themeId);
  return {
    id: themeId,
    name: theme.name,
    description: theme.description,
    categoryFit: theme.categoryFit,
  };
}

/**
 * Convert theme tokens to CSS variables
 */
export function themeTokensToCSSVars(tokens) {
  const cssVars = {};

  for (const [key, value] of Object.entries(tokens)) {
    if (key !== "themeId" && key !== "mode" && key !== "themeName") {
      cssVars[`--${camelToKebab(key)}`] = value;
    }
  }

  return cssVars;
}

/**
 * Helper function to convert camelCase to kebab-case
 */
function camelToKebab(str) {
  return str.replace(/([a-z0-9]|[A-Z])/g, (match, p1, offset) => {
    if (offset === 0) return match.toLowerCase();
    return /[a-z0-9]/.test(p1) ? `-${p1.toLowerCase()}` : p1.toLowerCase();
  });
}

/**
 * Validate theme configuration
 */
export function validateTheme(themeId, requiredTokens = []) {
  const theme = WEBSITE_THEMES[themeId];

  if (!theme) {
    return {
      valid: false,
      error: `Theme "${themeId}" not found`,
    };
  }

  if (!theme.modes || !theme.modes.light || !theme.modes.dark) {
    return {
      valid: false,
      error: `Theme "${themeId}" missing light/dark modes`,
    };
  }

  if (requiredTokens.length > 0) {
    const lightTokens = Object.keys(theme.modes.light);
    const darkTokens = Object.keys(theme.modes.dark);

    const missingInLight = requiredTokens.filter((t) => !lightTokens.includes(t));
    const missingInDark = requiredTokens.filter((t) => !darkTokens.includes(t));

    if (missingInLight.length > 0 || missingInDark.length > 0) {
      return {
        valid: false,
        error: `Theme "${themeId}" missing required tokens`,
        missingInLight,
        missingInDark,
      };
    }
  }

  return {
    valid: true,
  };
}
