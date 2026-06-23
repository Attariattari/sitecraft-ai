import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function PublicSection({ eyebrow, title, description, children, className = "" }) {
  return (
    <section className={`bg-background py-16 ${className}`}>
      <div className="container mx-auto px-6">
        {(eyebrow || title || description) && (
          <div className="mx-auto mb-10 max-w-3xl text-center">
            {eyebrow ? (
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function ThemeCard({ icon: Icon, title, description, items = [], cta, href = "/generate" }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-70" />
      {Icon ? (
        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="size-5" />
        </div>
      ) : null}
      <h3 className="text-xl font-black text-foreground">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
        {description}
      </p>
      {items.length ? (
        <ul className="mt-5 space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {cta ? (
        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary"
        >
          {cta}
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}

export function PublicCTA({
  title = "Ready to build your website?",
  description = "Turn your idea into a polished, theme-ready website with SiteCraft AI.",
  href = "/generate",
  label = "Start Building",
}) {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 text-center shadow-2xl">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-soft via-transparent to-accent-soft" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
            <Link
              href={href}
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90"
            >
              {label}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
