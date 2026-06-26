import dbConnect from "@/lib/dbConnect";
import KnowledgeBase from "@/models/KnowledgeBase";
import { aiKnowledgeQuery, serializeKnowledgeEntry } from "@/lib/knowledge/knowledgeBaseService";

const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "about",
  "sitecraft",
  "sitecraft ai",
  "what",
  "which",
  "does",
  "can",
  "are",
  "is",
  "how",
]);

export function normalizeQuestion(question) {
  return String(question || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s-]/g, "")
    .trim();
}

function keywordsFor(question) {
  return normalizeQuestion(question)
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function scoreEntry(entry, normalized, keywords) {
  const haystack = [
    entry.title,
    entry.question,
    entry.answer,
    entry.category,
    ...(entry.tags || []),
  ]
    .join(" ")
    .toLowerCase();
  let score = Number(entry.priority || 0);

  if (entry.question && normalizeQuestion(entry.question) === normalized) score += 120;
  if (entry.title && normalizeQuestion(entry.title) === normalized) score += 90;
  for (const tag of entry.tags || []) {
    if (keywords.includes(String(tag).toLowerCase())) score += 24;
  }
  for (const keyword of keywords) {
    if (haystack.includes(keyword)) score += 10;
  }
  if (entry.reviewStatus === "verified") score += 10;
  if (entry.isFeatured) score += 6;
  return score;
}

export async function searchKnowledgeBase(question, { limit = 6 } = {}) {
  await dbConnect();
  const normalized = normalizeQuestion(question);
  const keywords = keywordsFor(question);
  const baseQuery = aiKnowledgeQuery();
  const escaped = keywords.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = escaped.length ? new RegExp(escaped.join("|"), "i") : null;

  let entries = [];
  if (regex) {
    entries = await KnowledgeBase.find({
      ...baseQuery,
      $or: [
        { title: regex },
        { question: regex },
        { answer: regex },
        { category: regex },
        { tags: regex },
      ],
    })
      .sort({ priority: -1, sortOrder: 1, updatedAt: -1 })
      .limit(24)
      .lean();
  }

  if (!entries.length && normalized) {
    try {
      entries = await KnowledgeBase.find({
        ...baseQuery,
        $text: { $search: normalized },
      })
        .sort({ score: { $meta: "textScore" }, priority: -1 })
        .limit(24)
        .lean();
    } catch {
      entries = [];
    }
  }

  if (!entries.length) {
    entries = await KnowledgeBase.find(baseQuery)
      .sort({ reviewStatus: 1, priority: -1, sortOrder: 1, updatedAt: -1 })
      .limit(12)
      .lean();
  }

  return entries
    .map(serializeKnowledgeEntry)
    .map((entry) => ({ ...entry, relevanceScore: scoreEntry(entry, normalized, keywords) }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}
