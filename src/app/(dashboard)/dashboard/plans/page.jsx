import Link from "next/link";
import { ArrowRight, CheckCircle2, Crown } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { formatLimitValue, getPublicPlans } from "@/lib/plans/planEntitlements";

export const metadata = {
  title: "Plans | SiteCraft Dashboard",
};

export default function PlansPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Plans"
        description="Compare plan limits and choose the right access level for your websites."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {getPublicPlans().map((plan) => (
          <DashboardCard
            key={plan.slug}
            className={`flex min-h-[430px] flex-col ${
              plan.isPopular ? "border-primary" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-primary">
                  {plan.badge}
                </p>
                <h2 className="mt-2 text-xl font-black text-foreground">
                  {plan.name}
                </h2>
              </div>
              {plan.isPopular ? <Crown className="size-5 text-primary" /> : null}
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {plan.description}
            </p>

            <div className="mt-5 grid gap-2 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Websites</span>
                <span className="font-black text-foreground">
                  {formatLimitValue(plan.limits.websites)}
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Themes</span>
                <span className="font-black text-foreground">
                  {formatLimitValue(plan.limits.themes, "High limit")}
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">AI credits</span>
                <span className="font-black text-foreground">
                  {formatLimitValue(plan.limits.aiCreditsPerMonth)}
                </span>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {plan.highlights.slice(0, 5).map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/pricing"
              className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-black text-primary-foreground transition hover:opacity-90"
            >
              View Pricing
              <ArrowRight className="size-4" />
            </Link>
          </DashboardCard>
        ))}
      </div>
    </DashboardShell>
  );
}
