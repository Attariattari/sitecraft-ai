import { Receipt, DollarSign } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Payments"
        description="Track all payment transactions, gateway activity, and financial records."
        route="/admin/payments"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={DollarSign}
          label="Total Revenue"
          value="—"
          sub="All time"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={DollarSign}
          label="This Month"
          value="—"
          sub="Current period"
          iconClass="bg-blue-500"
        />
        <AdminStatCard
          icon={Receipt}
          label="Successful"
          value="—"
          sub="Completed"
        />
        <AdminStatCard
          icon={Receipt}
          label="Refunds"
          value="—"
          sub="Issued"
          iconClass="bg-red-500"
        />
      </div>
      <AdminTablePlaceholder
        columns={[
          "Payment ID",
          "User",
          "Amount",
          "Currency",
          "Gateway",
          "Status",
          "Date",
        ]}
        rows={8}
      />
    </div>
  );
}
