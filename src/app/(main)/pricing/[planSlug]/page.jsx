import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Gift, Users } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicSection } from "@/components/public/PublicCards";
import { PlanComparisonTable } from "@/components/public/pricing/PlanComparisonTable";
import { formatPlanPrice } from "@/components/public/pricing/PricingPlanCard";
import { getPlanComparison, formatLimitValue } from "@/lib/plans/planEntitlements";
import { getPublicPlanBySlug } from "@/lib/plans/planService";

export async function generateMetadata({ params }) {
  const { planSlug } = await params;
  const plan = await getPublicPlanBySlug(planSlug);
  return {
    title: plan ? `${plan.name} Plan | SiteCraft AI` : "Plan | SiteCraft AI",
    description: plan?.description || "Review SiteCraft AI plan details.",
  };
}

export default async function PlanDetailPage({ params }) {
  const { planSlug } = await params;
  const plan = await getPublicPlanBySlug(planSlug);
  if (!plan || plan.slug === "agency") notFound();

  const comparison = getPlanComparison();
  const bonusMonths = plan.slug === "basic" ? 3 : plan.slug === "pro" ? 6 : 0;
  const isFree = plan.slug === "free";

  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge={`${plan.name} plan`}
        title={`${plan.name} Plan`}
        description={plan.description}
        primaryHref={isFree ? "/signup" : `/checkout/${plan.slug}`}
        primaryLabel={isFree ? "Start Free" : "Continue to Payment"}
        secondaryHref="/pricing#compare"
        secondaryLabel="Compare Plans"
      />

      <PublicSection title="What you get">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-black uppercase text-primary">{plan.badge}</p>
            <h2 className="mt-2 text-3xl font-black text-foreground">{formatPlanPrice(plan)} / month</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.bestFor}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(plan.limits || {}).slice(0, 8).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-black uppercase text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="mt-1 text-lg font-black text-foreground">{formatLimitValue(value, "High limit")}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-6">
            <Gift className="size-6 text-primary" />
            <h3 className="mt-4 text-xl font-black text-foreground">Bonus offer</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {bonusMonths > 0
                ? `First successful ${plan.name} purchase can receive +${bonusMonths} months once per user.`
                : "Free plan has no paid first-purchase bonus."}
            </p>
          </div>
        </div>
      </PublicSection>

      <PublicSection title="Key benefits">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(plan.highlights || []).slice(0, 9).map((benefit) => (
            <div key={benefit} className="rounded-lg border border-border bg-card p-5">
              <CheckCircle2 className="size-5 text-primary" />
              <p className="mt-3 text-sm font-bold leading-6 text-muted-foreground">{benefit}</p>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection title="Who this is best for">
        <div className="rounded-lg border border-border bg-card p-6">
          <Users className="size-6 text-primary" />
          <p className="mt-4 text-base font-semibold leading-7 text-muted-foreground">{plan.bestFor}</p>
        </div>
      </PublicSection>

      <PublicSection title="Compare before checkout">
        <PlanComparisonTable comparison={comparison} />
      </PublicSection>

      <PublicSection title="Plan FAQ">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Can I change later?", "Yes. Upgrades and renewals are handled through checkout and verified payment records."],
            ["When does access activate?", "Only after server-side payment verification or Super Admin grant."],
            ["Is Agency available?", "No. Agency remains future only and is not purchasable."],
          ].map(([question, answer]) => (
            <div key={question} className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-black text-foreground">{question}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      </PublicSection>

      <section className="px-4 pb-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-3xl font-black text-foreground">Ready for {plan.name}?</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Continue to a secure checkout summary with coupon, bonus, payment method, and final amount.
          </p>
          <Link
            href={isFree ? "/signup" : `/checkout/${plan.slug}`}
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-black text-primary-foreground hover:opacity-90"
          >
            {isFree ? "Start Free" : "Continue to Payment"} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
