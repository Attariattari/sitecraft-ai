import { ShoppingCart, DollarSign, Filter } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Orders"
        description="View and manage all platform subscription orders and purchase transactions."
        route="/admin/orders"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-bold hover:bg-muted transition-all">
          <Filter className="w-4 h-4" />
          Export CSV
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={ShoppingCart}
          label="Total Orders"
          value="—"
          sub="All time"
        />
        <AdminStatCard
          icon={ShoppingCart}
          label="Completed"
          value="—"
          sub="Paid orders"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={ShoppingCart}
          label="Pending"
          value="—"
          sub="Awaiting payment"
          iconClass="bg-yellow-500"
        />
        <AdminStatCard
          icon={DollarSign}
          label="Total Revenue"
          value="—"
          sub="All orders"
          iconClass="bg-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="px-4 py-2 rounded-xl border border-border bg-card outline-none text-sm">
          <option>All Status</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Refunded</option>
          <option>Failed</option>
        </select>
        <select className="px-4 py-2 rounded-xl border border-border bg-card outline-none text-sm">
          <option>All Plans</option>
          <option>Pro</option>
          <option>Agency</option>
          <option>Enterprise</option>
        </select>
        <select className="px-4 py-2 rounded-xl border border-border bg-card outline-none text-sm">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      <AdminTablePlaceholder
        columns={[
          "Order ID",
          "User",
          "Plan",
          "Amount",
          "Status",
          "Payment Method",
          "Date",
          "Actions",
        ]}
        rows={8}
      />
    </div>
  );
}
