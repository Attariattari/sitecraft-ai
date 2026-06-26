import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import AIHelpAnswerCache from "@/models/AIHelpAnswerCache";
import { generateGeminiText } from "@/lib/ai/geminiService";
import { buildSiteCraftKnowledgeContext } from "@/lib/ai/buildSiteCraftKnowledgeContext";
import { SAFE_HELP_FALLBACK, validateHelpAnswer } from "@/lib/ai/validateHelpAnswer";
import { normalizeQuestion, searchKnowledgeBase } from "@/lib/knowledge/searchKnowledgeBase";

const unrelatedPattern =
  /\b(weather|sports|recipe|movie|song|homework|stock|crypto|medical|doctor|lawyer|lawsuit|politics)\b/i;
const HELP_CACHE_VERSION = "help-v7";

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function isSiteCraftQuestion(question) {
  const text = question.toLowerCase();
  if (unrelatedPattern.test(text)) return false;
  return /sitecraft|website|plan|pricing|theme|template|category|portfolio|business|feature|dashboard|security|agency|ai|generate|domain|analytics|editor|billing|support|free|basic|pro/.test(
    text,
  );
}

function directAnswerFor(question, entries) {
  const normalized = normalizeQuestion(question);
  const exact = entries.find(
    (entry) =>
      normalizeQuestion(entry.question) === normalized ||
      normalizeQuestion(entry.title) === normalized,
  );
  if (exact) return exact.answer;

  const strong = entries.find((entry) => Number(entry.relevanceScore || 0) >= 120);
  return strong?.answer || "";
}

function joinLabels(items) {
  return items.map((item) => item.label || item.name || item.title || item.slug).filter(Boolean).join(", ");
}

function featureNamesByStatus(features, status) {
  return features
    .filter((feature) => feature.status === status)
    .map((feature) => feature.title || feature.name || feature.label || feature.slug)
    .filter(Boolean);
}

function formatPlanLimit(plans, limitKey, label) {
  return plans
    .map((plan) => {
      const count = Number(plan.limits?.[limitKey] || 0);
      return `${plan.name}: ${count} ${label}${count === 1 ? "" : "s"}`;
    })
    .join(", ");
}

function deterministicAvailabilityAnswer(question, context) {
  const text = question.toLowerCase();
  const availability = context.availability || {};

  if (/\b(difference|different|compare|versus|vs)\b/.test(text) && /\btemplate|templates\b/.test(text) && /\btheme|themes\b/.test(text)) {
    return "Templates control the website structure, page layout, and section flow. Themes control the visual style, colors, typography, and overall design feel of the generated website.";
  }

  if (/\b(best|recommend|recommended|right|choose|which)\b/.test(text) && /\b(plan|plans|free|basic|pro)\b/.test(text)) {
    return "Free is best if you want to try SiteCraft AI first. Basic is best for personal brands, freelancers, and small businesses that need more websites, themes, templates, media upload, and SEO metadata. Pro is best for professionals who need more website capacity, more themes, higher AI usage, priority support, and stronger growth features.";
  }

  if (/\b(theme|themes)\b/.test(text) && /\b(plan|plans|free|basic|pro|included|include)\b/.test(text)) {
    const limits = formatPlanLimit(context.plans || [], "themes", "theme");
    return `${limits}. Actual choices also depend on the current active theme inventory, which is ${availability.activeThemeCount || 0} active theme${availability.activeThemeCount === 1 ? "" : "s"} right now.`;
  }

  if (/\b(template|templates)\b/.test(text) && /\b(plan|plans|free|basic|pro|included|include)\b/.test(text)) {
    const limits = formatPlanLimit(context.plans || [], "templates", "template");
    return `${limits}. Actual choices also depend on the current active template inventory, which is ${availability.activeTemplateCount || 0} active template${availability.activeTemplateCount === 1 ? "" : "s"} right now.`;
  }

  if (/\b(category|categories|industry|industries)\b/.test(text) || /\b(business|portfolio|restaurant|clinic|school|agency|landing|ecommerce|e-commerce|salon|real estate)\b/.test(text)) {
    const available = availability.availableCategories || [];
    const comingSoon = availability.comingSoonCategories || [];
    const asksComingSoon = /\b(coming soon|planned|future|next|upcoming|unavailable)\b/.test(text);

    if (/business/.test(text)) {
      const businessAvailable = available.some((category) => category.slug === "business");
      return businessAvailable
        ? "Business websites are currently available in SiteCraft AI."
        : "Business websites are not currently available. They are listed as coming soon or planned until platform availability changes.";
    }

    if (/portfolio/.test(text)) {
      const portfolioAvailable = available.some((category) => category.slug === "portfolio");
      return portfolioAvailable
        ? "Portfolio websites are currently available in SiteCraft AI."
        : "Portfolio websites are not currently confirmed as available yet.";
    }

    if (asksComingSoon) {
      return comingSoon.length
        ? `Categories coming soon or planned include: ${joinLabels(comingSoon)}. These are not currently available until their platform status changes.`
        : "No coming soon categories are currently listed in public availability data.";
    }

    if (available.length) {
      return `Currently available SiteCraft AI category: ${joinLabels(available)}.`;
    }

    return "No public website category is currently confirmed as available yet. More categories are being prepared for release.";
  }

  if (/\b(plan|plans|pricing|price)\b/.test(text)) {
    const planNames = (context.plans || []).map((plan) => plan.name).join(", ");
    if (/agency/.test(text)) {
      return "Agency tools are planned for future releases and are not currently available as an active public plan.";
    }
    return `The active public SiteCraft AI plans are ${planNames || "Free, Basic, and Pro"}. Plan limits and included features are shown on the pricing page.`;
  }

  if (/\b(template|templates)\b/.test(text)) {
    return `SiteCraft AI currently has ${availability.activeTemplateCount || 0} active template${availability.activeTemplateCount === 1 ? "" : "s"}. Only currently active templates are shown as available.`;
  }

  if (/\b(theme|themes)\b/.test(text)) {
    return `SiteCraft AI currently has ${availability.activeThemeCount || 0} active theme${availability.activeThemeCount === 1 ? "" : "s"}. Theme access also depends on the selected plan limits.`;
  }

  if (/\b(feature|features|coming soon|roadmap)\b/.test(text)) {
    const active = availability.activeFeatures || [];
    const future = availability.comingSoonFeatures || [];
    if (/coming soon|roadmap/.test(text) && future.length) {
      const inProgress = featureNamesByStatus(future, "in_progress");
      const comingSoon = featureNamesByStatus(future, "coming_soon");
      const parts = [];

      if (inProgress.length) {
        parts.push(`In progress: ${inProgress.join(", ")}`);
      }
      if (comingSoon.length) {
        parts.push(`Coming soon: ${comingSoon.join(", ")}`);
      }

      return `${parts.join(". ")}. These features are not live yet and will only be treated as released after their backend status changes.`;
    }
    if (active.length) {
      return `Available SiteCraft AI features include: ${joinLabels(active.slice(0, 8))}. More features are added as they are released.`;
    }
  }

  return "";
}

