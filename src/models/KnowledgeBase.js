import mongoose from "mongoose";

const KnowledgeBaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    question: { type: String, default: "", trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    tags: { type: [String], default: [], index: true },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "draft",
      index: true,
    },
    visibility: {
      type: String,
      enum: ["public", "admin_only", "ai_only"],
      default: "public",
      index: true,
    },
    priority: { type: Number, default: 0, index: true },
    sourceType: {
      type: String,
      enum: [
        "faq",
        "pricing",
        "feature",
        "category",
        "theme",
        "template",
        "policy",
        "how_it_works",
        "roadmap",
        "general",
      ],
      default: "general",
      index: true,
    },
    relatedPlans: { type: [String], default: [] },
    relatedFeatures: { type: [String], default: [] },
    relatedCategories: { type: [String], default: [] },
    relatedTemplates: { type: [String], default: [] },
    relatedThemes: { type: [String], default: [] },
    isAIAccessible: { type: Boolean, default: false, index: true },
    isPublicFAQ: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    lastReviewedAt: { type: Date },
    reviewStatus: {
      type: String,
      enum: ["verified", "needs_review", "outdated"],
      default: "needs_review",
      index: true,
    },
    createdBy: { type: String, default: "", trim: true },
    updatedBy: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

KnowledgeBaseSchema.index({
  title: "text",
  question: "text",
  answer: "text",
  category: "text",
  tags: "text",
});
KnowledgeBaseSchema.index({
  status: 1,
  visibility: 1,
  isAIAccessible: 1,
  isPublicFAQ: 1,
  reviewStatus: 1,
  priority: -1,
  sortOrder: 1,
});

const KnowledgeBase =
  mongoose.models.KnowledgeBase ||
  mongoose.model("KnowledgeBase", KnowledgeBaseSchema);

export default KnowledgeBase;
