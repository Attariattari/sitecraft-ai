import mongoose from "mongoose";

const planDisplaySchema = new mongoose.Schema(
  {
    included: { type: Boolean, default: false },
    label: { type: String, default: "", trim: true },
    limitText: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const FeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    featureKey: { type: String, default: "", trim: true },
    shortDescription: { type: String, required: true, trim: true },
    longDescription: { type: String, default: "", trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "ai_generation",
        "themes_templates",
        "dashboard_management",
        "seo_growth",
        "security_auth",
        "admin_controls",
        "agency_tools",
        "billing_plans",
        "media_content",
        "publishing",
      ],
      index: true,
    },
    icon: { type: String, default: "Sparkles", trim: true },
    status: {
      type: String,
      enum: ["available", "in_progress", "coming_soon"],
      default: "coming_soon",
      index: true,
    },
    publicVisible: { type: Boolean, default: true, index: true },
    pricingVisible: { type: Boolean, default: true },
    dashboardVisible: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0, index: true },
    badge: { type: String, default: "", trim: true },
    isPopular: { type: Boolean, default: false },
    isHighlighted: { type: Boolean, default: false },
    plans: {
      free: { type: planDisplaySchema, default: () => ({}) },
      basic: { type: planDisplaySchema, default: () => ({}) },
      pro: { type: planDisplaySchema, default: () => ({}) },
      agency: { type: planDisplaySchema, default: () => ({}) },
    },
    limits: { type: mongoose.Schema.Types.Mixed, default: {} },
    benefits: { type: [String], default: [] },
    useCases: { type: [String], default: [] },
    ctaLabel: { type: String, default: "", trim: true },
    ctaHref: { type: String, default: "", trim: true },
    updatedBy: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

FeatureSchema.index({ publicVisible: 1, category: 1, sortOrder: 1 });
FeatureSchema.index({ pricingVisible: 1, sortOrder: 1 });

const Feature = mongoose.models.Feature || mongoose.model("Feature", FeatureSchema);

export default Feature;
