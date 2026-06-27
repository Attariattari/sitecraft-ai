import mongoose from "mongoose";

const siteBlogPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true, index: true },
    siteSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    category: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    featuredImage: { type: String, default: "", trim: true },
    status: { type: String, enum: ["draft", "pending", "published", "archived"], default: "draft", index: true },
    isAIGenerated: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: { type: [String], default: [] },
      ogImage: { type: String, default: "" },
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

siteBlogPostSchema.index({ siteSlug: 1, slug: 1 }, { unique: true });

export default mongoose.models.SiteBlogPost || mongoose.model("SiteBlogPost", siteBlogPostSchema);
