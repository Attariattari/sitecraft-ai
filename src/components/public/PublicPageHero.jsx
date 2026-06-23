import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function PublicPageHero({
  badge,
  title,
  highlight,
  description,
  primaryHref = "/generate",
  primaryLabel = "Generate Your Website",
  secondaryHref,
  secondaryLabel,
}) {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-16">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-soft via-transparent to-accent-soft" />
      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          {badge ? (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-1.5 text-xs font-black text-primary">
              <Sparkles className="size-3.5" />
              {badge}
            </div>
          ) : null}
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {title}{" "}
            {highlight ? <span className="text-primary">{highlight}</span> : null}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90"
            >
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-background/60 px-6 text-sm font-black text-foreground transition hover:bg-secondary"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
