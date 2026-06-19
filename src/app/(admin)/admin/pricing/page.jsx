import { DollarSign, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const pricingRules = [
  {
    plan: "Free → Pro",
    discount: "0%",
    price: "$19/mo",
    annual: "$190/yr",
    active: true,
  },
  {
    plan: "Pro → Agency",
    discount: "0%",
    price: "$49/mo",
    annual: "$490/yr",
    active: true,
  },
  {
    plan: "Annual Discount",
    discount: "17%",
    price: "—",
    annual: "2 months free",
    active: true,
  },
  {
    plan: "Launch Promo",
    discount: "30%",
    price: "Various",
    annual: "—",
    active: false,
  },
];

export default function AdminPricingPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Pricing"
        description="Manage platform pricing, discount rules, and promotional pricing configurations."
        route="/admin/pricing"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={DollarSign}
          label="Base Plans"
          value="4"
          sub="Active pricing"
        />
        <AdminStatCard
          icon={DollarSign}
          label="Active Promos"
          value="1"
          sub="Current discounts"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={DollarSign}
          label="Annual Plans"
          value="—"
          sub="Annual subscribers"
          iconClass="bg-blue-500"
        />
        <AdminStatCard
          icon={DollarSign}
          label="Avg Revenue"
          value="—"
          sub="Per user/month"
          iconClass="bg-purple-500"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-black text-foreground">Pricing Rules</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {[
                "Rule",
                "Discount",
                "Monthly",
                "Annual",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {pricingRules.map((r, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4 text-sm font-bold text-foreground">
                  {r.plan}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {r.discount}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-foreground">
                  {r.price}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {r.annual}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${r.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                  >
                    {r.active ? "Active" : "Paused"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="text-xs text-primary font-bold hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
