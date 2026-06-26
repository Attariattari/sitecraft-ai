import dbConnect from "@/lib/dbConnect";
import FeatureFlag from "@/models/FeatureFlag";

export const defaultFeatureFlags = [
  {
    key: "ai_website_generation",
    name: "AI Website Generation",
    description:
      "Generate website structure, content direction, and layout foundation based on user purpose and information.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Faster website creation",
    sortOrder: 1,
  },
  {
    key: "purpose_based_builder",
    name: "Purpose-Based Website Builder",
    description:
      "Choose supported website purposes and guide generation with category-specific context.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users",
    benefit: "More relevant website foundations",
    sortOrder: 2,
  },
  {
    key: "personal_info_system",
    name: "Personal Info System",
    description:
      "Use shared global information and purpose-specific information for personalized generation.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Better personalization",
    sortOrder: 3,
  },
  {
    key: "template_selection",
    name: "Template Selection",
    description:
      "Let users choose professional template structures based on website purpose.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Stronger layout starting points",
    sortOrder: 4,
  },
  {
    key: "theme_engine",
    name: "Theme Engine",
    description:
      "Apply generated-website visual themes separately from the platform UI theme.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Flexible generated-site styling",
    sortOrder: 5,
  },
  {
    key: "user_dashboard",
    name: "User Dashboard",
    description:
      "Manage websites, profile, personal info, themes, settings, and account details.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users",
    benefit: "One place to manage website work",
    sortOrder: 6,
  },
  {
    key: "super_admin_controls",
    name: "Protected Platform Operations",
    description:
      "Keep sensitive platform settings and access workflows protected.",
    status: "Available Now",
    enabled: true,
    audience: "Admin",
    usedBy: "Platform Team",
    benefit: "Operational control",
    isPublic: false,
    sortOrder: 7,
  },
  {
    key: "secure_authentication",
    name: "Secure Authentication",
    description:
      "Email verification, Google OAuth, protected access, and role-based admin security.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users/Admin",
    benefit: "Safer account access",
    sortOrder: 8,
  },
  {
    key: "google_oauth",
    name: "Google OAuth",
    description: "Let users sign in with Google OAuth.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Faster sign-in",
    sortOrder: 9,
  },
  {
    key: "cloudinary_media_support",
    name: "Cloudinary Media Support",
    description:
      "Support profile images and future generated-website media assets through Cloudinary.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Managed media support",
    sortOrder: 10,
  },
  {
    key: "category_management",
    name: "Protected Category Operations",
    description: "Keep category availability and public visibility professionally controlled.",
    status: "Available Now",
    enabled: true,
    audience: "Admin",
    usedBy: "Platform Team",
    benefit: "Controlled purpose availability",
    isPublic: false,
    sortOrder: 11,
  },
  {
    key: "platform_theme_control",
    name: "Protected Platform Theme System",
    description:
      "Keep the main public website and dashboard aligned with protected theme settings.",
    status: "Available Now",
    enabled: true,
    audience: "Admin",
    usedBy: "Platform Team",
    benefit: "Consistent brand UI",
    isPublic: false,
    sortOrder: 12,
  },
  {
    key: "light_dark_mode",
    name: "Light/Dark Mode",
    description: "Support platform light and dark theme modes.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Theme-aware experience",
    sortOrder: 13,
  },
  {
    key: "responsive_design",
    name: "Responsive Design",
    description: "Support desktop, tablet, and mobile public experiences.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Visitors",
    benefit: "Works across devices",
    sortOrder: 14,
  },
  {
    key: "seo_metadata_structure",
    name: "SEO Metadata Structure",
    description:
      "Use metadata, clean headings, and structured content hierarchy on public pages.",
    status: "Available Now",
    enabled: true,
    audience: "All Users",
    usedBy: "Visitors",
    benefit: "Better discoverability foundation",
    sortOrder: 15,
  },
  {
    key: "advanced_website_editor",
    name: "Advanced Website Editor",
    description: "Expand editing beyond the initial generated foundation.",
    status: "In Progress",
    enabled: false,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Deeper customization",
    sortOrder: 30,
  },
  {
    key: "ai_theme_recommendation",
    name: "AI Theme Recommendation",
    description: "Recommend themes based on user purpose and website style.",
    status: "In Progress",
    enabled: false,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Better design matching",
    sortOrder: 31,
  },
  {
    key: "website_analytics",
    name: "Website Analytics",
    description: "Show performance and usage insights for websites.",
    status: "In Progress",
    enabled: false,
    audience: "Users/Admin",
    usedBy: "Users/Admin",
    benefit: "Performance insights",
    sortOrder: 32,
  },
  {
    key: "custom_domains",
    name: "Custom Domain Setup",
    description: "Allow users to connect their own domain names.",
    status: "In Progress",
    enabled: false,
    audience: "Pro+",
    usedBy: "Users",
    benefit: "Professional publishing",
    sortOrder: 33,
  },
  {
    key: "more_template_categories",
    name: "More Template Categories",
    description: "Add more purpose-specific templates as categories mature.",
    status: "In Progress",
    enabled: false,
    audience: "All Users",
    usedBy: "Users",
    benefit: "More website options",
    sortOrder: 34,
  },
  {
    key: "advanced_blog_automation",
    name: "Advanced Blog Automation",
    description: "Improve blog creation and content automation workflows.",
    status: "In Progress",
    enabled: false,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Content workflow support",
    sortOrder: 35,
  },
  {
    key: "plan_based_theme_access",
    name: "Plan-Based Theme Access",
    description: "Align website theme access with plan rules.",
    status: "In Progress",
    enabled: false,
    audience: "Pro+",
    usedBy: "Users/Admin",
    benefit: "Plan-aware theme control",
    sortOrder: 36,
  },
  {
    key: "real_time_notifications",
    name: "Real-Time Notifications",
    description: "Expand live notification support across product workflows.",
    status: "In Progress",
    enabled: false,
    audience: "All Users",
    usedBy: "Users/Admin",
    benefit: "Timely updates",
    sortOrder: 37,
  },
  {
    key: "team_collaboration",
    name: "Team Collaboration",
    description: "Allow multiple users to collaborate on website work.",
    status: "Coming Soon",
    enabled: false,
    audience: "Agency+",
    usedBy: "Teams/Agencies",
    benefit: "Shared website workflows",
    sortOrder: 60,
  },
  {
    key: "agency_workspace",
    name: "Agency Workspace",
    description: "Support client and multi-site workflows for agencies.",
    status: "Coming Soon",
    enabled: false,
    audience: "Agency+",
    usedBy: "Agencies",
    benefit: "Client-ready operations",
    sortOrder: 61,
  },
  {
    key: "ai_copy_improvements",
    name: "AI Copy Improvements",
    description: "Improve AI-written copy, messaging, and content quality.",
    status: "Coming Soon",
    enabled: false,
    audience: "All Users",
    usedBy: "Users",
    benefit: "Better website messaging",
    sortOrder: 62,
  },
  {
    key: "ai_image_generation",
    name: "AI Image Generation for Websites",
    description: "Generate images and visuals for website sections.",
    status: "Coming Soon",
    enabled: false,
    audience: "Pro+",
    usedBy: "Users",
    benefit: "Richer generated visuals",
    sortOrder: 63,
  },
  {
    key: "ecommerce_product_builder",
    name: "E-commerce Product Builder",
    description: "Create product-focused website content and sections.",
    status: "Coming Soon",
    enabled: false,
    audience: "Business+",
    usedBy: "Users",
    benefit: "Product selling support",
    sortOrder: 64,
  },
  {
    key: "booking_system",
    name: "Booking System",
    description: "Support appointments and booking flows for service websites.",
    status: "Coming Soon",
    enabled: false,
    audience: "Business+",
    usedBy: "Users",
    benefit: "Appointment workflows",
    sortOrder: 65,
  },
  {
    key: "crm_lead_capture_tools",
    name: "CRM/Lead Capture Tools",
    description: "Collect and manage leads from generated websites.",
    status: "Coming Soon",
    enabled: false,
    audience: "Business+",
    usedBy: "Users",
    benefit: "Lead management",
    sortOrder: 66,
  },
  {
    key: "advanced_seo_center",
    name: "Advanced SEO Center",
    description: "Add deeper SEO controls and recommendations.",
    status: "Coming Soon",
    enabled: false,
    audience: "Pro+",
    usedBy: "Users",
    benefit: "Advanced discoverability controls",
    sortOrder: 67,
  },
  {
    key: "website_export",
    name: "Website Export",
    description: "Provide portable website export options.",
    status: "Coming Soon",
    enabled: false,
    audience: "Pro+",
    usedBy: "Users",
    benefit: "Portable output",
    sortOrder: 68,
  },
  {
    key: "white_label_options",
    name: "White Label Options",
    description: "Offer agency-ready branded delivery options.",
    status: "Coming Soon",
    enabled: false,
    audience: "Agency+",
    usedBy: "Agencies",
    benefit: "Branded client delivery",
    sortOrder: 69,
  },
];

