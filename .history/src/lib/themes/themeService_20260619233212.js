import dbConnect from "@/lib/dbConnect";
import Theme from "@/models/Theme";
import mongoose from "mongoose";

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
