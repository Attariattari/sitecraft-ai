import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from "lucide-react";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { PublicCTA } from "@/components/public/PublicCards";
import { getPublicBlogBySlug, getPublicBlogs } from "@/lib/blogs/blogService";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);
  if (!blog) {
    return {
      title: "Blog Not Found | SiteCraft AI",
    };
  }
  return {
    title: blog.metaTitle || `${blog.title} | SiteCraft AI Blog`,
    description: blog.metaDescription,
    alternates: blog.canonicalUrl ? { canonical: blog.canonicalUrl } : undefined,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription,
      images: blog.image?.url ? [{ url: blog.image.url, alt: blog.image.alt || blog.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription,
      images: blog.image?.url ? [blog.image.url] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);
  if (!blog) notFound();
  const related = (await getPublicBlogs({ category: blog.category, limit: 4 }))
    .filter((item) => item.slug !== blog.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      <article className="pt-28">
        <div className="container mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-black text-primary transition hover:bg-primary/10"
          >
            <ArrowLeft className="size-4" />
            Blog
          </Link>

          <header className="mx-auto mt-8 max-w-4xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              {blog.category}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-foreground md:text-6xl">
              {blog.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-muted-foreground">
              {blog.summary}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
              <span>{blog.authorName}</span>
              {blog.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {blog.readTime} min read
              </span>
            </div>
          </header>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl shadow-primary/10">
            {blog.image?.url ? (
              <Image
                src={blog.image.url}
                alt={blog.image.alt || blog.title}
                width={blog.image.width || 1400}
                height={blog.image.height || 700}
                sizes="(min-width: 1024px) 960px, 100vw"
                unoptimized={blog.image.url.includes(".svg")}
                priority
                className="aspect-[16/8] w-full object-cover"
              />
            ) : (
              <div className="aspect-[16/8] bg-primary/10" />
            )}
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <MarkdownContent content={blog.content} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-background py-16">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-black text-foreground">Related articles</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/blog/${item.slug}`}
                    className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                      {item.category}
                    </p>
                    <h3 className="mt-3 line-clamp-2 text-lg font-black text-foreground">
                      {item.title}
                    </h3>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                      Read
                      <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <PublicCTA
        title="Build a website draft with SiteCraft AI."
        description="Start from a real purpose, template structure, and theme direction."
      />
    </main>
  );
}
