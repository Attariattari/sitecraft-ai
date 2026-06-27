import { generateGeminiJSON } from "@/lib/ai/geminiService";
import { BLOG_CATEGORIES } from "@/lib/blogs/blogConstants";
import { estimateReadTime, slugifyBlogTitle } from "@/lib/blogs/blogService";
import { buildBlogContext } from "@/lib/ai/blog/buildBlogContext";
import { verifyBlogContent } from "@/lib/ai/blog/verifyBlogContent";

const PROMPT_VERSION = "sitecraft-blog-v1";

const fallbackTopics = [
  {
    title: "How to Plan a Portfolio Website with SiteCraft AI",
    category: "Portfolio Websites",
    focus: "portfolio website planning",
  },
  {
    title: "Templates vs Themes in SiteCraft AI: What Each One Controls",
    category: "Templates",
    focus: "template and theme selection",
  },
  {
    title: "Choosing Between Free, Basic, and Pro on SiteCraft AI",
    category: "Pricing & Plans",
    focus: "plan selection guidance",
  },
  {
    title: "How Purpose-Based Website Generation Helps Create Better Drafts",
    category: "AI Website Generation",
    focus: "purpose-based AI website drafts",
  },
  {
    title: "SEO Basics for AI-Generated Websites in SiteCraft AI",
    category: "SEO",
    focus: "SEO basics for generated websites",
  },
  {
    title: "What Website Categories Are Available Now in SiteCraft AI",
    category: "Coming Soon",
    focus: "category availability and roadmap clarity",
  },
  {
    title: "How to Keep AI Website Builder Claims Accurate and Trustworthy",
    category: "Security",
    focus: "trust and accurate platform claims",
  },
];

function titleFromTopic(topic = "") {
  const clean = String(topic).trim().replace(/\s+/g, " ");
  if (!clean) return "";
  if (clean.length > 12) return clean;
  return `SiteCraft AI Guide: ${clean}`;
}

function pickFallbackTopic(topic = "") {
  const requestedTitle = titleFromTopic(topic);
  if (requestedTitle) {
    const lower = requestedTitle.toLowerCase();
    const category = lower.includes("theme")
      ? "Themes"
      : lower.includes("template")
        ? "Templates"
        : lower.includes("plan") || lower.includes("pricing")
          ? "Pricing & Plans"
          : lower.includes("seo")
            ? "SEO"
            : lower.includes("portfolio")
              ? "Portfolio Websites"
              : lower.includes("security") || lower.includes("trust")
                ? "Security"
                : "AI Website Generation";
    return { title: requestedTitle, category, focus: requestedTitle };
  }
  const index = Math.floor(Date.now() / (1000 * 60)) % fallbackTopics.length;
  return fallbackTopics[index];
}

