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
    },
    plan: {
      type: String,
      enum: ["free", "basic", "pro", "agency"],
      required: true,
    },
    recommendedThemeIds: {
      type: [String],
      required: true,
      default: [],
    },
    reasoning: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      enum: ["ai", "fallback"],
      default: "fallback",
    },
    // Hash of available themes at time of recommendation
    // Used to invalidate cache when themes change
    availableThemeHash: {
      type: String,
      default: "",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: { expireAfterSeconds: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
  }
);

// In development, always delete the cached model to prevent stale hooks
if (process.env.NODE_ENV !== "production" && mongoose.models.ThemeRecommendation) {
  delete mongoose.models.ThemeRecommendation;
}

const ThemeRecommendation =
  mongoose.models.ThemeRecommendation ||
  mongoose.model("ThemeRecommendation", ThemeRecommendationSchema);

export default ThemeRecommendation;
