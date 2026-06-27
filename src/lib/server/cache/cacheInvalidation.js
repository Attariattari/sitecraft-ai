import "server-only";
import { deleteCache, deleteCachePattern } from "@/lib/server/cache/cache";

export const invalidatePublicPlans = () => deleteCache("public:plans");
export const invalidatePublicFeatures = () => deleteCachePattern("public:features*");
export const invalidatePublicCategories = () => deleteCachePattern("public:categories*");
export const invalidatePublicTemplates = () => deleteCachePattern("public:templates*");
export const invalidatePublicThemes = () => deleteCachePattern("public:themes*");
export const invalidatePublicAvailability = () => deleteCache("public:availability");
export const invalidateBlogCache = (slug = "") =>
  Promise.all([deleteCachePattern("public:blog:list*"), slug ? deleteCache(`public:blog:slug:${slug}`) : null]);
export const invalidateFAQCache = () => Promise.all([deleteCache("public:faq:list"), deleteCachePattern("ai:faq-answer:*")]);
export const invalidateUserCache = (userId) => deleteCachePattern(`user:${userId}:*`);
export const invalidateAdminStats = () => deleteCachePattern("admin:*");
export const invalidateAIKnowledgeCache = () => deleteCachePattern("ai:knowledge-context:*");
export const invalidateAllPublicCache = () => deleteCachePattern("public:*");
