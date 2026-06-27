import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Scale, ShieldCheck } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";

const relatedLinks = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms and Conditions", "/terms"],
  ["Cookie Policy", "/cookie-policy"],
  ["Refund Policy", "/refund-policy"],
  ["Contact", "/contact"],
];

export function LegalLayout({
  title,
  description,
  summary,
  sections,
  badge = "Legal",
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicPageHero
        badge={badge}
        title={title}
        description={description}
        primaryHref="#legal-content"
        primaryLabel="Read Policy"
        secondaryHref="/contact"
        secondaryLabel="Contact Support"
      />

      <section id="legal-content" className="border-y border-border/50 bg-muted/20 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-8 grid max-w-6xl gap-5 md:grid-cols-3">
            <InfoCard icon={CalendarDays} label="Last updated" value="June 2026" />
            <InfoCard icon={ShieldCheck} label="Policy type" value="Platform transparency" />
            <InfoCard icon={Scale} label="Review note" value="Legal review recommended" />
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  Summary
                </p>
                <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">
                  {summary}
                </p>
              </div>

              <nav className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-primary">
                  Contents
                </p>
                <div className="space-y-2">
                  {sections.map((section, index) => (
                    <a
                      key={section.title}
                      href={`#${section.id || slugify(section.title)}`}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-2 text-xs font-black text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                        {index + 1}
                      </span>
                      {section.title}
                    </a>
                  ))}
                </div>
              </nav>
            </aside>

            <div className="space-y-5">
              {sections.map((section) => (
                <LegalSection key={section.title} section={section} />
              ))}

              <div className="rounded-3xl border border-primary/20 bg-primary/10 p-5">
                <p className="text-sm font-bold leading-7 text-foreground">
                  This policy is provided for general platform transparency and should be reviewed by a qualified legal professional before production use.
                </p>
              </div>

              <RelatedLegalLinks />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function LegalSection({ section }) {
  return (
    <section
      id={section.id || slugify(section.title)}
      className="scroll-mt-28 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <FileText className="size-5" />
        </span>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            {section.title}
          </h2>
          {section.lead ? (
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {section.lead}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 text-sm font-medium leading-7 text-muted-foreground md:text-base">
        {section.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {section.items?.length ? (
          <ul className="grid gap-2 md:grid-cols-2">
            {section.items.map((item) => (
              <li key={item} className="rounded-2xl border border-border bg-background p-3 text-sm font-semibold">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <Icon className="mb-4 size-5 text-primary" />
      <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-black text-foreground">{value}</p>
    </div>
  );
}

function RelatedLegalLinks() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
        Related Legal Links
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {relatedLinks.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-border bg-background p-4 transition hover:border-primary/30 hover:text-primary"
          >
            <span className="text-sm font-black text-foreground group-hover:text-primary">
              {label}
            </span>
            <ArrowRight className="mt-3 size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
