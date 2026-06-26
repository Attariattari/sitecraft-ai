import dbConnect from "@/lib/dbConnect";
import Theme from "@/models/Theme";
import mongoose from "mongoose";
import { WEBSITE_THEMES } from "@/lib/themes/presets";

/**
 * Returns available themes based on context
 */
export async function getAvailableThemes(context = "home") {
  await dbConnect();

  // User-facing themes MUST be active, available, AND not locked
  const baseQuery = {
    isActive: true,
    isAvailable: true,
    isLocked: false,
  };

  const contextQuery = { ...baseQuery };

  if (context === "home") {
    contextQuery.showOnHome = true;
  } else if (context === "generate") {
    contextQuery.showInGenerate = true;
  } else if (context === "dashboard") {
    contextQuery.showInDashboard = true;
  } else if (context === "showcase") {
    contextQuery.showInThemeShowcase = true;
  }

  let themes = await Theme.find(contextQuery)
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  // If context filter gives nothing, try without the context visibility filter
  // (so at least available themes show up as fallback before admin configures visibility)
  if (themes.length === 0 && Object.keys(contextQuery).length > 3) {
    themes = await Theme.find(baseQuery).sort({ sortOrder: 1, name: 1 }).lean();
  }

  return themes.map((t) => ({
    ...t,
    _id: t._id ? t._id.toString() : null,
  }));
}

/**
 * Checks usage of a theme in existing sites
 */
export async function getThemeUsage(themeId) {
  try {
    const Site =
      mongoose.models.Site || (await import("@/models/Site")).default;
    const count = await Site.countDocuments({
      $or: [
        { theme: themeId },
        { themeId: themeId },
        { "settings.selectedTheme": themeId },
      ],
    });
    return count;
  } catch (error) {
    console.error("Error checking theme usage:", error);
    return 0;
  }
}

/**
 * Get complete theme list for Admin
 */
export async function getAllThemes() {
  await dbConnect();
  const dbThemes = await Theme.find({}).sort({ sortOrder: 1, name: 1 }).lean();

  const mergedThemes = dbThemes.map((theme) => {
    const preset = WEBSITE_THEMES[theme.themeId] || WEBSITE_THEMES[theme.slug];
    if (!preset) return theme;

    return {
      ...theme,
      name: theme.name || preset.name,
      label: theme.label || preset.name,
      description: theme.description || preset.description,
      colors: theme.colors?.primary
        ? theme.colors
        : {
            primary: preset.modes.light.primary,
            secondary: preset.modes.light.secondary,
            accent: preset.modes.light.accent,
            background: preset.modes.light.background,
            foreground: preset.modes.light.text,
          },
      tokens: theme.tokens && Object.keys(theme.tokens).length > 0
        ? theme.tokens
        : preset.modes,
    };
  });
  const dbThemeIds = dbThemes.map((t) => t.themeId);

  let sortFallback = 100;
  for (const [key, t] of Object.entries(WEBSITE_THEMES)) {
    if (!dbThemeIds.includes(t.id)) {
      mergedThemes.push({
        _id: null,
        themeId: t.id,
        slug: key,
        name: t.name,
        label: t.name,
        description: t.description,
        isActive: false, // Fallbacks shown as inactive until explicit load
        isAvailable: false,
        isLocked: true,
        showOnHome: false,
        showInGenerate: false,
        showInDashboard: false,
        showInThemeShowcase: false,
        sortOrder: sortFallback++,
        usageCount: 0,
      });
    }
  }

  // Attach usage count dynamically
  const finalThemes = await Promise.all(
    mergedThemes.map(async (t) => {
      let usageCount = t.usageCount !== undefined ? t.usageCount : 0;
      if (t._id) {
        usageCount = await getThemeUsage(t.themeId);
      }
      return {
        ...t,
        usageCount,
        _id: t._id ? t._id.toString() : null,
      };
    }),
  );

  return finalThemes;
}

/**
 * Determines whether a theme is selectable (active, available, not locked)
 */
export async function isThemeSelectable(themeId) {
  await dbConnect();

  const theme = await Theme.findOne({
    $or: [{ themeId }, { slug: themeId }],
  }).lean();
  if (!theme) return Boolean(WEBSITE_THEMES[themeId]);

  if (!theme.isActive) return false;
  if (!theme.isAvailable) return false;
  if (theme.isLocked) return false;

  return true;
}

/**
 * Platform theme settings only need a known theme ID. The admin page controls
 * which options are selectable, while this check prevents false rejects from
 * older seeded theme records with missing availability flags.
 */
export async function themeExistsForPlatformTheme(themeId) {
  if (!themeId || typeof themeId !== "string") return false;
  if (WEBSITE_THEMES[themeId]) return true;

  await dbConnect();

  const theme = await Theme.exists({
    $or: [{ themeId }, { slug: themeId }],
  });

  return Boolean(theme);
}

/**
 * Seeds initial themes from the local presets into the database.
 */
export async function seedThemes() {
  await dbConnect();

  let sortIndex = 1;
  const count = Object.keys(WEBSITE_THEMES).length;
  console.log(`Seeding ${count} themes...`);

  for (const [key, t] of Object.entries(WEBSITE_THEMES)) {
    await Theme.findOneAndUpdate(
      { themeId: t.id },
      {
        $setOnInsert: {
          slug: key,
          name: t.name,
          label: t.name,
          description: t.description || `${t.name} theme`,
          isActive: true,
          isAvailable: true,
          isLocked: false,
          showOnHome: true,
          showInGenerate: true,
          showInShowcase: true,
          showInDashboard: true,
          sortOrder: sortIndex++,
        },
      },
      { upsert: true, new: true },
    );
  }

  return {
    success: true,
    message: `Themes synchronized successfully! Seeded ${count} themes.`,
  };
}

/**
 * Invalidate all theme recommendations cache when themes change
 */
export async function invalidateAllThemeRecommendations() {
  try {
    const ThemeRecommendation =
      mongoose.models.ThemeRecommendation ||
      (await import("@/models/ThemeRecommendation")).default;
    
    await ThemeRecommendation.deleteMany({});
    return { success: true };
  } catch (error) {
    console.error("Failed to invalidate theme recommendations:", error);
    return { success: false, error: error.message };
  }
}
