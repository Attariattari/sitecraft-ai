"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, ShieldCheck, TicketPercent } from "lucide-react";
import { PlanComparisonTable } from "@/components/public/pricing/PlanComparisonTable";

export function CheckoutClient({ plan, comparison, paymentMethods, firstPurchaseBonus }) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods.find((item) => item.enabled)?.id || "card");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const baseAmount = billingCycle === "yearly" ? plan.priceYearly || plan.priceMonthly * 10 : plan.priceMonthly;
  const discountAmount = coupon?.discountAmount || 0;
  const finalAmount = Math.max(0, baseAmount - discountAmount);
  const cycleMonths = billingCycle === "yearly" ? 12 : 1;
  const totalMonths = cycleMonths + (coupon?.bonusMonths || 0) + (firstPurchaseBonus?.bonusMonths || 0);

  const formatter = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency || "USD", maximumFractionDigits: 0 }),
    [plan.currency],
  );

  async function applyCoupon() {
    setStatus("");
    const response = await fetch("/api/checkout/apply-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planSlug: plan.slug, billingCycle, couponCode }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setCoupon(null);
      setStatus(data.message || "Coupon could not be applied.");
      return;
    }
    setCoupon(data.coupon);
    setStatus(data.coupon.message);
  }

  async function createCheckout() {
    if (!agreed) {
      setStatus("Please agree to the Terms, Privacy Policy, and Refund Policy before continuing.");
      return;
    }
    setLoading(true);
    setStatus("Creating secure checkout...");
    const response = await fetch("/api/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planSlug: plan.slug, billingCycle, couponCode: coupon?.code || "", paymentMethod }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok || !data.success) {
      setStatus(data.message || "Checkout is not available yet.");
      return;
    }
    if (data.redirectUrl) router.push(data.redirectUrl);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-black uppercase text-primary">Selected plan</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">{plan.name} checkout</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.description}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-black text-foreground">Billing cycle</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["monthly", "yearly"].map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => {
                  setBillingCycle(cycle);
                  setCoupon(null);
                }}
                className={`rounded-lg border p-4 text-left transition ${
                  billingCycle === cycle ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                }`}
              >
                <span className="text-sm font-black capitalize text-foreground">{cycle}</span>
                <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                  {cycle === "yearly" ? "12 months billed together" : "1 month access"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-foreground">
            <TicketPercent className="size-5 text-primary" /> Coupon code
          </h2>
          <div className="mt-4 flex gap-2">
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
              placeholder="SAVE20"
            />
            <button type="button" onClick={applyCoupon} className="rounded-lg border border-border px-4 text-sm font-black hover:bg-muted">
              Apply
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-foreground">
            <CreditCard className="size-5 text-primary" /> Payment method
          </h2>
          <div className="mt-4 grid gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                disabled={!method.enabled}
                onClick={() => setPaymentMethod(method.id)}
                className={`rounded-lg border p-4 text-left transition ${
                  paymentMethod === method.id ? "border-primary bg-primary/10" : "border-border"
                } ${!method.enabled ? "cursor-not-allowed opacity-60" : "hover:bg-muted"}`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-black text-foreground">{method.label}</span>
                  <span className="text-xs font-black text-muted-foreground">{method.enabled ? "Available" : "Unavailable"}</span>
                </span>
                <span className="mt-1 block text-xs font-semibold leading-5 text-muted-foreground">{method.note}</span>
              </button>
            ))}
          </div>
        </div>

        <PlanComparisonTable comparison={comparison} compact />
      </section>

      <aside className="h-fit rounded-lg border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-lg font-black text-foreground">Price breakdown</h2>
        <div className="mt-5 space-y-3 text-sm">
          <Line label={`${plan.name} ${billingCycle}`} value={formatter.format(baseAmount)} />
          <Line label="Discount" value={`-${formatter.format(discountAmount)}`} />
          <Line label="First-time bonus" value={`+${firstPurchaseBonus?.bonusMonths || 0} months`} />
          <Line label="Coupon bonus" value={`+${coupon?.bonusMonths || 0} months`} />
          <Line label="Total access period" value={`${totalMonths} month${totalMonths === 1 ? "" : "s"}`} />
        </div>
        <div className="mt-5 border-t border-border pt-5">
          <Line label="Final amount" value={formatter.format(finalAmount)} strong />
        </div>
        <label className="mt-5 flex items-start gap-3 text-xs font-semibold leading-5 text-muted-foreground">
          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1" />
          <span>I agree to the Terms and Conditions, Privacy Policy, and Refund Policy.</span>
        </label>
        <button
          type="button"
          onClick={createCheckout}
          disabled={loading}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-black text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          <ShieldCheck className="size-4" />
          {loading ? "Preparing checkout..." : "Continue securely"}
        </button>
        {status ? <p className="mt-4 text-sm font-semibold text-muted-foreground">{status}</p> : null}
        <div className="mt-5 rounded-lg border border-primary/20 bg-primary/10 p-3 text-xs font-semibold leading-5 text-muted-foreground">
          <CheckCircle2 className="mb-2 size-4 text-primary" />
          Payment success pages never activate a plan by themselves. SiteCraft AI waits for verified gateway webhook or Super Admin manual verification.
        </div>
      </aside>
    </div>
  );
}

function Line({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "text-xl font-black text-foreground" : "font-black text-foreground"}>{value}</span>
    </div>
  );
}
