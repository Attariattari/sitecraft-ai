import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA } from "@/components/public/PublicCards";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
  return {
    title: `${title} | SiteCraft AI Blog`,
    description: `Read ${title} on the SiteCraft AI blog.`,
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const title = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");

  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero badge="Article" title={title} description="A practical SiteCraft AI article about building clearer, more theme-consistent website experiences." primaryHref="/blog" primaryLabel="Back to Blog" />
      <article className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-black text-primary">
              <ArrowLeft className="size-4" /> Blog
            </Link>
            <p className="text-sm font-medium leading-7 text-muted-foreground">
              This static article placeholder keeps the public blog route build-safe until a full blog CMS or API is connected. It uses the shared public layout and platform theme tokens so it remains consistent with the rest of the marketing site.
            </p>
            <h2 className="mt-8 text-2xl font-black text-foreground">Theme-aware website building</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">
              A strong public site should avoid one-off colors and hard-coded styling. SiteCraft AI public pages use shared tokens for backgrounds, text, cards, borders, primary actions, and accent surfaces.
            </p>
          </div>
        </div>
      </article>
      <PublicCTA title="Generate a website with the active theme." />
    </main>
  );
}
