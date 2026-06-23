import Link from "next/link";
import { ArrowRight, CheckCircle2, Minus, XCircle } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection } from "@/components/public/PublicCards";
import {
  formatLimitValue,
  getPlanComparison,
} from "@/lib/plans/planEntitlements";

export const metadata = {
  title: "Pricing | SiteCraft AI",
  description: "Compare SiteCraft AI plans for AI websites, themes, templates, custom domains, analytics, and agency workflows.",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usageRows = [
  { label: "Websites", key: "websites" },
  { label: "Themes", key: "themes", allLabel: "All" },
  { label: "AI Credits", key: "aiCreditsPerMonth" },
  { label: "Custom Domains", key: "customDomains" },
];

const recommendations = [
  ["Free", "Best for trying the platform."],
  ["Basic", "Best for personal brands and small businesses."],
  ["Pro", "Best for serious creators, freelancers, and growing businesses."],
  ["Agency", "Best for agencies and teams managing multiple client websites."],
];

const faqs = [
  ["Can I start for free?", "Yes. Free includes one website, one theme, limited templates, and monthly AI credits."],
  ["What happens when I reach my website limit?", "The dashboard can show an upgrade message and the backend blocks new website creation until you upgrade."],
  ["How many themes are included in each plan?", "Free includes 1 theme, Basic includes 4, Pro includes 10, and Agency includes all available themes."],
  ["What are AI credits?", "AI credits represent monthly usage for AI-assisted website generation and related AI workflows."],
  ["Can I upgrade later?", "Yes. The subscription model is ready for upgrades when billing is connected."],
  ["Can I downgrade?", "Yes. Downgrades can be handled by the billing provider and reflected in your SiteCraft AI subscription status."],
  ["Does Agency include all themes?", "Yes. Agency is configured with unlimited theme access."],
  ["Are custom domains included?", "Basic includes 1 custom domain, Pro includes 5, and Agency includes unlimited custom domains."],
  ["Is payment system already connected?", "Payment integration can be connected based on your billing setup."],
];

function formatPrice(plan) {
  if (plan.priceMonthly === 0) return "$0";
  return currency.format(plan.priceMonthly);
}

function formatCell(row, value) {
  if (row.type === "feature") {
    return value ? "Included" : "Not included";
  }

  if (row.key === "themes" && value === -1) return "All";
  return formatLimitValue(value);
}

function CellIcon({ included }) {
  if (included) {
    return <CheckCircle2 className="mx-auto size-5 text-primary" aria-hidden="true" />;
  }

  return <XCircle className="mx-auto size-5 text-muted-foreground/60" aria-hidden="true" />;
}

export default function PricingPage() {
  const comparison = getPlanComparison();
  const { plans, rows } = comparison;

  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="SiteCraft AI plans"
        title="Choose the Right Plan to Build Websites with AI"
        description="Start free, then upgrade when you need more websites, more themes, more AI credits, custom domains, analytics, and agency-level tools."
        primaryLabel="Start Free"
        secondaryHref="#compare"
        secondaryLabel="Compare Plans"
      />

      <PublicSection title="Plans for every stage">
        <div className="grid gap-5 lg:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.slug}
              className={`relative flex rounded-lg border bg-card p-5 shadow-sm ${
                plan.isPopular ? "border-primary shadow-primary/10" : "border-border"
              }`}
            >
              <div className="flex min-h-[500px] w-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-primary">
                      {plan.badge}
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-foreground">
                      {plan.name}
                    </h2>
                  </div>
                  {plan.isPopular ? (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
                      Popular
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 min-h-[66px] text-sm font-semibold leading-6 text-muted-foreground">
                  {plan.description}
                </p>

                <div className="mt-5">
                  <span className="text-4xl font-black text-foreground">
                    {formatPrice(plan)}
                  </span>
                  <span className="ml-1 text-sm font-bold text-muted-foreground">
                    /mo
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-black text-foreground">Best for:</span>{" "}
                  {plan.bestFor}
                </p>

                <div className="mt-5 grid gap-2 text-sm">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Websites</span>
                    <span className="font-black text-foreground">
                      {formatLimitValue(plan.limits.websites)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Themes</span>
                    <span className="font-black text-foreground">
                      {formatLimitValue(plan.limits.themes, "All")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">AI credits</span>
                    <span className="font-black text-foreground">
                      {formatLimitValue(plan.limits.aiCreditsPerMonth)}
                    </span>
                  </div>
                </div>

                <ul className="mt-5 space-y-3">
                  {plan.highlights.slice(0, 6).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm font-semibold text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.slug === "free" ? "/signup" : "/pricing#final-cta"}
                  className={`mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition ${
                    plan.isPopular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {plan.ctaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Comparison"
        title="Feature access by plan"
        description="Every row maps to the same entitlement keys used by the backend."
      >
        <div id="compare" className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 text-left font-black text-foreground">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.slug} className="p-4 text-center font-black text-foreground">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-b border-border last:border-b-0">
                  <td className="p-4 font-bold text-foreground">{row.label}</td>
                  {plans.map((plan) => {
                    const value = row.values[plan.slug];
                    return (
                      <td key={plan.slug} className="p-4 text-center text-muted-foreground">
                        {row.type === "feature" ? (
                          <>
                            <CellIcon included={Boolean(value)} />
                            <span className="sr-only">{formatCell(row, value)}</span>
                          </>
                        ) : (
                          <span className="font-black text-foreground">
                            {formatCell(row, value)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Limits"
        title="Usage limits at a glance"
        description="Limits are enforced server-side for actions such as website creation, AI generation, theme access, templates, and custom-domain workflows."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {usageRows.map((row) => (
            <div key={row.key} className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-base font-black text-foreground">{row.label}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {plans.map((plan) => (
                  <div key={plan.slug} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-black uppercase text-muted-foreground">
                      {plan.name}
                    </p>
                    <p className="mt-1 text-lg font-black text-foreground">
                      {formatLimitValue(plan.limits[row.key], row.allLabel || "Unlimited")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection title="Which plan fits best?">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recommendations.map(([name, text]) => (
            <div key={name} className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-lg font-black text-foreground">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection title="Pricing FAQ">
        <div className="grid gap-4 lg:grid-cols-3">
          {faqs.map(([question, answer]) => (
            <div key={question} className="rounded-lg border border-border bg-card p-5">
              <h3 className="flex items-start gap-2 text-sm font-black text-foreground">
                <Minus className="mt-0.5 size-4 shrink-0 text-primary" />
                {question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      </PublicSection>

      <div id="final-cta">
        <PublicCTA
          title="Build your first SiteCraft AI website today."
          description="Start free with a basic website, then move into larger limits and advanced tools when your work grows."
          label="Generate Your Website"
        />
      </div>
    </main>
  );
}