function serializeFlag(flag) {
  return {
    ...flag,
    _id: flag._id ? flag._id.toString() : null,
  };
}

export async function seedFeatureFlags({ overwrite = false } = {}) {
  await dbConnect();

  for (const flag of defaultFeatureFlags) {
    await FeatureFlag.findOneAndUpdate(
      { key: flag.key },
      overwrite ? { $set: flag } : { $setOnInsert: flag },
      { upsert: true, new: true, runValidators: true },
    );
  }

  return { success: true, message: "Feature flags synced successfully" };
}

export async function getAllFeatureFlags() {
  await dbConnect();

  let flags = await FeatureFlag.find({})
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  if (!flags || flags.length === 0) {
    await seedFeatureFlags();
    flags = await FeatureFlag.find({})
      .sort({ sortOrder: 1, name: 1 })
      .lean();
  }

  return flags.map(serializeFlag);
}

export async function getPublicFeatureFlags() {
  await dbConnect();

  let flags = await FeatureFlag.find({ isPublic: true, audience: { $ne: "Admin" } })
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  if (!flags || flags.length === 0) {
    await seedFeatureFlags();
    flags = await FeatureFlag.find({ isPublic: true, audience: { $ne: "Admin" } })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
  }

  return flags.map(serializeFlag);
}
