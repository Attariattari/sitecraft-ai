"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, FileText, Gift, RefreshCcw, ShieldCheck } from "lucide-react";
import { DashboardShell, DashboardPageHeader } from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { PlanComparisonTable } from "@/components/public/pricing/PlanComparisonTable";

export default function DashboardBillingPage() {
  const [data, setData] = useState({ subscription: null, plan: null, payments: [], invoices: [], plans: [], comparison: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadBilling() {
      setLoading(true);
      const [subscriptionRes, paymentsRes, invoicesRes, plansRes, comparisonRes] = await Promise.all([
        fetch("/api/user/subscription"),
        fetch("/api/user/payments"),
        fetch("/api/user/invoices"),
        fetch("/api/plans"),
        fetch("/api/plans/compare"),
      ]);
      const [subscription, payments, invoices, plans, comparison] = await Promise.all([
        subscriptionRes.json(),
        paymentsRes.json(),
        invoicesRes.json(),
        plansRes.json(),
        comparisonRes.json(),
      ]);
      if (mounted) {
        setData({
          subscription: subscription.subscription,
          plan: subscription.plan,
          payments: payments.payments || [],
          invoices: invoices.invoices || [],
          plans: plans.plans || [],
          comparison: comparison.comparison || comparison,
        });
        setLoading(false);
      }
    }
    loadBilling();
    const timer = setInterval(loadBilling, 30_000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const plan = data.plan || data.plans.find((item) => item.slug === "free");
  const subscription = data.subscription;
  const isGifted = subscription?.adminGranted || subscription?.status === "gifted";
  const isExpired = subscription?.status === "expired" || (subscription?.expiresAt && new Date(subscription.expiresAt) < new Date());

  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Billing & Plans"
        description="View current plan, expiry, bonuses, payment history, invoices, and upgrade options."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <DashboardCard className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-primary">Current plan</p>
              <h2 className="mt-2 text-3xl font-black text-foreground">{loading ? "Loading..." : plan?.name || "Free"}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {plan?.description || "Free plan details will appear here."}
              </p>
            </div>
            <StatusBadge status={isExpired ? "expired" : subscription?.status || "free"} />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Expiry / renewal" value={subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : "No paid expiry"} />
            <Metric label="Bonus months" value={subscription?.bonusMonthsApplied || 0} />
            <Metric label="Billing cycle" value={subscription?.billingCycle || "Free"} />
          </div>
          {isGifted ? (
            <div className="mt-5 rounded-lg border border-primary/20 bg-primary/10 p-4">
              <Gift className="size-5 text-primary" />
              <p className="mt-2 text-sm font-bold text-foreground">
                {subscription?.grantSource === "membership_invite"
                  ? "Your current plan was granted by SiteCraft AI Admin as a membership gift."
                  : "Granted by SiteCraft AI Admin"}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {subscription?.grantReason || "Admin granted access is tracked separately from paid subscription access."}
              </p>
            </div>
          ) : null}
          {isExpired ? (
            <div className="mt-5 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-foreground">
              This subscription appears expired. Renew or choose a new plan to continue paid access.
            </div>
          ) : null}
        </DashboardCard>

        <DashboardCard className="p-6">
          <CreditCard className="size-6 text-primary" />
          <h3 className="mt-4 text-lg font-black text-foreground">Upgrade or renew</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Choose Basic or Pro through secure checkout. Access updates only after verified payment.
          </p>
          <div className="mt-5 grid gap-2">
            {data.plans.filter((item) => item.slug !== "free").map((item) => (
              <Link key={item.slug} href={`/pricing/${item.slug}`} className="rounded-lg border border-border px-4 py-3 text-sm font-black text-foreground hover:bg-muted">
                View {item.name}
              </Link>
            ))}
          </div>
        </DashboardCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DashboardCard className="p-6">
          <h3 className="flex items-center gap-2 text-lg font-black text-foreground">
            <RefreshCcw className="size-5 text-primary" /> Payment history
          </h3>
          <RecordList
            empty="No payments yet."
            rows={data.payments.map((payment) => ({
              id: payment._id,
              title: `${payment.planSlug} ${payment.billingCycle}`,
              meta: `${payment.status} - ${payment.currency} ${payment.finalAmount}`,
              date: payment.createdAt,
            }))}
          />
        </DashboardCard>
        <DashboardCard className="p-6">
          <h3 className="flex items-center gap-2 text-lg font-black text-foreground">
            <FileText className="size-5 text-primary" /> Invoices
          </h3>
          <RecordList
            empty="No invoices yet."
            rows={data.invoices.map((invoice) => ({
              id: invoice._id,
              title: invoice.invoiceNumber,
              meta: `${invoice.status} - ${invoice.currency} ${invoice.finalAmount}`,
              date: invoice.issuedAt,
            }))}
          />
        </DashboardCard>
      </div>

      {data.comparison ? (
        <div className="mt-6">
          <DashboardCard className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-foreground">
              <ShieldCheck className="size-5 text-primary" /> Compare plan access
            </h3>
            <PlanComparisonTable comparison={data.comparison} compact />
          </DashboardCard>
        </div>
      ) : null}
    </DashboardShell>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black uppercase text-primary">
      {status}
    </span>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-background/70 p-4">
      <p className="text-xs font-black uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-black text-foreground">{value}</p>
    </div>
  );
}

function RecordList({ rows, empty }) {
  if (!rows.length) return <p className="mt-4 text-sm font-semibold text-muted-foreground">{empty}</p>;
  return (
    <div className="mt-4 divide-y divide-border rounded-lg border border-border">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-black text-foreground">{row.title}</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">{row.meta}</p>
          </div>
          <p className="text-xs font-semibold text-muted-foreground">{row.date ? new Date(row.date).toLocaleDateString() : ""}</p>
        </div>
      ))}
    </div>
  );
}
