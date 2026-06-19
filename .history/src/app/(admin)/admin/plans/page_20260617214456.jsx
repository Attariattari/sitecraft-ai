import { CreditCard, Plus, Star, CheckCircle2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const plans = [
  {
    name: "Free",
    price: "$0/mo",
    color: "border-muted",
    badge: "Base",
    badgeColor: "bg-muted text-muted-foreground",
    users: "—",
    features: [
      "3 AI generations",
      "1 website",
      "Basic templates",
      "Subdomain hosting",
    ],
  },
  {
    name: "Pro",
    price: "$19/mo",
    color: "border-primary/40",
    badge: "Popular",
    badgeColor: "bg-primary/10 text-primary",
    users: "—",
    features: [
      "50 AI generations",
      "5 websites",
      "All templates",
      "Custom domain",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    price: "$49/mo",
    color: "border-purple-500/30",
    badge: "Business",
    badgeColor: "bg-purple-500/10 text-purple-600",
    users: "—",
    features: [
      "200 AI generations",
      "25 websites",
      "Premium templates",
      "Team access",
      "White label",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    color: "border-yellow-500/30",
    badge: "Enterprise",
    badgeColor: "bg-yellow-500/10 text-yellow-600",
    users: "—",
    features: [
      "Unlimited generations",
      "Unlimited websites",
      "Custom AI models",
      "Dedicated support",
      "SLA",
    ],
  },
];

export default function AdminPlansPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Plans"
        description="Manage platform subscription plans, features, and limitations."
        route="/admin/plans"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Create Plan
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={CreditCard}
          label="Active Plans"
          value="4"
          sub="Published plans"
        />
        <AdminStatCard
          icon={CreditCard}
          label="Free Users"
          value="—"
          sub="On free plan"
        />
        <AdminStatCard
          icon={Star}
          label="Paid Users"
          value="—"
          sub="Pro + Agency + Ent."
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={CreditCard}
          label="Enterprise"
          value="—"
          sub="Custom deals"
          iconClass="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border-2 bg-card p-5 space-y-4 hover:shadow-md transition-shadow ${p.color}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-foreground">{p.name}</h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${p.badgeColor}`}
              >
                {p.badge}
              </span>
            </div>
            <p className="text-2xl font-black text-foreground">{p.price}</p>
            <div className="text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{p.users}</span>{" "}
              active users
            </div>
            <ul className="space-y-2">
              {p.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-all">
              Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
