import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    themeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    recommendedPurposes: {
      type: [String],
      default: [],
    },
    previewImage: {
      type: String,
      trim: true,
    },
    colors: {
      primary: String,
      secondary: String,
      accent: String,
      background: String,
      foreground: String,
    },
    tokens: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    showOnHome: {
      type: Boolean,
      default: true,
    },
    showInGenerate: {
      type: Boolean,
      default: true,
    },
    showInDashboard: {
      type: Boolean,
      default: true,
    },
    showInThemeShowcase: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    lockedReason: {
      type: String,
      trim: true,
      default: "Coming soon",
    },
  },
  {
    timestamps: true,
  },
);

themeSchema.index({ themeId: 1 });
themeSchema.index({ slug: 1 });
themeSchema.index({ isActive: 1, isAvailable: 1, isLocked: 1 });

const Theme = mongoose.models.Theme || mongoose.model("Theme", themeSchema);

export default Theme;
