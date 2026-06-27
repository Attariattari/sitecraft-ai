import { BlogListingClient } from "@/components/blog/BlogListingClient";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { BLOG_CATEGORIES } from "@/lib/blogs/blogConstants";
import { getPublicBlogs } from "@/lib/blogs/blogService";

export const metadata = {
  title: "Blog | SiteCraft AI",
  description:
    "Read SiteCraft AI blog articles about AI website generation, templates, themes, website design, SEO, plans, platform updates, and purpose-based website building.",
};

export default async function BlogPage() {
  const blogs = await getPublicBlogs({ limit: 60 });

  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="SiteCraft AI Blog"
        title="Practical ideas for building better"
        highlight="AI websites."
        description="Guides on AI website generation, portfolio planning, templates, themes, SEO basics, pricing choices, and the SiteCraft AI roadmap."
      />
      <BlogListingClient blogs={blogs} categories={BLOG_CATEGORIES} />
    </main>
  );
}
