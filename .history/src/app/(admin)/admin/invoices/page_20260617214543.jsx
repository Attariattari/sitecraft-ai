import { FileText, Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";

export default function AdminInvoicesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Invoices"
        description="Manage all platform invoices, download history, and billing records."
        route="/admin/invoices"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-bold hover:bg-muted transition-all">
          <Download className="w-4 h-4" />
          Export All
        </button>
      </AdminPageHeader>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={FileText}
          label="Total Invoices"
          value="—"
          sub="All time"
        />
        <AdminStatCard
          icon={FileText}
          label="Paid"
          value="—"
          sub="Settled"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={FileText}
          label="Pending"
          value="—"
          sub="Outstanding"
          iconClass="bg-yellow-500"
        />
        <AdminStatCard
          icon={FileText}
          label="Overdue"
          value="—"
          sub="Past due"
          iconClass="bg-red-500"
        />
      </div>
      <AdminTablePlaceholder
        columns={[
          "Invoice #",
          "User",
          "Plan",
          "Amount",
          "Status",
          "Due Date",
          "Actions",
        ]}
        rows={8}
      />
    </div>
  );
}
