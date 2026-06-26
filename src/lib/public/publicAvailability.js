import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Template from "@/models/Template";
import { getAvailableCategories, defaultCategories } from "@/lib/categories/categoryService";
import { getAvailableThemes } from "@/lib/themes/themeService";
import { getAllTemplates } from "@/lib/templateRegistry";
import { getPublicFeatures } from "@/lib/features/featureCatalogService";
import { getPublicPlans } from "@/lib/plans/planEntitlements";

function serializeCategory(category) {
  return {
    id: category._id ? category._id.toString() : category.slug,
    slug: category.slug,
    name: category.name,
    label: category.label || category.name,
    description: category.description || "",
    status: category.isAvailable && !category.isLocked ? "available" : "coming_soon",
    lockedReason: category.lockedReason || "Coming soon",
  };
}

function serializeTemplate(template) {
  return {
    id: template._id ? template._id.toString() : template.key || template.slug,
    slug: template.slug || template.key,
    name: template.name,
    category: template.category || "portfolio",
    description: template.description || "",
    status: template.isActive === false ? "draft" : "active",
    isPremium: Boolean(template.isPremium),
  };
}

export async function getActiveTemplates() {
  await dbConnect();

  const dbTemplates = await Template.find({ isActive: true })
    .sort({ order: 1, name: 1 })
    .lean();

  if (dbTemplates.length) {
    return dbTemplates.map(serializeTemplate);
  }

  return getAllTemplates().map((template) =>
    serializeTemplate({ ...template, slug: template.key, isActive: true }),
  );
}

export async function getComingSoonCategories() {
  await dbConnect();

  let categories = await Category.find({
    isActive: true,
    showOnHome: true,
    $or: [{ isAvailable: false }, { isLocked: true }],
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  if (!categories.length) {
    categories = defaultCategories.filter(
      (category) =>
        category.isActive &&
        category.showOnHome &&
        (!category.isAvailable || category.isLocked),
    );
  }

  return categories.map(serializeCategory);
}

export async function getPublicAvailability() {
  const [categories, comingSoonCategories, templates, themes, features] =
    await Promise.all([
      getAvailableCategories("home"),
      getComingSoonCategories(),
      getActiveTemplates(),
      getAvailableThemes("showcase"),
      getPublicFeatures(),
    ]);

  const availableCategories = categories
    .filter((category) => category.isSelectable || (category.isAvailable && !category.isLocked))
    .map(serializeCategory);

  const activeFeatures = features.filter((feature) => feature.status === "available");
  const comingSoonFeatures = features.filter((feature) => feature.status !== "available");

  return {
    activeCategoriesCount: availableCategories.length,
    activeTemplateCount: templates.length,
    activeThemeCount: themes.length,
    availableCategories,
    comingSoonCategories,
    activeTemplates: templates,
    activeThemes: themes.map((theme) => ({
      id: theme._id || theme.themeId || theme.slug,
      slug: theme.slug || theme.themeId,
      name: theme.name || theme.label,
      description: theme.description || "",
    })),
    activeFeatures,
    comingSoonFeatures,
    publicPlans: getPublicPlans(),
  };
}
