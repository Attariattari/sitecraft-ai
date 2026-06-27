import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import SiteBlogPost from "@/models/SiteBlogPost";
import { getPublishedSiteRenderData } from "@/lib/templates/siteRenderData";
import { renderTemplate } from "@/lib/templates/renderTemplate";
import GeneratedSiteLayout from "@/components/generated-site/layout/GeneratedSiteLayout";
import GeneratedSiteBlogList from "@/components/generated-site/blog/GeneratedSiteBlogList";
import { getGeneratedSiteLogo, getGeneratedSiteName } from "@/components/generated-site/layout/GeneratedSiteLogo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPublishedSiteRenderData(slug);
  if (!data) return { title: "Blog | SiteCraft AI" };
  const rendered = renderTemplate({ template: data.template, personalInfo: data.personalInfo, pageSlug: "blog" });
  const siteName = getGeneratedSiteName({ site: data.site, profile: rendered.profile });
  const icon = getGeneratedSiteLogo({ site: data.site, profile: rendered.profile });
  return {
    title: `Blog | ${siteName}`,
    description: data.site.seo?.metaDescription || data.site.description || rendered.profile.bio || "Blog posts and insights.",
    icons: icon ? { icon } : undefined,
  };
}

export default async function SiteBlogPage({ params }) {
  const { slug } = await params;
  const data = await getPublishedSiteRenderData(slug);
  if (!data) notFound();
  await dbConnect();
  const posts = await SiteBlogPost.find({ siteSlug: slug, status: "published" }).sort({ publishedAt: -1, createdAt: -1 }).lean();
  const rendered = renderTemplate({ template: data.template, personalInfo: data.personalInfo, pageSlug: "blog" });

  return (
    <div style={data.cssVars}>
      <GeneratedSiteLayout site={data.site} rendered={rendered} basePath={`/site/${data.site.slug}`} activeSlug="blog">
        <GeneratedSiteBlogList posts={posts.map((post) => ({ ...post, _id: post._id.toString() }))} site={data.site} profile={rendered.profile} basePath={`/site/${data.site.slug}`} />
      </GeneratedSiteLayout>
    </div>
  );
}
