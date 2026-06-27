import { notFound } from "next/navigation";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { getPublishedSiteRenderData } from "@/lib/templates/siteRenderData";
import { renderTemplate } from "@/lib/templates/renderTemplate";
import { getGeneratedSiteLogo, getGeneratedSiteName } from "@/components/generated-site/layout/GeneratedSiteLogo";

export async function generateMetadata({ params }) {
  const { slug, pageSlug } = await params;
  const data = await getPublishedSiteRenderData(slug);
  if (!data) return { title: "Site | SiteCraft AI" };
  const rendered = renderTemplate({ template: data.template, personalInfo: data.personalInfo, pageSlug });
  if (!rendered.page || rendered.page.slug !== pageSlug) return { title: "Site | SiteCraft AI" };
  const siteName = getGeneratedSiteName({ site: data.site, profile: rendered.profile });
  const icon = getGeneratedSiteLogo({ site: data.site, profile: rendered.profile });
  return {
    title: `${rendered.page.name} | ${siteName}`,
    description: data.site.seo?.metaDescription || data.site.description || rendered.profile.bio || "A portfolio website built with SiteCraft AI.",
    icons: icon ? { icon, shortcut: icon, apple: icon } : undefined,
  };
}

export default async function PublicSiteSubPage({ params }) {
  const { slug, pageSlug } = await params;
  const data = await getPublishedSiteRenderData(slug);
  if (!data) notFound();

  const rendered = renderTemplate({ template: data.template, personalInfo: data.personalInfo, pageSlug });
  if (!rendered.page || rendered.page.slug !== pageSlug) notFound();

  return (
    <div style={data.cssVars}>
      <TemplateRenderer
        site={data.site}
        template={data.template}
        personalInfo={data.personalInfo}
        pageSlug={pageSlug}
        basePath={`/site/${data.site.slug}`}
      />
    </div>
  );
}
