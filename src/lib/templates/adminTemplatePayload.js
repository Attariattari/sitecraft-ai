import "server-only";
import { invalidatePublicAvailability, invalidatePublicTemplates } from "@/lib/server/cache/cacheInvalidation";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";

function cleanStringArray(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseJsonField(value, fallback) {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function cleanTemplatePayload(body = {}) {
  const status = ["active", "draft", "coming_soon", "planned", "hidden"].includes(body.status) ? body.status : "draft";
  const category = ["portfolio", "business", "landing-page", "restaurant", "clinic", "realestate", "agency", "school", "ecommerce"].includes(body.category)
    ? body.category
    : "portfolio";
  return {
    name: String(body.name || "").trim(),
    slug: String(body.slug || body.name || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, ""),
    shortDescription: String(body.shortDescription || "").trim(),
    description: String(body.description || "").trim(),
    category,
    purpose: String(body.purpose || "").trim(),
    previewImage: String(body.previewImage || "/templates/template-preview.svg").trim(),
    thumbnailImage: String(body.thumbnailImage || body.previewImage || "/templates/template-preview.svg").trim(),
    galleryImages: cleanStringArray(body.galleryImages),
    pages: Array.isArray(body.pages) ? body.pages : parseJsonField(body.pagesJson, []),
    sections: cleanStringArray(body.sections),
    dataBindings: parseJsonField(body.dataBindings || body.dataBindingsJson, {}),
    requiredFields: cleanStringArray(body.requiredFields),
    optionalFields: cleanStringArray(body.optionalFields),
    bestFor: String(body.bestFor || "").trim(),
    recommendedThemes: cleanStringArray(body.recommendedThemes),
    status,
    isActive: status === "active",
    isPublic: body.isPublic !== false,
    availablePlans: Array.isArray(body.availablePlans)
      ? body.availablePlans.filter((plan) => ["free", "basic", "pro"].includes(plan))
      : ["free", "basic", "pro"],
    isFeatured: Boolean(body.isFeatured),
    isPremium: Boolean(body.isPremium),
    componentKey: String(body.componentKey || "").trim(),
    supportedThemes: cleanStringArray(body.supportedThemes),
    layoutStyle: String(body.layoutStyle || "balanced").trim(),
    sortOrder: Number(body.sortOrder || body.order || 0),
    order: Number(body.order || body.sortOrder || 0),
  };
}

export async function invalidateTemplateData() {
  await Promise.all([invalidatePublicTemplates(), invalidatePublicAvailability()]);
  await realtimeEmitter.emitToAll("templates:updated", {
    title: "Templates updated",
    message: "Template public data has been updated.",
  });
}
