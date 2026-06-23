import { CheckCircle2, CreditCard, Database, Plus, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { DEFAULT_PLANS, formatLimitValue } from "@/lib/plans/planEntitlements";

export default function AdminPlansPage() {
  const popularPlan = DEFAULT_PLANS.find((plan) => plan.isPopular);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Plans"
        description="Manage platform subscription plans, feature toggles, pricing, and limits."
        route="/admin/plans"
      >
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90">
          <Plus className="size-4" />
          Create Plan
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AdminStatCard
          icon={CreditCard}
          label="Active Plans"
          value={String(DEFAULT_PLANS.length)}
          sub="Free, Basic, Pro, Agency"
        />
        <AdminStatCard
          icon={Database}
          label="Plan Source"
          value="Seeded"
          sub="/api/admin/plans/seed"
        />
        <AdminStatCard
          icon={Star}
          label="Popular"
          value={popularPlan?.name || "None"}
          sub="Pricing highlight"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={CreditCard}
          label="Billing"
          value="Ready"
          sub="Provider fields prepared"
          iconClass="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DEFAULT_PLANS.map((plan) => (
          <div
            key={plan.slug}
            className={`rounded-lg border bg-card p-5 shadow-sm ${
              plan.isPopular ? "border-primary" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-black text-foreground">{plan.name}</h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary">
                {plan.badge}
              </span>
            </div>

            <p className="mt-3 text-2xl font-black text-foreground">
              {plan.priceMonthly === 0 ? "$0" : `$${plan.priceMonthly}`}/mo
            </p>
            <p className="mt-2 min-h-[44px] text-xs leading-5 text-muted-foreground">
              {plan.description}
            </p>

            <div className="mt-4 grid gap-2 text-xs">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Websites</span>
                <span className="font-black text-foreground">
                  {formatLimitValue(plan.limits.websites)}
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Themes</span>
                <span className="font-black text-foreground">
                  {formatLimitValue(plan.limits.themes, "All")}
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">AI credits</span>
                <span className="font-black text-foreground">
                  {formatLimitValue(plan.limits.aiCreditsPerMonth)}
                </span>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {plan.highlights.slice(0, 5).map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className="mt-5 w-full rounded-lg border border-border px-4 py-2 text-xs font-bold transition-all hover:bg-muted">
              Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
