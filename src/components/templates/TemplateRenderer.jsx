import SectionRenderer from "@/components/templates/SectionRenderer";
import { renderTemplate } from "@/lib/templates/renderTemplate";
import GeneratedSiteLayout from "@/components/generated-site/layout/GeneratedSiteLayout";

export default function TemplateRenderer({ site, template, personalInfo, pageSlug = "home", basePath = "", preview = false }) {
  const rendered = renderTemplate({ template, personalInfo, pageSlug });

  return (
    <GeneratedSiteLayout site={site} rendered={rendered} basePath={basePath} activeSlug={rendered.page?.slug || pageSlug} preview={preview}>
      {rendered.sections.map((section, index) => (
        <SectionRenderer
          key={`${section.type}-${index}`}
          section={{
            ...section,
            data: {
              ...section.data,
              siteSlug: site?.slug,
              siteName: site?.siteName || site?.title,
            },
          }}
        />
      ))}
    </GeneratedSiteLayout>
  );
}
