import { notFound, redirect } from "next/navigation";
import { PublicSection } from "@/components/public/PublicCards";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getPlanComparison } from "@/lib/plans/planEntitlements";
import { getPurchasablePlanBySlug } from "@/lib/plans/planService";
import { getPaymentMethods } from "@/lib/server/billing/billingConfig";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getFirstPurchaseBonus } from "@/lib/server/billing/applyFirstPurchaseBonus";

export const metadata = {
  title: "Checkout | SiteCraft AI",
  description: "Complete secure SiteCraft AI checkout with server-side payment verification.",
};

export default async function CheckoutPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { planSlug } = await params;
  const plan = await getPurchasablePlanBySlug(planSlug);
  if (!plan) notFound();

  const [firstPurchaseBonus] = await Promise.all([
    getFirstPurchaseBonus({ userId: user.id, planSlug: plan.slug }),
  ]);

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <PublicSection
          eyebrow="Secure checkout"
          title={`${plan.name} Plan Checkout`}
          description="Review price, coupon, bonus duration, payment method, and agreement before creating a payment session."
        >
          <CheckoutClient
            plan={plan}
            comparison={getPlanComparison()}
            paymentMethods={getPaymentMethods()}
            firstPurchaseBonus={firstPurchaseBonus}
          />
        </PublicSection>
      </div>
    </main>
  );
}
