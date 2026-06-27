import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import BlogAutomationSetting from "@/models/BlogAutomationSetting";
import BlogAutomationLog from "@/models/BlogAutomationLog";
import { BLOG_CATEGORIES, BLOG_SOURCES, BLOG_STATUSES } from "@/lib/blogs/blogConstants";
import { getOrSetCache, safeCacheKey } from "@/lib/server/cache/cache";
import { serverEnv } from "@/lib/server/env";

export function slugifyBlogTitle(title = "") {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function splitList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function estimateReadTime(content = "") {
  const words = String(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function serializeBlog(blog) {
  if (!blog) return null;
  const item = blog.toObject ? blog.toObject() : blog;
  return {
    ...item,
    id: item._id?.toString?.() || item.id,
    _id: item._id?.toString?.() || item._id,
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString() : null,
    publishAt: item.publishAt ? new Date(item.publishAt).toISOString() : null,
    scheduledFor: item.scheduledFor ? new Date(item.scheduledFor).toISOString() : null,
  };
}

export function serializeLog(log) {
  const item = log?.toObject ? log.toObject() : log;
  if (!item) return null;
  return {
    ...item,
    id: item._id?.toString?.() || item.id,
    _id: item._id?.toString?.() || item._id,
    blogId: item.blogId?._id?.toString?.() || item.blogId?.toString?.() || item.blogId,
    startedAt: item.startedAt ? new Date(item.startedAt).toISOString() : null,
    finishedAt: item.finishedAt ? new Date(item.finishedAt).toISOString() : null,
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
  };
}

export function sanitizeBlogInput(input = {}, user = null) {
  const title = String(input.title || "").trim();
  const content = String(input.content || "").trim();
  const summary = String(input.summary || "").trim();
  const metaDescription = String(input.metaDescription || summary || "").trim();
  const slug = slugifyBlogTitle(input.slug || title);
  const status = BLOG_STATUSES.includes(input.status) ? input.status : "draft";
  const source = BLOG_SOURCES.includes(input.source) ? input.source : "manual";
  const category = BLOG_CATEGORIES.includes(input.category)
    ? input.category
    : BLOG_CATEGORIES[0];

  return {
    title,
    slug,
    summary,
    content,
    excerpt: String(input.excerpt || summary).trim().slice(0, 240),
    category,
    tags: splitList(input.tags),
    keywords: splitList(input.keywords),
    metaTitle: String(input.metaTitle || title).trim().slice(0, 70),
    metaDescription,
    canonicalUrl: String(input.canonicalUrl || "").trim(),
    readTime: Number(input.readTime || estimateReadTime(content)),
    authorType: input.authorType || "admin",
    authorName: String(input.authorName || user?.name || "SiteCraft AI Team").trim(),
    status,
    source,
    isFeatured: Boolean(input.isFeatured),
    isAIGenerated: Boolean(input.isAIGenerated),
    aiProvider: String(input.aiProvider || "").trim(),
    aiModel: String(input.aiModel || "").trim(),
    aiPromptVersion: String(input.aiPromptVersion || "").trim(),
    contentVerification: input.contentVerification || undefined,
    image: {
      url: String(input.image?.url || input.imageUrl || "").trim(),
      publicId: String(input.image?.publicId || "").trim(),
      alt: String(input.image?.alt || input.imageAlt || title).trim(),
      width: Number(input.image?.width || 0),
      height: Number(input.image?.height || 0),
    },
    imagePrompt: String(input.imagePrompt || "").trim(),
    imageVerification: input.imageVerification || undefined,
    publishAt: input.publishAt ? new Date(input.publishAt) : undefined,
    publishedAt:
      status === "published"
        ? input.publishedAt
          ? new Date(input.publishedAt)
          : new Date()
        : undefined,
    scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : undefined,
    createdBy: user?.email || user?.id || input.createdBy || "",
    updatedBy: user?.email || user?.id || input.updatedBy || "",
  };
}

export function validateBlogPayload(payload) {
  const errors = [];
  if (!payload.title) errors.push("Title is required.");
  if (!payload.slug) errors.push("Slug is required.");
  if (!payload.summary) errors.push("Summary is required.");
  if (!payload.content) errors.push("Content is required.");
  if (!payload.category) errors.push("Category is required.");
  if (!payload.metaDescription) errors.push("Meta description is required.");
  if (payload.metaDescription && payload.metaDescription.length > 180) {
    errors.push("Meta description should stay near 150-160 characters.");
  }
  return errors;
}

export async function ensureUniqueSlug(slug, ignoreId = null) {
  await dbConnect();
  let candidate = slug || "sitecraft-ai-blog";
  let suffix = 1;
  while (true) {
    const query = { slug: candidate };
    if (ignoreId) query._id = { $ne: ignoreId };
    const existing = await Blog.findOne(query).select("_id").lean();
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${slug}-${suffix}`;
  }
}

export async function getPublicBlogs({ search = "", category = "", tag = "", limit = 24 } = {}) {
  const key = safeCacheKey(["public", "blog", "list", search, category, tag, limit]);
  return getOrSetCache(key, serverEnv.CACHE_DEFAULT_TTL_SECONDS, async () => {
    await dbConnect();
    const query = { status: "published" };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    const blogs = await Blog.find(query)
      .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
      .limit(Math.min(Number(limit) || 24, 60))
      .lean();
    return blogs.map(serializeBlog);
  });
}

export async function getPublicBlogBySlug(slug) {
  return getOrSetCache(`public:blog:slug:${slug}`, 900, async () => {
    await dbConnect();
    const blog = await Blog.findOne({ slug, status: "published" }).lean();
    return serializeBlog(blog);
  });
}

export async function getAdminBlogs(filters = {}) {
  await dbConnect();
  const query = {};
  if (filters.status && filters.status !== "all") query.status = filters.status;
  if (filters.category && filters.category !== "all") query.category = filters.category;
  if (filters.source && filters.source !== "all") query.source = filters.source;
  if (filters.aiGenerated === "true") query.isAIGenerated = true;
  if (filters.featured === "true") query.isFeatured = true;
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { slug: { $regex: filters.search, $options: "i" } },
      { summary: { $regex: filters.search, $options: "i" } },
    ];
  }
  const blogs = await Blog.find(query).sort({ createdAt: -1 }).limit(200).lean();
  return blogs.map(serializeBlog);
}

export async function getBlogStats() {
  await dbConnect();
  const [total, draft, pending, published, aiGenerated, rejected, scheduled] =
    await Promise.all([
      Blog.countDocuments({}),
      Blog.countDocuments({ status: "draft" }),
      Blog.countDocuments({ status: "pending" }),
      Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ isAIGenerated: true }),
      Blog.countDocuments({ status: "rejected" }),
      Blog.countDocuments({ scheduledFor: { $exists: true, $ne: null } }),
    ]);
  return { total, draft, pending, published, aiGenerated, rejected, scheduled };
}

export async function getAutomationSettings() {
  await dbConnect();
  let settings = await BlogAutomationSetting.findOne({}).lean();
  if (!settings) {
    const created = await BlogAutomationSetting.create({
      enabled: false,
      frequencyHours: 24,
      autoPublishAfterAIApproval: false,
      maxContentRetries: 2,
      maxImageRetries: 2,
      defaultStatus: "pending",
      allowedCategories: BLOG_CATEGORIES,
      blockedTopics: [],
      nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    settings = created.toObject();
  }
  return serializeBlog(settings);
}

export async function updateAutomationSettings(input = {}, user = null) {
  await dbConnect();
  const frequencyHours = Math.max(1, Math.min(168, Number(input.frequencyHours || 24)));
  const payload = {
    enabled: Boolean(input.enabled),
    frequencyHours,
    autoPublishAfterAIApproval: Boolean(input.autoPublishAfterAIApproval),
    maxContentRetries: Math.max(0, Math.min(5, Number(input.maxContentRetries ?? 2))),
    maxImageRetries: Math.max(0, Math.min(5, Number(input.maxImageRetries ?? 2))),
    defaultStatus: ["draft", "pending", "published"].includes(input.defaultStatus)
      ? input.defaultStatus
      : "pending",
    allowedCategories: splitList(input.allowedCategories).filter((cat) =>
      BLOG_CATEGORIES.includes(cat),
    ),
    blockedTopics: splitList(input.blockedTopics),
    nextRunAt: new Date(Date.now() + frequencyHours * 60 * 60 * 1000),
    updatedBy: user?.email || user?.id || "",
  };
  const settings = await BlogAutomationSetting.findOneAndUpdate({}, payload, {
    upsert: true,
    returnDocument: "after",
  }).lean();
  return serializeBlog(settings);
}

export async function getAutomationLogs(limit = 30) {
  await dbConnect();
  const logs = await BlogAutomationLog.find({})
    .sort({ startedAt: -1 })
    .limit(Math.min(Number(limit) || 30, 100))
    .lean();
  return logs.map(serializeLog);
}

export async function hasRecentSimilarBlog(title, category) {
  await dbConnect();
  const slug = slugifyBlogTitle(title);
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const existing = await Blog.findOne({
    createdAt: { $gte: since },
    $or: [
      { slug },
      { title: { $regex: title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
    ],
  })
    .select("_id title slug category")
    .lean();
  return existing;
}
