"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlogListingClient({ blogs = [], categories = [] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");

  const tags = useMemo(() => {
    return Array.from(new Set(blogs.flatMap((blog) => blog.tags || []))).slice(0, 12);
  }, [blogs]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return blogs.filter((blog) => {
      const matchesCategory = category === "all" || blog.category === category;
      const matchesTag = tag === "all" || blog.tags?.includes(tag);
      const matchesSearch =
        !term ||
        [blog.title, blog.summary, blog.category, ...(blog.tags || [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [blogs, category, search, tag]);

  const featured = filtered.find((blog) => blog.isFeatured) || filtered[0];
  const cards = featured ? filtered.filter((blog) => blog.id !== featured.id) : filtered;

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search SiteCraft AI articles..."
                className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 rounded-2xl border border-border bg-background px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {tags.length > 0 && (
              <select
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                className="h-12 rounded-2xl border border-border bg-background px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All tags</option>
                {tags.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-border bg-card p-12 text-center">
            <BookOpen className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 text-2xl font-black text-foreground">No articles found</h2>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              Try another search, category, or tag.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group mt-8 grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 lg:grid-cols-[1.05fr_0.95fr]"
              >
                <div className="p-6 md:p-8">
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                    Featured
                  </span>
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-primary">
                    {featured.category}
                  </p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-foreground md:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-muted-foreground">
                    {featured.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                    <span>{featured.authorName}</span>
                    <span>{featured.readTime} min read</span>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-black text-primary">
                    Read featured article
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="min-h-64 bg-primary/5">
                  {featured.image?.url ? (
                    <Image
                      src={featured.image.url}
                      alt={featured.image.alt || featured.title}
                      width={featured.image.width || 900}
                      height={featured.image.height || 540}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      unoptimized={featured.image.url.includes(".svg")}
                      className="h-full min-h-64 w-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full min-h-64 items-center justify-center">
                      <BookOpen className="size-14 text-primary" />
                    </div>
                  )}
                </div>
              </Link>
            )}

            <div className="mt-10">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Latest
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-foreground">Recent articles</h2>
                </div>
                <p className="text-xs font-bold text-muted-foreground">{filtered.length} published</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="aspect-[16/9] bg-primary/5">
                      {post.image?.url ? (
                        <Image
                          src={post.image.url}
                          alt={post.image.alt || post.title}
                          width={post.image.width || 640}
                          height={post.image.height || 360}
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                          unoptimized={post.image.url.includes(".svg")}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="size-10 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                        {post.category}
                      </p>
                      <h3 className="mt-3 line-clamp-2 text-xl font-black text-foreground">
                        {post.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-muted-foreground">
                        {post.summary}
                      </p>
                      <div className="mt-5 flex items-center justify-between text-xs font-bold text-muted-foreground">
                        <span>{post.readTime} min read</span>
                        <span className={cn("text-primary transition group-hover:translate-x-1")}>
                          Read
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
