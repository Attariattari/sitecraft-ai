import { generateGeminiJSON } from "./geminiService";
import { siteCraftFallbackPortfolioData } from "../data";

/**
 * Generate portfolio website using Gemini AI
 */
export async function generatePortfolioWebsite(inputData) {
  try {
    // Build professional prompt for Gemini
    const prompt = buildPortfolioPrompt(inputData);

    // Call Gemini API
    const result = await generateGeminiJSON(prompt);

    if (!result.success) {
      console.error("AI generation failed:", result.error);
      // Return fallback data on failure
      return {
        success: false,
        error: result.error,
        data: siteCraftFallbackPortfolioData,
        usedFallback: true,
        tokens: {
          prompt: result.promptTokens || 0,
          output: result.outputTokens || 0,
        },
      };
    }

    // Validate and clean generated content
    const generatedContent = validateAndCleanContent(result.data);

    return {
      success: true,
      data: generatedContent,
      usedFallback: false,
      tokens: {
        prompt: result.promptTokens || 0,
        output: result.outputTokens || 0,
      },
    };
  } catch (error) {
    console.error("Portfolio generation error:", error);
    return {
      success: false,
      error: error.message,
      data: siteCraftFallbackPortfolioData,
      usedFallback: true,
      tokens: {
        prompt: 0,
        output: 0,
      },
    };
  }
}

/**
 * Build prompt for Gemini
 */
function buildPortfolioPrompt(inputData) {
  const {
    fullName = "Professional",
    headline = "Developer",
    bio = "",
    email = "",
    githubUrl = "",
    skills = [],
    projects = [],
    services = [],
    experience = [],
  } = inputData;

  return `You are a professional content generator for portfolio websites. Based on the following user information, generate a complete portfolio website content structure in strict JSON format.

User Information:
- Name: ${fullName}
- Headline: ${headline}
- Bio: ${bio}
- Email: ${email}
- GitHub: ${githubUrl || "Not provided"}
- Skills: ${skills.length > 0 ? skills.join(", ") : "Developer skills"}

Generate ONLY valid JSON (no markdown, no explanations, just pure JSON) with this exact structure:
{
  "hero": {
    "headline": "A compelling headline that showcases the user's expertise",
    "subheadline": "A supporting tagline",
    "ctaText": "Call to action text"
  },
  "about": {
    "title": "About",
    "description": "2-3 sentences about the user's background and expertise"
  },
  "skills": ["skill1", "skill2", "skill3"],
  "services": [
    {
      "title": "Service title",
      "description": "Service description"
    }
  ],
  "projects": [
    {
      "title": "Project title",
      "description": "What was accomplished",
      "technologies": ["tech1", "tech2"],
      "link": "https://example.com"
    }
  ],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "Start - End",
      "description": "What was done"
    }
  ],
  "cta": {
    "title": "Motivational call to action heading",
    "description": "Supporting text encouraging contact",
    "buttonText": "Call to action button"
  },
  "contact": {
    "headline": "Get in touch",
    "description": "Brief description encouraging contact"
  },
  "seo": {
    "title": "Professional page title for SEO",
    "description": "Compelling meta description (150-160 chars)",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "templateRecommendation": {
    "templateKey": "portfolio-modern",
    "reason": "Why this template fits the user's profile"
  },
  "themeRecommendation": {
    "themeId": "emerald",
    "reason": "Why this theme works for their brand"
  },
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}

Important:
- Make content professional and compelling
- Keep descriptions concise but meaningful
- Include 3-4 suggestions for improving their portfolio
- Template recommendation should be one of: portfolio-modern, portfolio-minimal, portfolio-creative
- Theme recommendation should be one of: emerald, modernDark, royalBlue, premiumPurple, roséGold
- Return ONLY the JSON, nothing else`;
}

/**
 * Validate and clean generated content
 */
function validateAndCleanContent(content) {
  const defaultStructure = {
    hero: { headline: "", subheadline: "", ctaText: "" },
    about: { title: "", description: "" },
    skills: [],
    services: [],
    projects: [],
    experience: [],
    cta: { title: "", description: "", buttonText: "" },
    contact: { headline: "", description: "" },
    seo: { title: "", description: "", keywords: [] },
    templateRecommendation: { templateKey: "", reason: "" },
    themeRecommendation: { themeId: "", reason: "" },
    suggestions: [],
  };

  // Merge generated content with defaults
  const cleaned = {
    ...defaultStructure,
    ...content,
    hero: { ...defaultStructure.hero, ...content.hero },
    about: { ...defaultStructure.about, ...content.about },
    cta: { ...defaultStructure.cta, ...content.cta },
    contact: { ...defaultStructure.contact, ...content.contact },
    seo: { ...defaultStructure.seo, ...content.seo },
    templateRecommendation: {
      ...defaultStructure.templateRecommendation,
      ...content.templateRecommendation,
    },
    themeRecommendation: {
      ...defaultStructure.themeRecommendation,
      ...content.themeRecommendation,
    },
    skills: Array.isArray(content.skills) ? content.skills : [],
    services: Array.isArray(content.services) ? content.services : [],
    projects: Array.isArray(content.projects) ? content.projects : [],
    experience: Array.isArray(content.experience) ? content.experience : [],
    suggestions: Array.isArray(content.suggestions) ? content.suggestions : [],
  };

  // Validate template and theme recommendations
  const validTemplates = ["portfolio-modern", "portfolio-minimal", "portfolio-creative"];
  const validThemes = [
    "emerald",
    "modernDark",
    "royalBlue",
    "premiumPurple",
    "roséGold",
  ];

  if (!validTemplates.includes(cleaned.templateRecommendation.templateKey)) {
    cleaned.templateRecommendation.templateKey = "portfolio-modern";
  }

  if (!validThemes.includes(cleaned.themeRecommendation.themeId)) {
    cleaned.themeRecommendation.themeId = "emerald";
  }

  return cleaned;
}

/**
 * Generate alternative portfolio suggestions
 */
export async function generatePortfolioSuggestions(siteData) {
  try {
    const prompt = `Based on this portfolio data, generate 3-5 actionable suggestions to improve the portfolio:

${JSON.stringify(siteData, null, 2)}

Respond with ONLY a JSON array of strings:
["Suggestion 1", "Suggestion 2", "Suggestion 3"]`;

    const result = await generateGeminiJSON(prompt);

    if (!result.success) {
      return {
        success: false,
        suggestions: siteData.suggestions || [],
      };
    }

    const suggestions = Array.isArray(result.data)
      ? result.data
      : siteData.suggestions || [];

    return {
      success: true,
      suggestions,
    };
  } catch (error) {
    console.error("Suggestion generation error:", error);
    return {
      success: false,
      suggestions: siteData.suggestions || [],
    };
  }
}
