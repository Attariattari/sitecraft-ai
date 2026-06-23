import { Crown } from "lucide-react";
import { getPlanBySlug, getUserPlanSlug } from "@/lib/plans/planEntitlements";

export function PlanBadge({ user, planSlug, className = "" }) {
  const plan = getPlanBySlug(planSlug || getUserPlanSlug(user));

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-primary ${className}`}
    >
      <Crown className="size-3.5" />
      {plan.name}
    </span>
  );
}
