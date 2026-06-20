import mongoose from "mongoose";

const ThemeRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    selectedPurpose: {
      type: String,
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "basic", "pro", "agency"],
      required: true,
      index: true,
    },
    recommendedThemeIds: {
      type: [String],
      required: true,
      default: [],
    },
    reasoning: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    source: {
      type: String,
      enum: ["ai", "fallback", "cache", "admin"],
      default: "cache",
    },
    availableThemeHash: {
      type: String,
      default: "",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for fast lookups
ThemeRecommendationSchema.index({
  userId: 1,
  selectedPurpose: 1,
  plan: 1,
});

// In development, always delete the cached model to prevent stale hooks
if (process.env.NODE_ENV !== "production" && mongoose.models.ThemeRecommendation) {
  delete mongoose.models.ThemeRecommendation;
}

const ThemeRecommendation =
  mongoose.models.ThemeRecommendation ||
  mongoose.model("ThemeRecommendation", ThemeRecommendationSchema);

export default ThemeRecommendation;
