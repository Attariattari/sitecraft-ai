import { notFound, redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getGeneratedThemeVars, getTemplateForSite } from "@/lib/templates/siteRenderData";
import { renderTemplate } from "@/lib/templates/renderTemplate";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import SitePreviewToolbar from "@/components/templates/SitePreviewToolbar";

export default async function DashboardSitePreviewSubPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id, pageSlug } = await params;
  await dbConnect();
  const site = await Site.findOne({ _id: id, ownerId: user.id }).lean();
  if (!site) notFound();

  const template = await getTemplateForSite(site);
  if (!template) notFound();

  const personalInfo = {
    sharedInfo: site.personalInfoSnapshot?.profile || {},
    purposeInfo: {
      [site.category || "portfolio"]: {
        ...(site.personalInfoSnapshot?.purpose || {}),
        ...(site.personalInfoSnapshot?.professional || {}),
      },
    },
  };
  const rendered = renderTemplate({ template, personalInfo, pageSlug });
  if (!rendered.page || rendered.page.slug !== pageSlug) notFound();

  return (
    <div>
      <SitePreviewToolbar siteId={site._id.toString()} />
      <div style={getGeneratedThemeVars(site.settings?.selectedTheme || site.themeSlug || site.themeId || "emerald")}>
        <TemplateRenderer site={site} template={template} personalInfo={personalInfo} pageSlug={pageSlug} basePath={`/dashboard/sites/${site._id}/preview`} preview />
      </div>
    </div>
  );
}
