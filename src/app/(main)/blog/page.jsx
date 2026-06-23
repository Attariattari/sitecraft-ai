import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicSection } from "@/components/public/PublicCards";

export const metadata = {
  title: "Blog | SiteCraft AI",
  description: "Read SiteCraft AI articles about AI websites, templates, themes, and practical website creation workflows.",
};

const posts = [
  { slug: "ai-website-builder-basics", title: "How AI Website Builders Speed Up Launches", category: "AI Websites", read: "4 min read" },
  { slug: "choosing-a-template", title: "Choosing the Right Template for Your Website", category: "Templates", read: "5 min read" },
  { slug: "theme-consistency", title: "Why Theme Consistency Matters on SaaS Websites", category: "Themes", read: "3 min read" },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero badge="Blog" title="Ideas for building better" highlight="websites." description="Practical notes on AI website generation, templates, theme systems, and launching polished pages faster." />
      <PublicSection title="Latest articles">
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <BookOpen className="size-5" />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-primary">{post.category}</p>
              <h2 className="mt-3 text-xl font-black text-foreground">{post.title}</h2>
              <p className="mt-3 text-sm font-medium text-muted-foreground">{post.read}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
                Read article <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </PublicSection>
    </main>
  );
}
