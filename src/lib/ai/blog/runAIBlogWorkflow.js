import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import BlogAutomationLog from "@/models/BlogAutomationLog";
import BlogAutomationSetting from "@/models/BlogAutomationSetting";
import {
  ensureUniqueSlug,
  getAutomationSettings,
  hasRecentSimilarBlog,
  sanitizeBlogInput,
} from "@/lib/blogs/blogService";
import { generateBlogImage } from "@/lib/ai/blog/generateBlogImage";
import { generateSiteCraftBlog } from "@/lib/ai/blog/generateSiteCraftBlog";
import { invalidateBlogCache } from "@/lib/server/cache/cacheInvalidation";

let inMemoryLock = false;

async function updateLog(log, patch) {
  Object.assign(log, patch);
  await log.save();
}

export async function runAIBlogWorkflow({
  source = "ai_manual",
  triggeredBy = "system",
  force = false,
  topic = "",
} = {}) {
  await dbConnect();

  if (inMemoryLock) {
    return { success: false, skipped: true, message: "AI blog generation is already running." };
  }

  const settings = await getAutomationSettings();
  if (!force && !settings.enabled) {
    return { success: false, skipped: true, message: "AI blog automation is disabled." };
  }

  const recentRun = await BlogAutomationLog.findOne({
    status: "running",
    startedAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) },
  }).lean();
  if (recentRun) {
    return { success: false, skipped: true, message: "A recent AI blog run is still locked." };
  }

  if (!force) {
    const lastRun = settings.lastRunAt ? new Date(settings.lastRunAt) : null;
    const nextAllowed = lastRun
      ? new Date(lastRun.getTime() + Number(settings.frequencyHours || 24) * 60 * 60 * 1000)
      : null;
    if (nextAllowed && nextAllowed > new Date()) {
      return {
        success: false,
        skipped: true,
        message: "AI blog generation already ran inside the configured frequency window.",
      };
    }
  }

  inMemoryLock = true;
  const runId = crypto.randomUUID();
  const log = await BlogAutomationLog.create({
    runId,
    status: "running",
    message: "AI blog generation started.",
    startedAt: new Date(),
  });

  try {
    let generated = null;
    let duplicate = null;
    let retries = 0;
    const maxContentRetries = Number(settings.maxContentRetries ?? 2);

    for (let attempt = 0; attempt <= maxContentRetries; attempt += 1) {
      generated = await generateSiteCraftBlog({ topic });
      duplicate = await hasRecentSimilarBlog(generated.blog.title, generated.blog.category);
      retries = attempt;
      if (generated.usedFallback && duplicate) {
        const freshAngle = new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-");
        generated.blog.title = `${generated.blog.title}: Fresh SiteCraft AI Notes ${freshAngle}`;
        generated.blog.slug = `${generated.blog.slug}-${freshAngle}`;
        duplicate = null;
        break;
      }
      if (generated.usedFallback) break;
      if (!duplicate) break;
      topic = `${topic || generated.blog.category} with a different practical angle ${attempt + 1}`;
    }

    if (duplicate) {
      await updateLog(log, {
        status: "skipped",
        message: "Skipped because generated topic was too similar to recent blog content.",
        topic: generated?.blog?.title || "",
        retries,
        finishedAt: new Date(),
      });
      return { success: false, skipped: true, message: log.message };
    }

    const contentVerification = generated.contentVerification;
    if (contentVerification.status !== "approved") {
      const payload = sanitizeBlogInput({
        ...generated.blog,
        status: "rejected",
        source,
        isAIGenerated: true,
        authorType: "ai",
        authorName: "SiteCraft AI",
        contentVerification,
      });
      payload.slug = await ensureUniqueSlug(payload.slug);
      const blog = await Blog.create(payload);
      await updateLog(log, {
        status: "failed",
        message: "AI blog content failed verification.",
        topic: generated.blog.title,
        blogId: blog._id,
        contentStatus: "failed",
        retries,
        errors: contentVerification.issues,
        finishedAt: new Date(),
      });
      return { success: false, blog: blog.toObject(), message: log.message };
    }

    const imageResult = await generateBlogImage(generated.blog);
    const imageApproved = imageResult.imageVerification.status === "approved";
    const shouldPublish =
      Boolean(settings.autoPublishAfterAIApproval) &&
      imageApproved &&
      contentVerification.status === "approved";

    const status = shouldPublish ? "published" : settings.defaultStatus || "pending";
    const payload = sanitizeBlogInput({
      ...generated.blog,
      slug: generated.blog.slug,
      status,
      source,
      isAIGenerated: true,
      authorType: "ai",
      authorName: "SiteCraft AI",
      aiProvider: generated.blog.aiProvider,
      aiModel: generated.blog.aiModel,
      aiPromptVersion: generated.blog.aiPromptVersion,
      contentVerification,
      image: imageResult.image,
      imagePrompt: imageResult.imagePrompt,
      imageVerification: imageResult.imageVerification,
    });
    payload.slug = await ensureUniqueSlug(payload.slug);
    const blog = await Blog.create(payload);
    await invalidateBlogCache(payload.status === "published" ? payload.slug : "");

    const nextRunAt = new Date(Date.now() + Number(settings.frequencyHours || 24) * 60 * 60 * 1000);
    await BlogAutomationSetting.findOneAndUpdate(
      {},
      { lastRunAt: new Date(), nextRunAt },
      { upsert: true, returnDocument: "after" },
    );

    await updateLog(log, {
      status: "success",
      message: shouldPublish
        ? "AI blog generated and auto-published."
        : generated.quotaLimited
          ? "Gemini quota is currently exceeded, so a safe fallback blog was created for review."
          : "AI blog generated and waiting for review.",
      topic: generated.blog.title,
      blogId: blog._id,
      contentStatus: contentVerification.status,
      imageStatus: imageResult.imageVerification.status,
      retries,
      errors: imageApproved ? [] : imageResult.imageVerification.issues,
      finishedAt: new Date(),
    });

    return {
      success: true,
      blog: blog.toObject(),
      message: log.message,
      usedFallback: Boolean(generated.usedFallback),
      quotaLimited: Boolean(generated.quotaLimited),
    };
  } catch (error) {
    await updateLog(log, {
      status: "failed",
      message: "AI blog generation failed.",
      errors: [error.message],
      finishedAt: new Date(),
    });
    return { success: false, message: error.message };
  } finally {
    inMemoryLock = false;
  }
}
