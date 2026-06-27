import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "failed"],
      default: "pending",
    },
    score: { type: Number, default: 0 },
    issues: { type: [String], default: [] },
    retryCount: { type: Number, default: 0 },
    verifiedAt: { type: Date },
  },
  { _id: false },
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    alt: { type: String, default: "" },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  { _id: false },
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    keywords: { type: [String], default: [] },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, required: true, trim: true },
    canonicalUrl: { type: String, default: "" },
    readTime: { type: Number, default: 1 },
    authorType: {
      type: String,
      enum: ["admin", "ai", "system"],
      default: "admin",
    },
    authorName: { type: String, default: "SiteCraft AI Team" },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected", "archived"],
      default: "draft",
      index: true,
    },
    source: {
      type: String,
      enum: ["manual", "ai_auto", "ai_manual"],
      default: "manual",
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isAIGenerated: { type: Boolean, default: false, index: true },
    aiProvider: { type: String, default: "" },
    aiModel: { type: String, default: "" },
    aiPromptVersion: { type: String, default: "" },
    contentVerification: { type: verificationSchema, default: () => ({}) },
    image: { type: imageSchema, default: () => ({}) },
    imagePrompt: { type: String, default: "" },
    imageVerification: { type: verificationSchema, default: () => ({}) },
    publishAt: { type: Date },
    publishedAt: { type: Date, index: true },
    scheduledFor: { type: Date },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true },
);

blogSchema.index({ title: "text", summary: "text", content: "text", tags: "text" });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
