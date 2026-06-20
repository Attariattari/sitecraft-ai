import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Temporary - will be set when auth is implemented
    },
    category: {
      type: String,
      enum: ["portfolio", "business", "restaurant", "clinic", "realestate", "agency", "school", "ecommerce"],
      default: "portfolio",
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },
    themeId: {
      type: String,
      default: "emerald",
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "generated", "published", "archived"],
      default: "draft",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    inputData: {
      name: String,
      profession: String,
      bio: String,
      email: String,
      skills: [String],
      projects: [
        {
          title: String,
          description: String,
          technologies: [String],
          link: String,
        },
      ],
      services: [
        {
          title: String,
          description: String,
        },
      ],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        portfolio: String,
        instagram: String,
      },
      websiteGoal: String,
      designPreference: String,
    },
    generatedContent: {
      hero: {
        headline: String,
        subheadline: String,
        ctaText: String,
      },
      about: {
        title: String,
        description: String,
      },
      skills: [String],
      services: [
        {
          title: String,
          description: String,
        },
      ],
      projects: [
        {
          title: String,
          description: String,
          technologies: [String],
          link: String,
          image: String,
        },
      ],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      cta: {
        title: String,
        description: String,
        buttonText: String,
      },
      contact: {
        headline: String,
        description: String,
      },
      seo: {
        title: String,
        description: String,
        keywords: [String],
      },
      templateRecommendation: {
        templateKey: String,
        reason: String,
      },
      themeRecommendation: {
        themeId: String,
        reason: String,
      },
      suggestions: [String],
    },
    settings: {
      selectedTheme: String,
      selectedTemplate: String,
      mode: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      customDomain: String,
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      { key: { slug: 1 }, unique: true, sparse: true },
      { key: { ownerId: 1 } },
      { key: { category: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: -1 } },
    ],
  }
);

export default mongoose.models.Site || mongoose.model("Site", siteSchema);