function buildPrompt(question, context) {
  return `You are SiteCraft AI Help Assistant.

Answer only using the provided SiteCraft AI context.
Never invent features, prices, categories, plans, templates, themes, or availability.
Never use the word unlimited.
Do not say Agency is available. Agency tools are planned for future releases unless context says otherwise.
If a feature is not confirmed as available, say it is coming soon or not currently available.
If the user asks unrelated questions, politely redirect to SiteCraft AI topics.
Keep answers short, helpful, and professional.
Use simple language.
Always prefer truthful availability over marketing hype.

User question:
${question}

SiteCraft AI context JSON:
${JSON.stringify(context)}

Return only the answer text.`;
}

async function readCache(questionHash, contextHash) {
  await dbConnect();
  const cached = await AIHelpAnswerCache.findOne({
    questionHash,
    contextHash,
    expiresAt: { $gt: new Date() },
  }).lean();
  return cached?.answer || "";
}

async function writeCache({ questionHash, normalizedQuestion, answer, sourceIds, contextHash }) {
  await dbConnect();
  await AIHelpAnswerCache.findOneAndUpdate(
    { questionHash },
    {
      $set: {
        questionHash,
        normalizedQuestion,
        answer,
        sourceIds,
        contextHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    },
    { upsert: true, new: true },
  );
}

export async function answerSiteCraftHelpQuestion(question, { bypassCache = false } = {}) {
  const normalizedQuestion = normalizeQuestion(question);
  if (normalizedQuestion.length < 4 || normalizedQuestion.length > 500) {
    return {
      answer: "Please ask a SiteCraft AI question between 4 and 500 characters.",
      allowed: false,
      cached: false,
      sources: [],
      sourceSummary: {},
      safety: "Question validation failed.",
      contextEntries: [],
    };
  }

  if (!isSiteCraftQuestion(normalizedQuestion)) {
    return {
      answer: "I can help with SiteCraft AI plans, features, themes, templates, categories, dashboard, security, and upcoming releases.",
      allowed: false,
      cached: false,
      sources: [],
      sourceSummary: {},
      safety: "Question was outside SiteCraft AI help scope.",
      contextEntries: [],
    };
  }

  const entries = await searchKnowledgeBase(normalizedQuestion);
  const { context, contextHash, sourceSummary } = await buildSiteCraftKnowledgeContext(
    normalizedQuestion,
    { entries },
  );
  const questionHash = hash(`${HELP_CACHE_VERSION}:${normalizedQuestion}`);

  if (!bypassCache) {
    const cachedAnswer = await readCache(questionHash, contextHash);
    if (cachedAnswer) {
      return {
        answer: cachedAnswer,
        allowed: true,
        cached: true,
        sources: entries.map((entry) => entry.id),
        sourceSummary,
        safety: "Served from 24 hour cache after context match.",
        contextEntries: entries,
      };
    }
  }

  let answer =
    directAnswerFor(normalizedQuestion, entries) ||
    deterministicAvailabilityAnswer(normalizedQuestion, context);
  let usedAI = false;

  if (!answer) {
    const result = await generateGeminiText(buildPrompt(normalizedQuestion, context));
    usedAI = result.success;
    answer = result.success ? result.data : SAFE_HELP_FALLBACK;
  }

  let validation = validateHelpAnswer(answer);
  if (!validation.safe && usedAI) {
    const retry = await generateGeminiText(
      `${buildPrompt(normalizedQuestion, context)}\n\nThe previous answer was unsafe: ${validation.reason}. Return a safer answer using only confirmed context.`,
    );
    validation = validateHelpAnswer(retry.success ? retry.data : "");
  }

  const finalAnswer = validation.safe ? validation.answer : SAFE_HELP_FALLBACK;
  await writeCache({
    questionHash,
    normalizedQuestion,
    answer: finalAnswer,
    sourceIds: entries.map((entry) => entry.id),
    contextHash,
  });

  return {
    answer: finalAnswer,
    allowed: validation.safe,
    cached: false,
    sources: entries.map((entry) => entry.id),
    sourceSummary,
    safety: validation.safe
      ? usedAI
        ? "Gemini answer passed SiteCraft safety checks."
        : "Direct knowledge base answer passed SiteCraft safety checks."
      : validation.reason,
    contextEntries: entries,
  };
}
