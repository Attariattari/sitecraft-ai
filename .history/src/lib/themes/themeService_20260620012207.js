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
  const query = {
    isActive: true,
    isAvailable: true,
    isLocked: false,
  };

  if (context === "home") {
    query.showOnHome = true;
  } else if (context === "generate") {
    query.showInGenerate = true;
  } else if (context === "dashboard") {
    query.showInDashboard = true;
  } else if (context === "showcase") {
    query.showInThemeShowcase = true;
  }

  const themes = await Theme.find(query).sort({ sortOrder: 1, name: 1 }).lean();

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
 * Get all themes for Admin
 */
export async function getAllThemes() {
  await dbConnect();
  let themes = await Theme.find({}).sort({ sortOrder: 1, name: 1 }).lean();

  if (!themes || themes.length === 0) {
    // Seed default if empty
    await Theme.create({
      themeId: "emerald",
      slug: "emerald",
      name: "Emerald Horizon",
      label: "Emerald",
      description: "Clean, fresh and professional emerald design.",
      isActive: true,
      isAvailable: true,
      isLocked: false,
      showOnHome: true,
      showInGenerate: true,
      showInShowcase: true,
      sortOrder: 0,
    });
    themes = await Theme.find({}).sort({ sortOrder: 1, name: 1 }).lean();
  }

  // Attach usage count to each
  const themesWithUsage = await Promise.all(
    themes.map(async (t) => {
      const usageCount = await getThemeUsage(t.themeId);
      return {
        ...t,
        usageCount,
        _id: t._id ? t._id.toString() : null,
      };
    }),
  );

  return themesWithUsage;
}

/**
 * Determines whether a theme is selectable (active, available, not locked)
 */
export async function isThemeSelectable(themeId) {
  await dbConnect();

  const theme = await Theme.findOne({
    $or: [{ themeId }, { slug: themeId }],
  }).lean();
  if (!theme) return false;

  if (!theme.isActive) return false;
  if (!theme.isAvailable) return false;
  if (theme.isLocked) return false;

  return true;
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
