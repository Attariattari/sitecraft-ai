import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      enum: ["free", "basic", "pro", "agency"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    bestFor: {
      type: String,
      default: "",
      trim: true,
    },
    priceMonthly: {
      type: Number,
      default: 0,
      min: 0,
    },
    priceYearly: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
      uppercase: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPurchasable: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "future", "disabled"],
      default: "active",
      index: true,
    },
    comingSoon: {
      type: Boolean,
      default: false,
    },
    ctaType: {
      type: String,
      enum: ["signup", "checkout", "none"],
      default: "checkout",
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    features: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    limits: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ctaLabel: {
      type: String,
      default: "",
      trim: true,
    },
    badge: {
      type: String,
      default: "",
      trim: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    trialDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    bonusMonths: {
      type: Number,
      default: 0,
      min: 0,
    },
    highlights: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

PlanSchema.index({ slug: 1 }, { unique: true });
PlanSchema.index({ isActive: 1, isPublic: 1, isPurchasable: 1, sortOrder: 1 });

const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);

export default Plan;
