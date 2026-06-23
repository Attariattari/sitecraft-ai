import { canUseFeature, getNextPlanForFeature, getUpgradeRequiredMessage, getUserPlanSlug } from "@/lib/plans/planEntitlements";
import { UpgradeCard } from "@/components/plans/UpgradeCard";

export function FeatureGate({
  user,
  featureKey,
  children,
  fallback,
  disabled = false,
}) {
  const allowed = canUseFeature(user, featureKey);

  if (allowed) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  if (disabled) {
    return (
      <div className="pointer-events-none opacity-50" aria-disabled="true">
        {children}
      </div>
    );
  }

  return (
    <UpgradeCard
      message={getUpgradeRequiredMessage(featureKey)}
      upgradeTo={getNextPlanForFeature(featureKey, getUserPlanSlug(user))}
    />
  );
}
