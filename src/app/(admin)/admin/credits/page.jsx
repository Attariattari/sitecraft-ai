import { Coins, Plus, ArrowUpDown, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";

export default function AdminCreditsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Credits"
        description="Manage platform AI credits — view issuance, consumption, and manual adjustments."
        route="/admin/credits"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Manual Adjust
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Coins}
          label="Total Issued"
          value="—"
          sub="All credits given"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={Coins}
          label="Total Used"
          value="—"
          sub="Credits consumed"
          iconClass="bg-blue-500"
        />
        <AdminStatCard
          icon={Coins}
          label="Remaining"
          value="—"
          sub="Platform balance"
          iconClass="bg-purple-500"
        />
        <AdminStatCard
          icon={Users}
          label="Users w/ Credits"
          value="—"
          sub="Active holders"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-black text-foreground mb-4">
          Manual Credit Adjustment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block">
              User Email
            </label>
            <input
              placeholder="user@example.com"
              className="w-full px-4 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block">
              Credits Amount
            </label>
            <input
              type="number"
              placeholder="e.g. 10"
              className="w-full px-4 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block">
              Reason
            </label>
            <input
              placeholder="Reason for adjustment"
              className="w-full px-4 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary text-sm"
            />
          </div>
        </div>
        <button className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <ArrowUpDown className="w-4 h-4" />
          Apply Adjustment
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          Backend integration required. This form will call{" "}
          <code className="font-mono text-primary">
            POST /api/admin/credits/adjust
          </code>
        </p>
      </div>

      <div>
        <h2 className="text-sm font-black text-foreground mb-3">Credit Logs</h2>
        <AdminTablePlaceholder
          columns={["User", "Action", "Credits", "Reason", "Admin", "Date"]}
          rows={6}
        />
      </div>
    </div>
  );
}
