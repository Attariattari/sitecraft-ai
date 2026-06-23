import mongoose from "mongoose";

const featureFlagSchema = new mongoose.Schema(
  {
    key: {
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available Now", "In Progress", "Coming Soon"],
      default: "Coming Soon",
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    audience: {
      type: String,
      default: "All Users",
      trim: true,
    },
    usedBy: {
      type: String,
      default: "Users",
      trim: true,
    },
    benefit: {
      type: String,
      default: "",
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

featureFlagSchema.index({ key: 1 });
featureFlagSchema.index({ isPublic: 1, status: 1 });

const FeatureFlag =
  mongoose.models.FeatureFlag ||
  mongoose.model("FeatureFlag", featureFlagSchema);

export default FeatureFlag;
