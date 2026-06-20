import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

/**
 * SiteCraft AI - Central Category Service
 * Handles all category availability and status logic.
 */

export async function getAllCategories() {
  await dbConnect();
  return Category.find({}).sort({ sortOrder: 1, name: 1 }).lean();
}

/**
 * Returns available categories based on the context (home, signup, dashboard, etc.)
 */
export async function getAvailableCategories(context = "home") {
  await dbConnect();

  const query = { isActive: true };

  if (context === "home") {
    query.showOnHome = true;
  } else if (context === "signup") {
    query.showInSignup = true;
    query.isAvailable = true; // Only show actually usable ones in signup
  } else if (context === "dashboard") {
    query.showInDashboard = true;
  } else if (context === "generate") {
    query.isAvailable = true;
  }

  return Category.find(query).sort({ sortOrder: 1, name: 1 }).lean();
}

/**
 * Checks if a specific category is selectable by a user in terms of availability and locking.
 */
export async function isCategorySelectable(categorySlug) {
  await dbConnect();
  const category = await Category.findOne({ slug: categorySlug });

  if (!category) return false;
  if (!category.isActive) return false;
  if (!category.isAvailable) return false;
  if (category.isLocked) return false;

  return true;
}

/**
 * Validates a list of purposes against available categories.
 */
export async function filterAvailablePurposes(purposes) {
  if (!purposes || !Array.isArray(purposes)) return [];

  await dbConnect();
  const availableCategories = await Category.find({
    slug: { $in: purposes },
    isActive: true,
    isAvailable: true,
    isLocked: false,
  }).select("slug");

  const validSlugs = availableCategories.map((c) => c.slug);
  return purposes.filter((p) => validSlugs.includes(p));
}

export async function getCategoryBySlug(slug) {
  await dbConnect();
  return Category.findOne({ slug }).lean();
}

/**
 * Seeds the initial categories if they don't exist.
 */
export async function seedCategories() {
  await dbConnect();

  const defaultCategories = [
    {
      slug: "portfolio",
      name: "Portfolio",
      label: "Portfolio",
      description:
        "For students, developers, freelancers, designers, professionals, and personal brands.",
      icon: "User",
      isActive: true,
      isAvailable: true,
      isLocked: false,
      showOnHome: true,
      showInSignup: true,
      showInDashboard: true,
      sortOrder: 1,
      badge: "Popular",
    },
    {
      slug: "business",
      name: "Business",
      label: "Business",
      description:
        "For small businesses, service providers, shops, companies, and local brands.",
      icon: "Briefcase",
      isActive: true,
      isAvailable: false,
      isLocked: true,
      showOnHome: true,
      showInSignup: true,
      showInDashboard: true,
      sortOrder: 2,
      lockedReason: "Coming soon",
    },
    {
      slug: "salon",
      name: "Salon",
      label: "Salon / Beauty",
      description:
        "For salons, beauty parlors, barbershops, makeup artists, spas, and beauty brands.",
      icon: "Scissors",
      isActive: true,
      isAvailable: false,
      isLocked: true,
      showOnHome: true,
      showInSignup: true,
      showInDashboard: true,
      sortOrder: 3,
      lockedReason: "Coming soon",
    },
    {
      slug: "ecommerce",
      name: "Ecommerce",
      label: "E-commerce Store",
      description:
        "For online stores, product sellers, clothing shops, and small e-commerce brands.",
      icon: "ShoppingBag",
      isActive: true,
      isAvailable: false,
      isLocked: true,
      showOnHome: true,
      showInSignup: true,
      showInDashboard: true,
      sortOrder: 4,
      lockedReason: "Coming soon",
    },
    {
      slug: "restaurant",
      name: "Restaurant",
      label: "Restaurant / Food",
      description:
        "For restaurants, cafes, food delivery services, and culinary blogs.",
      icon: "Utensils",
      isActive: true,
      isAvailable: false,
      isLocked: true,
      showOnHome: false,
      showInSignup: false,
      showInDashboard: true,
      sortOrder: 5,
      lockedReason: "Planned",
    },
  ];

  for (const cat of defaultCategories) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $setOnInsert: cat },
      { upsert: true, new: true },
    );
  }

  return { success: true, message: "Categories seeded successfully" };
}
