import Link from "next/link";
import { ArrowRight, Gift, ShieldCheck } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection } from "@/components/public/PublicCards";
import { PlanComparisonTable } from "@/components/public/pricing/PlanComparisonTable";
import { PricingPlanCard } from "@/components/public/pricing/PricingPlanCard";
import { getPlanComparison } from "@/lib/plans/planEntitlements";
import { getActivePlans } from "@/lib/plans/planService";
import { getPublicAvailability } from "@/lib/public/publicAvailability";
import { getCategoryAccessText } from "@/lib/public/publicAvailabilityCopy";

export const metadata = {
  title: "Pricing | SiteCraft AI",
  description:
    "Compare Free, Basic, and Pro SiteCraft AI plans with secure checkout, coupons, first-purchase bonuses, and current plan limits.",
};

const faqs = [
  ["Which plans are active?", "Free, Basic, and Pro are the active public plans. Agency remains future only and is not purchasable."],
  ["Can I apply a coupon?", "Yes. Valid coupons are checked server-side during checkout before payment session creation."],
  ["Do bonuses activate before payment?", "No. First-time bonuses are shown in checkout but applied only after verified payment or admin-granted access."],
  ["Do you store card details?", "No. SiteCraft AI is designed for hosted or tokenized gateways and never stores card numbers or CVV."],
  ["Which plan is best for me?", "Free is best for testing. Basic fits personal brands and small businesses. Pro fits professionals who need more websites, credits, themes, and support."],
  ["Is manual bank transfer available?", "Only if admin enables manual payments. Manual payments stay pending until Super Admin verification."],
];

export default async function PricingPage() {
  const [plans, availability] = await Promise.all([getActivePlans(), getPublicAvailability()]);
  const comparison = getPlanComparison();

  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="SiteCraft AI pricing"
        title="Choose a Plan That Matches Your Website Work"
        description="Start free, compare limits clearly, then upgrade through a checkout flow that keeps payment verification server-side."
        primaryLabel="Start Free"
        secondaryHref="#compare"
        secondaryLabel="Compare Plans"
      />

      <PublicSection title="Public plans">
        <div className="mx-auto mb-8 max-w-4xl rounded-lg border border-primary/20 bg-primary/10 p-5 text-center">
          <p className="text-sm font-bold leading-6 text-foreground">
            Active public plans are Free, Basic, and Pro. Agency is planned for later and is not shown as purchasable.
          </p>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {getCategoryAccessText(availability.activeCategoriesCount)} Current availability is reflected in plan limits and public product pages.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingPlanCard key={plan.slug} plan={plan} />
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Bonus offer"
        title="First purchase bonus"
        description="Shown in checkout and applied only after successful verified paid purchase."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <BonusCard title="Basic first purchase" value="+3 months" text="For users making their first successful paid Basic purchase." />
          <BonusCard title="Pro first purchase" value="+6 months" text="For users making their first successful paid Pro purchase." />
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Comparison"
        title="Plan comparison"
        description="The same plan keys power pricing, checkout, dashboard billing, and backend entitlement checks."
      >
        <div id="compare">
          <PlanComparisonTable comparison={comparison} />
        </div>
      </PublicSection>

      <PublicSection title="Secure billing notes">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Server verification", "Plans activate only after verified webhook or Super Admin manual verification."],
            ["No raw cards", "Card details must stay inside hosted or tokenized payment providers."],
            ["Coupons checked safely", "Coupon rules, usage limits, plan applicability, and final amount are calculated server-side."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5">
              <ShieldCheck className="size-5 text-primary" />
              <h3 className="mt-4 text-base font-black text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection title="Pricing FAQ">
        <div className="grid gap-4 lg:grid-cols-3">
          {faqs.map(([question, answer]) => (
            <div key={question} className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-black text-foreground">{question}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      </PublicSection>

      <div id="final-cta">
        <PublicCTA
          title="Ready to build with SiteCraft AI?"
          description="Review plan details, compare limits, and continue only when the plan fits your work."
          label="Generate Your Website"
        />
      </div>
    </main>
  );
}

function BonusCard({ title, value, text }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <Gift className="size-5 text-primary" />
      <h3 className="mt-4 text-lg font-black text-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-black text-primary">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      <Link href="/pricing/basic" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
        View plan details <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
