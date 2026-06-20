import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

/**
 * SiteCraft AI - Central Category Service
 * Handles all category availability and status logic.
 */

export const defaultCategories = [
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
    label: "Business Websites",
    description: "Corporate sites for agencies and established brands.",
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
    description: "For salons, beauty parlors, barbershops, and beauty brands.",
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
    label: "E-commerce Stores",
    description: "Full online catalogs with integrated AI marketing.",
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
    label: "Restaurant Websites",
    description: "Menus, reservations, and stunning food displays.",
    icon: "Utensils",
    isActive: true,
    isAvailable: false,
    isLocked: true,
    showOnHome: true,
    showInSignup: true,
    showInDashboard: true,
    sortOrder: 5,
    lockedReason: "Roadmap",
  },
  {
    slug: "clinic",
    name: "Clinic",
    label: "Clinic Websites",
    description: "Professional layouts for healthcare providers.",
    icon: "Stethoscope",
    isActive: true,
    isAvailable: false,
    isLocked: true,
    showOnHome: true,
    showInSignup: false,
    showInDashboard: true,
    sortOrder: 6,
    lockedReason: "Planned",
  },
  {
    slug: "realEstate",
    name: "RealEstate",
    label: "Real Estate Websites",
    description: "Property listings and agent portfolios.",
    icon: "Home",
    isActive: true,
    isAvailable: false,
    isLocked: true,
    showOnHome: true,
    showInSignup: false,
    showInDashboard: true,
    sortOrder: 7,
    lockedReason: "Planned",
  },
  {
    slug: "agency",
    name: "Agency",
    label: "Agency Websites",
    description: "Showcase client work and team expertise.",
    icon: "Users",
    isActive: true,
    isAvailable: false,
    isLocked: true,
    showOnHome: true,
    showInSignup: false,
    showInDashboard: true,
    sortOrder: 8,
    lockedReason: "Planned",
  },
  {
    slug: "school",
    name: "School",
    label: "School Websites",
    description: "Info portals for educational institutions.",
    icon: "GraduationCap",
    isActive: true,
    isAvailable: false,
    isLocked: true,
    showOnHome: true,
    showInSignup: false,
    showInDashboard: true,
    sortOrder: 9,
    lockedReason: "Planned",
  },
  {
    slug: "landingPage",
    name: "LandingPage",
    label: "Landing Pages",
    description: "High-converting single pages for campaigns.",
    icon: "Globe",
    isActive: true,
    isAvailable: false,
    isLocked: true,
    showOnHome: true,
    showInSignup: false,
    showInDashboard: true,
    sortOrder: 10,
    lockedReason: "Planned",
  },
];

export async function getAllCategories() {
  await dbConnect();
  const dbCategories = await Category.find({})
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  if (!dbCategories || dbCategories.length === 0) {
    return defaultCategories;
  }

  return dbCategories;
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

  const dbCategories = await Category.find(query)
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  if (!dbCategories || dbCategories.length === 0) {
    // Return filtered fallback categories
    return defaultCategories.filter((cat) => {
      if (!cat.isActive) return false;
      if (context === "home") return cat.showOnHome;
      if (context === "signup") return cat.showInSignup && cat.isAvailable;
      if (context === "dashboard") return cat.showInDashboard;
      if (context === "generate") return cat.isAvailable;
      return true;
    });
  }

  return dbCategories;
}

/**
 * Checks if a specific category is selectable by a user in terms of availability and locking.
 */
export async function isCategorySelectable(categorySlug) {
  await dbConnect();
  const category = await Category.findOne({ slug: categorySlug });

  if (!category) {
    // Fallback check
    const fallback = defaultCategories.find((c) => c.slug === categorySlug);
    if (!fallback) return false;
    return fallback.isActive && fallback.isAvailable && !fallback.isLocked;
  }

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

  if (availableCategories.length === 0) {
    // Fallback
    return purposes.filter((p) => {
      const fallback = defaultCategories.find((c) => c.slug === p);
      return (
        fallback &&
        fallback.isActive &&
        fallback.isAvailable &&
        !fallback.isLocked
      );
    });
  }

  const validSlugs = availableCategories.map((c) => c.slug);
  return purposes.filter((p) => validSlugs.includes(p));
}

export async function getCategoryBySlug(slug) {
  await dbConnect();
  const cat = await Category.findOne({ slug }).lean();
  if (!cat) {
    return defaultCategories.find((c) => c.slug === slug) || null;
  }
  return cat;
}

/**
 * Seeds the initial categories if they don't exist.
 */
export async function seedCategories() {
  await dbConnect();

  for (const cat of defaultCategories) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true },
    );
  }

  return { success: true, message: "Categories seeded successfully" };
}
