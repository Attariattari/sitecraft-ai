import Image from "next/image";
import Link from "next/link";

export default function GeneratedSiteBlogList({ posts = [], site, profile, basePath = "" }) {
  return (
    <section className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--primary)]">Blog</p>
          <h1 className="mt-3 text-4xl font-black text-[var(--text)] md:text-6xl">Insights from {site.siteName || profile.fullName || "this portfolio"}</h1>
          <p className="mt-5 text-base leading-8 text-[var(--mutedText)]">
            Helpful articles designed to support discoverability and content growth.
          </p>
        </div>
        {posts.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--softBackground)]">
                {post.featuredImage ? (
                  <div className="relative aspect-[16/10]">
                    <Image src={post.featuredImage} alt={post.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  </div>
                ) : null}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 text-xs font-black text-[var(--primary)]">
                    {post.category ? <span>{post.category}</span> : null}
                    {post.publishedAt ? <span>{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
                  </div>
                  <h2 className="mt-3 text-xl font-black text-[var(--text)]">{post.title}</h2>
                  {post.excerpt ? <p className="mt-3 text-sm leading-7 text-[var(--mutedText)]">{post.excerpt}</p> : null}
                  <Link href={`${basePath}/blog/${post.slug}`} className="mt-5 inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-black text-white">
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--softBackground)] p-8">
            <h2 className="text-2xl font-black text-[var(--text)]">Articles will be added soon.</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--mutedText)]">Published posts for this website will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
