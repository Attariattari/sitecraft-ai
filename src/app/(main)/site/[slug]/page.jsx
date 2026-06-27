import { notFound } from "next/navigation";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { getPublishedSiteRenderData } from "@/lib/templates/siteRenderData";
import { normalizePersonalInfoForCategory } from "@/lib/templates/categorySchemas";
import { getGeneratedSiteLogo } from "@/components/generated-site/layout/GeneratedSiteLogo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPublishedSiteRenderData(slug);
  if (!data) return { title: "Portfolio | SiteCraft AI" };

  const normalized = normalizePersonalInfoForCategory(data.personalInfo, data.site.category || "portfolio");
  const title = data.site.seo?.metaTitle || data.site.siteName || [normalized.profile.fullName, normalized.profile.headline].filter(Boolean).join(" | ");
  const description = data.site.seo?.metaDescription || data.site.description || normalized.profile.bio || "A portfolio website built with SiteCraft AI.";
  const icon = getGeneratedSiteLogo({ site: data.site, profile: normalized.profile });
  return {
    title: title || "Portfolio | SiteCraft AI",
    description,
    icons: icon ? { icon, shortcut: icon, apple: icon } : undefined,
    openGraph: {
      title: title || "Portfolio | SiteCraft AI",
      description,
      images: data.site.seo?.ogImage ? [data.site.seo.ogImage] : normalized.profile.profileImage ? [normalized.profile.profileImage] : [],
    },
  };
}

export default async function PublicSitePage({ params }) {
  const { slug } = await params;
  const data = await getPublishedSiteRenderData(slug);
  if (!data) notFound();

  return (
    <div style={data.cssVars}>
      <TemplateRenderer
        site={data.site}
        template={data.template}
        personalInfo={data.personalInfo}
        pageSlug="home"
        basePath={`/site/${data.site.slug}`}
      />
    </div>
  );
}
