import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: ["portfolio", "business", "landing-page", "restaurant", "clinic", "realestate", "agency", "school", "ecommerce"],
      default: "portfolio",
      index: true,
    },
    purpose: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    previewImage: { type: String, default: "", trim: true },
    thumbnailImage: { type: String, default: "", trim: true },
    galleryImages: { type: [String], default: [] },
    pages: {
      type: [
        {
          name: { type: String, default: "" },
          slug: { type: String, default: "" },
          path: { type: String, default: "" },
          sections: { type: [String], default: [] },
          optional: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    sections: { type: [String], default: [] },
    dataBindings: { type: mongoose.Schema.Types.Mixed, default: {} },
    requiredFields: { type: [String], default: [] },
    optionalFields: { type: [String], default: [] },
    bestFor: { type: String, default: "", trim: true },
    recommendedThemes: { type: [String], default: [] },
    layoutStyle: { type: String, default: "balanced", trim: true },
    status: {
      type: String,
      enum: ["active", "draft", "coming_soon", "planned", "hidden"],
      default: "active",
      index: true,
    },
    availablePlans: {
      type: [String],
      enum: ["free", "basic", "pro"],
      default: ["free", "basic", "pro"],
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublic: { type: Boolean, default: true, index: true },
    componentKey: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    supportedThemes: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: {
      type: Number,
      default: 0,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

templateSchema.pre("validate", function () {
  if (!this.status) this.status = this.isActive === false ? "draft" : "active";
  if (this.status === "active") this.isActive = true;
  if (["draft", "hidden"].includes(this.status)) this.isActive = false;
  if (!this.sortOrder && this.order) this.sortOrder = this.order;
  if (!this.sections?.length && this.supportedSections?.length) {
    this.sections = this.supportedSections;
  }
  if (!this.recommendedThemes?.length && this.supportedThemes?.length) {
    this.recommendedThemes = this.supportedThemes;
  }
  if (!this.thumbnailImage && this.previewImage) this.thumbnailImage = this.previewImage;
});

export default mongoose.models.Template || mongoose.model("Template", templateSchema);
