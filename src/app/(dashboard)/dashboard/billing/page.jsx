"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, Zap } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out SiteCraft AI.",
    features: [
      "5 AI generations total",
      "Basic themes",
      "SiteCraft domain",
      "Community support",
    ],
    current: true,
  },
  {
    name: "Basic",
    price: "$12",
    period: "/mo",
    description: "For personal brands, freelancers, and small businesses.",
    features: [
      "300 AI credits per month",
      "Up to 3 websites",
      "4 themes",
      "10 templates",
      "Basic SEO metadata",
      "Cloudinary media upload",
      "Standard support",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For professionals who need more capacity and stronger tools.",
    features: [
      "1,000 AI credits per month",
      "Up to 10 websites",
      "10 themes",
      "Higher template access",
      "More media and project capacity",
      "Growth-ready dashboard tools",
      "Priority support",
    ],
    current: false,
    popular: true,
  },
];

export default function DashboardBillingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Billing & Plans"
        description="Manage your subscription, billing details, and view invoices."
      />

      <div className="mb-10 text-center">
        <div className="inline-flex items-center p-1 bg-muted rounded-xl border border-border">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              billingCycle === "yearly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly billing{" "}
            <span className="text-[10px] text-emerald-500 ml-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <DashboardCard
            key={plan.name}
            className={`relative flex flex-col h-full ${
              plan.popular ? "border-primary/50 shadow-md shadow-primary/5" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-[10px] uppercase tracking-wider font-bold rounded-full">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground h-10 mt-1">
                {plan.description}
              </p>
            </div>

            <div className="mb-6 flex items-baseline">
              <span className="text-4xl font-extrabold tracking-tight">
                {billingCycle === "yearly" && plan.price !== "$0"
                  ? `$${Math.round(parseInt(plan.price.replace("$", "")) * 0.8)}`
                  : plan.price}
              </span>
              {plan.period && (
                <span className="text-muted-foreground font-medium ml-1">
                  {plan.period}
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                plan.current
                  ? "bg-muted text-muted-foreground cursor-default"
                  : plan.popular
                    ? "site-primary-button"
                    : "site-secondary-button"
              }`}
              disabled={plan.current}
            >
              {plan.current ? "Current Plan" : "Upgrade"}
            </button>
          </DashboardCard>
        ))}
      </div>

      <div className="mt-12">
        <DashboardCard>
          <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold">Payment Methods</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You are currently on the free plan. Add a payment method to
                upgrade.
              </p>
            </div>
            <button className="site-secondary-button px-4 py-2 rounded-lg text-sm font-medium shrink-0">
              Add Payment Method
            </button>
          </div>
        </DashboardCard>
      </div>
    </DashboardShell>
  );
}
