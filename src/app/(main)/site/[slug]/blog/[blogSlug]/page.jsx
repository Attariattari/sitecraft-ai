import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import SiteBlogPost from "@/models/SiteBlogPost";
import { getPublishedSiteRenderData } from "@/lib/templates/siteRenderData";
import { renderTemplate } from "@/lib/templates/renderTemplate";
import GeneratedSiteLayout from "@/components/generated-site/layout/GeneratedSiteLayout";
import GeneratedSiteBlogDetail from "@/components/generated-site/blog/GeneratedSiteBlogDetail";
import { getGeneratedSiteLogo, getGeneratedSiteName } from "@/components/generated-site/layout/GeneratedSiteLogo";

export async function generateMetadata({ params }) {
  const { slug, blogSlug } = await params;
  const data = await getPublishedSiteRenderData(slug);
  if (!data) return { title: "Blog | SiteCraft AI" };
  await dbConnect();
  const post = await SiteBlogPost.findOne({ siteSlug: slug, slug: blogSlug, status: "published" }).lean();
  if (!post) return { title: "Blog | SiteCraft AI" };
  const rendered = renderTemplate({ template: data.template, personalInfo: data.personalInfo, pageSlug: "blog" });
  const siteName = getGeneratedSiteName({ site: data.site, profile: rendered.profile });
  const icon = getGeneratedSiteLogo({ site: data.site, profile: rendered.profile });
  const image = post.seo?.ogImage || post.featuredImage || icon;
  return {
    title: `${post.seo?.metaTitle || post.title} | ${siteName}`,
    description: post.seo?.metaDescription || post.excerpt || data.site.description || rendered.profile.bio,
    icons: icon ? { icon } : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: image ? [image] : [],
    },
  };
}

export default async function SiteBlogDetailPage({ params }) {
  const { slug, blogSlug } = await params;
  const data = await getPublishedSiteRenderData(slug);
  if (!data) notFound();
  await dbConnect();
  const post = await SiteBlogPost.findOne({ siteSlug: slug, slug: blogSlug, status: "published" }).lean();
  if (!post) notFound();
  const related = await SiteBlogPost.find({ siteSlug: slug, status: "published", slug: { $ne: blogSlug } }).sort({ publishedAt: -1 }).limit(2).lean();
  const rendered = renderTemplate({ template: data.template, personalInfo: data.personalInfo, pageSlug: "blog" });

  return (
    <div style={data.cssVars}>
      <GeneratedSiteLayout site={data.site} rendered={rendered} basePath={`/site/${data.site.slug}`} activeSlug="blog">
        <GeneratedSiteBlogDetail
          post={{ ...post, _id: post._id.toString() }}
          relatedPosts={related.map((item) => ({ ...item, _id: item._id.toString() }))}
          site={data.site}
          profile={rendered.profile}
          basePath={`/site/${data.site.slug}`}
        />
      </GeneratedSiteLayout>
    </div>
  );
}
