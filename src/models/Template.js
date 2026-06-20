import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ["portfolio", "business", "restaurant", "clinic", "realestate", "agency", "school", "ecommerce"],
      default: "portfolio",
    },
    description: String,
    previewImage: String,
    componentKey: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    supportedThemes: [String],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Template || mongoose.model("Template", templateSchema);
