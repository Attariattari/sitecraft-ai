import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatLimitValue } from "@/lib/plans/planEntitlements";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPlanPrice(plan) {
  if (!plan?.priceMonthly) return "$0";
  return formatter.format(plan.priceMonthly);
}

export function PricingPlanCard({ plan }) {
  const isFree = plan.slug === "free";
  const href = isFree ? "/signup" : `/pricing/${plan.slug}`;

  return (
    <article
      className={`relative flex rounded-lg border bg-card p-5 shadow-sm ${
        plan.isPopular ? "border-primary shadow-primary/10" : "border-border"
      }`}
    >
      <div className="flex min-h-[510px] w-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-primary">{plan.badge}</p>
            <h2 className="mt-2 text-2xl font-black text-foreground">{plan.name}</h2>
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
          <span className="text-4xl font-black text-foreground">{formatPlanPrice(plan)}</span>
          <span className="ml-1 text-sm font-bold text-muted-foreground">/mo</span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-black text-foreground">Best for:</span> {plan.bestFor}
        </p>

        <div className="mt-5 grid gap-2 text-sm">
          {[
            ["Websites", "websites"],
            ["Themes", "themes"],
            ["Templates", "templates"],
            ["AI credits", "aiCreditsPerMonth"],
          ].map(([label, key]) => (
            <div key={key} className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-black text-foreground">
                {formatLimitValue(plan.limits?.[key], "High limit")}
              </span>
            </div>
          ))}
        </div>

        <ul className="mt-5 space-y-3">
          {(plan.highlights || []).slice(0, 7).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href={href}
          className={`mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition ${
            plan.isPopular ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border text-foreground hover:bg-muted"
          }`}
        >
          {isFree ? "Start Free" : "View plan details"}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