function fallbackBlog(context, topic = "") {
  const selected = pickFallbackTopic(topic);
  const title = selected.title;
  const paragraphs = [
    `A strong article about ${selected.focus} should stay practical, honest, and tied to what SiteCraft AI can really do. SiteCraft AI helps users turn purpose, profile details, template choice, and theme direction into a structured website draft. The goal is not to replace thoughtful planning. The goal is to remove the blank page and give users a practical foundation they can review.`,
    "Before generating a portfolio website, users should know what they want visitors to understand in the first few seconds. A designer may want to highlight visual work. A developer may want to show projects, technical skills, and contact details. A freelancer may need services, proof, and a clear call to action. SiteCraft AI can use this kind of information to shape a more relevant starting point.",
    "The current public SiteCraft AI plans are Free, Basic, and Pro. Free is useful for trying the builder and creating a simple first website. Basic is better for personal brands, freelancers, and small businesses that need more capacity. Pro is designed for professionals who need more website capacity, more theme access, stronger AI usage, and priority support. Agency is a future direction only and should not be treated as active or purchasable.",
    "Templates and themes play different roles. A template guides structure, including the order of sections and the kind of page experience a visitor sees. A theme controls the visual feel, including color direction and typography. For portfolio websites, users should choose a structure that makes their best work easy to inspect and a theme that supports the personality of the brand without overwhelming the content.",
    "Category availability matters too. Portfolio is the currently available category. Business websites, salon or beauty websites, e-commerce stores, restaurant websites, clinic websites, real estate websites, agency websites, school websites, and landing pages should be treated as coming soon or planned until the platform marks them available. Clear wording protects user trust because people can tell what they can create now and what is on the roadmap.",
    "A strong portfolio homepage usually includes a short positioning line, a focused skills or services section, selected work, a simple about section, and contact direction. SiteCraft AI can help arrange these pieces into a first draft. Users can then refine wording, replace generic details, and make sure the page reflects their real experience.",
    "SEO basics still matter for generated websites. A portfolio should use a descriptive page title, a concise meta description, clear headings, and natural keywords based on the person, role, or service. The page should avoid stuffing keywords or promising results that are not real. Helpful structure is better than forced wording.",
    "Security and accuracy are part of the product experience. A trustworthy AI website builder should avoid false claims, keep account areas protected, and describe future features honestly. SiteCraft AI content should never say unsupported tools are available unless the backend and public product state confirm that they are live.",
    "The best way to use SiteCraft AI is to treat the generated draft as a smart starting point. Review every section, remove anything that does not fit, add real examples, and keep the page focused on visitor action. A portfolio website does not need to be loud to be effective. It needs to be clear, credible, and easy to navigate.",
    "With the right planning, a portfolio website can become a practical home base for professional identity. SiteCraft AI helps users move faster while still keeping the final result grounded in real information, available features, and a clear purpose.",
  ];
  const content = `## Start with the real goal\n\n${paragraphs[0]}\n\n## Prepare the details before generation\n\n${paragraphs[1]}\n\n## Choose the right SiteCraft AI plan\n\n${paragraphs[2]}\n\n## Understand templates and themes\n\n${paragraphs[3]}\n\n## Use current category availability honestly\n\n${paragraphs[4]}\n\n## Build a clear portfolio structure\n\n${paragraphs[5]}\n\n## Add SEO basics without overdoing it\n\n${paragraphs[6]}\n\n## Keep trust at the center\n\n${paragraphs[7]}\n\n## Review the generated draft\n\n${paragraphs[8]}\n\n## Conclusion\n\n${paragraphs[9]}`;
  return {
    title,
    slug: slugifyBlogTitle(title),
    summary:
      `Learn about ${selected.focus} with SiteCraft AI using real platform availability, templates, themes, dashboard workflows, and SEO basics.`,
    excerpt:
      `A practical SiteCraft AI guide to ${selected.focus} while keeping product claims accurate and user trust intact.`,
    content,
    category: selected.category,
    tags: [selected.category, "AI website generation", "SiteCraft AI", "website builder"],
    keywords: [selected.focus, "AI website builder", "SiteCraft AI", "website templates"],
    metaTitle: title.slice(0, 70),
    metaDescription:
      `Use SiteCraft AI to understand ${selected.focus}, current availability, templates, themes, dashboard workflows, and SEO basics.`,
    readTime: estimateReadTime(content),
    imagePrompt:
      `Professional SaaS blog image showing ${selected.focus}, dashboard cards, and AI website generation flow.`,
  };
}

export async function generateSiteCraftBlog({ topic = "", context: providedContext = null } = {}) {
  const context = providedContext || (await buildBlogContext());
  const prompt = `You are writing for SiteCraft AI.
Return strict JSON only with keys: title, slug, summary, excerpt, content, category, tags, keywords, metaTitle, metaDescription, readTime, imagePrompt.

Allowed categories: ${BLOG_CATEGORIES.join(", ")}
Topic preference: ${topic || "Choose a helpful SiteCraft AI blog topic that has not been overused."}

Platform context:
${JSON.stringify(context, null, 2)}

Rules:
- 1000 to 1500 words.
- Use markdown with H2/H3 headings.
- No fake claims, no unsupported features as active, no unlimited wording.
- Agency is future only, not active and not purchasable.
- Only active categories can be called Available Now.
- Professional SaaS tone and practical value.
- Meta description around 150-160 characters.`;

  const result = await generateGeminiJSON(prompt, 1);
  const blog = result.success && result.data ? result.data : fallbackBlog(context, topic);
  const normalized = {
    ...blog,
    slug: slugifyBlogTitle(blog.slug || blog.title),
    category: BLOG_CATEGORIES.includes(blog.category) ? blog.category : "AI Website Generation",
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    keywords: Array.isArray(blog.keywords) ? blog.keywords : [],
    readTime: Number(blog.readTime || estimateReadTime(blog.content)),
    aiProvider: "Google Gemini",
    aiModel: result.model || "fallback",
    aiPromptVersion: PROMPT_VERSION,
  };
  return {
    success: true,
    blog: normalized,
    contentVerification: verifyBlogContent(normalized),
    usedFallback: !result.success,
    quotaLimited: Boolean(result.quotaLimited),
    error: result.error || "",
  };
}
