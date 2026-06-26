import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
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
    icon: {
      type: String, // Lucide icon name or image path
      default: "Layout",
    },
    image: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: true,
    },
    showOnHome: {
      type: Boolean,
      default: false,
    },
    showInSignup: {
      type: Boolean,
      default: false,
    },
    showInDashboard: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      trim: true,
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

// Search indexes
categorySchema.index({ isActive: 1, isAvailable: 1 });

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
