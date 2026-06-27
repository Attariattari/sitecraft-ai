import "server-only";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import Template from "@/models/Template";
import { WEBSITE_THEMES } from "@/lib/themes/presets";
import { serializeTemplate } from "@/lib/templates/templateService";

export function getGeneratedThemeVars(themeId = "emerald", mode = "light") {
  const theme = WEBSITE_THEMES[themeId] || WEBSITE_THEMES.emerald;
  const tokens = theme.modes?.[mode] || theme.modes?.light || WEBSITE_THEMES.emerald.modes.light;
  return {
    "--primary": tokens.primary,
    "--secondary": tokens.secondary,
    "--accent": tokens.accent,
    "--background": tokens.background,
    "--softBackground": tokens.softBackground,
    "--text": tokens.text,
    "--mutedText": tokens.mutedText,
    "--border": tokens.border,
  };
}

export async function getTemplateForSite(site) {
  if (site?.templateSnapshot?.slug) return site.templateSnapshot;
  const slug = site?.templateSlug || site?.settings?.selectedTemplate || site?.templateId;
  if (!slug) return null;
  const template = await Template.findOne({ slug: String(slug).toLowerCase(), status: "active", isPublic: true }).lean();
  return serializeTemplate(template);
}

export async function getPublishedSiteRenderData(slug) {
  await dbConnect();
  const site = await Site.findOne({ slug, isPublished: true }).lean();
  if (!site) return null;
  await Site.updateOne({ _id: site._id }, { $inc: { "analytics.views": 1 } });
  const template = await getTemplateForSite(site);
  if (!template) return null;
  const personalInfo = site.personalInfoSnapshot?.profile
    ? {
        sharedInfo: site.personalInfoSnapshot.profile,
        purposeInfo: {
          [site.category || "portfolio"]: {
            ...(site.personalInfoSnapshot.purpose || {}),
            ...(site.personalInfoSnapshot.professional || {}),
          },
        },
      }
    : {
        sharedInfo: {
          fullName: site.inputData?.name || "",
          email: site.inputData?.email || "",
          bio: site.inputData?.bio || "",
          socialLinks: site.inputData?.socialLinks || {},
        },
        purposeInfo: {
          portfolio: {
            headline: site.inputData?.profession || "",
            skills: site.inputData?.skills || site.generatedContent?.skills || [],
            projects: site.inputData?.projects || site.generatedContent?.projects || [],
            services: site.inputData?.services || site.generatedContent?.services || [],
            experience: site.inputData?.experience || site.generatedContent?.experience || [],
          },
        },
      };

  return {
    site,
    template,
    personalInfo,
    cssVars: getGeneratedThemeVars(site.settings?.selectedTheme || site.themeSlug || site.themeId || "emerald"),
  };
}
