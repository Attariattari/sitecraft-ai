import Link from "next/link";
import { ArrowRight, CheckCircle2, Minus, XCircle } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection } from "@/components/public/PublicCards";
import {
  formatLimitValue,
  getPlanComparison,
} from "@/lib/plans/planEntitlements";
import { getPublicAvailability } from "@/lib/public/publicAvailability";
import {
  getCategoryAccessText,
  getTemplateAccessText,
  getThemeAccessText,
} from "@/lib/public/publicAvailabilityCopy";

export const metadata = {
  title: "Pricing | SiteCraft AI",
  description:
    "Compare SiteCraft AI plans with truthful access to current website categories, templates, themes, AI credits, and upcoming platform features.",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usageRows = [
  { label: "Websites", key: "websites" },
  { label: "Themes", key: "themes", allLabel: "High limit" },
  { label: "AI Credits", key: "aiCreditsPerMonth" },
];

const recommendations = [
  ["Free", "Best for trying the platform."],
  ["Basic", "Best for personal brands and small businesses."],
  ["Pro", "Best for professionals who want more websites, more themes, stronger AI usage, and growth-ready tools."],
];

const faqs = [
  ["Can I start for free?", "Yes. Free includes one website, one theme, limited templates, and monthly AI credits."],
  ["What happens when I reach my website limit?", "The dashboard can show an upgrade message and the backend blocks new website creation until you upgrade."],
  ["How many themes are included in each plan?", "Free includes 1 theme, Basic includes 4 themes, and Pro includes 10 themes."],
  ["What are AI credits?", "AI credits represent monthly usage for AI-assisted website generation and related AI workflows."],
  ["Can I upgrade later?", "Yes. The subscription model is ready for upgrades when billing is connected."],
  ["Can I downgrade?", "Yes. Downgrades can be handled by the billing provider and reflected in your SiteCraft AI subscription status."],
  ["Will SiteCraft AI support team tools?", "Team collaboration and client workflow tools are planned for future releases. Current active plans are Free, Basic, and Pro."],
  ["Will SiteCraft AI support custom domains?", "Custom domain tools are planned for future releases and are not presented as active access yet."],
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

export default async function PricingPage() {
  const comparison = getPlanComparison();
  const { plans, rows } = comparison;
  const availability = await getPublicAvailability();

  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="SiteCraft AI plans"
        title="Choose the Right Plan to Build Websites with AI"
        description="Start free, then upgrade when you need more websites, more themes, more AI credits, and stronger growth tools."
        primaryLabel="Start Free"
        secondaryHref="#compare"
        secondaryLabel="Compare Plans"
      />

      <PublicSection title="Plans for every stage">
        <div className="mx-auto mb-8 max-w-4xl rounded-lg border border-primary/20 bg-primary/10 p-5 text-center">
          <p className="text-sm font-bold leading-6 text-foreground">
            SiteCraft AI is launching with selected website categories,
            templates, and features. More categories, templates, and advanced
            tools are being released step by step.
          </p>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {getCategoryAccessText(availability.activeCategoriesCount)}{" "}
            Currently available: {availability.activeTemplateCount} active
            template{availability.activeTemplateCount === 1 ? "" : "s"} and{" "}
            {availability.activeThemeCount} active theme
            {availability.activeThemeCount === 1 ? "" : "s"}.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
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
                      {formatLimitValue(plan.limits.themes, "High limit")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">AI credits</span>
                    <span className="font-black text-foreground">
                      {formatLimitValue(plan.limits.aiCreditsPerMonth)}
                    </span>
                  </div>
                </div>
                <div className="mt-5 rounded-lg border border-border bg-background/70 p-3 text-xs font-semibold leading-5 text-muted-foreground">
                  <p>{getTemplateAccessText(plan, availability.activeTemplateCount)}</p>
                  <p className="mt-1">{getThemeAccessText(plan, availability.activeThemeCount)}</p>
                  <p className="mt-1">{getCategoryAccessText(availability.activeCategoriesCount)}</p>
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
        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          Team collaboration and client workflow tools are planned for future releases.
        </p>
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
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {plans.map((plan) => (
                  <div key={plan.slug} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-black uppercase text-muted-foreground">
                      {plan.name}
                    </p>
                    <p className="mt-1 text-lg font-black text-foreground">
                      {formatLimitValue(plan.limits[row.key], row.allLabel || "High limit")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection title="Which plan fits best?">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
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
