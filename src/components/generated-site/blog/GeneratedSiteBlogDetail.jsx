import Image from "next/image";
import Link from "next/link";

export default function GeneratedSiteBlogDetail({ post, relatedPosts = [], site, profile, basePath = "" }) {
  return (
    <article className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href={`${basePath}/blog`} className="text-sm font-black text-[var(--primary)]">Back to Blog</Link>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-[var(--primary)]">{post.category || "Article"}</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-[var(--text)] md:text-6xl">{post.title}</h1>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[var(--mutedText)]">
          <span>{profile.fullName || site.siteName || "Site Owner"}</span>
          {post.publishedAt ? <span>{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
          <span>{Math.max(1, Math.ceil(String(post.content || "").split(/\s+/).length / 220))} min read</span>
        </div>
        {post.featuredImage ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--border)]">
            <Image src={post.featuredImage} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        ) : null}
        <div className="prose prose-neutral mt-10 max-w-none text-[var(--mutedText)]">
          {String(post.content || post.excerpt || "")
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index} className="text-base leading-8">{paragraph}</p>
            ))}
        </div>
        {!!relatedPosts.length && (
          <div className="mt-12 border-t border-[var(--border)] pt-8">
            <h2 className="text-2xl font-black text-[var(--text)]">Related Posts</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`${basePath}/blog/${related.slug}`} className="rounded-xl border border-[var(--border)] bg-[var(--softBackground)] p-4">
                  <p className="font-black text-[var(--text)]">{related.title}</p>
                  {related.excerpt ? <p className="mt-2 text-sm text-[var(--mutedText)]">{related.excerpt}</p> : null}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
