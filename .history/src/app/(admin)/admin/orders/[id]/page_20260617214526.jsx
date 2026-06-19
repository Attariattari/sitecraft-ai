import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminOrderDetailPage({ params }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <AdminPageHeader
          title="Order Details"
          description={`Order ID: ${params.id}`}
          route={`/admin/orders/${params.id}`}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-black text-foreground border-b border-border pb-3">
            Order Information
          </h2>
          {[
            ["Order ID", "—"],
            ["User", "—"],
            ["Plan", "—"],
            ["Amount", "—"],
            ["Status", "—"],
            ["Payment Method", "—"],
            ["Transaction ID", "—"],
            ["Created At", "—"],
          ].map(([label, val]) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-bold text-foreground">{val}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-black text-foreground mb-3">Actions</h2>
          {[
            "Send Invoice",
            "Issue Refund",
            "Extend Plan",
            "View User Profile",
          ].map((a) => (
            <button
              key={a}
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-all text-left"
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
