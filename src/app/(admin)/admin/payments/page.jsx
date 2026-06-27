"use client";

import { useEffect, useState } from "react";
import { Receipt, DollarSign } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);

  async function loadPayments() {
    const response = await fetch("/api/admin/payments");
    const data = await response.json();
    if (data.success) setPayments(data.payments || []);
  }

  useEffect(() => {
    loadPayments();
  }, []);

  async function verifyManual(id) {
    await fetch(`/api/admin/payments/${id}/verify`, { method: "POST" });
    loadPayments();
  }

  const paid = payments.filter((payment) => payment.status === "paid");
  const revenue = paid.reduce((sum, payment) => sum + Number(payment.finalAmount || 0), 0);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Payments"
        description="Track payment transactions, pending manual verification, gateway references, and paid status."
        route="/admin/payments"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AdminStatCard icon={DollarSign} label="Paid Revenue" value={revenue} sub="Verified only" iconClass="bg-emerald-500" />
        <AdminStatCard icon={Receipt} label="Payments" value={payments.length} sub="Total records" />
        <AdminStatCard icon={Receipt} label="Pending" value={payments.filter((payment) => payment.status === "pending").length} sub="Needs verification" iconClass="bg-yellow-500" />
        <AdminStatCard icon={Receipt} label="Paid" value={paid.length} sub="Activated" iconClass="bg-blue-500" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {["User", "Plan", "Amount", "Method", "Provider", "Status", "Reference", "Actions"].map((head) => (
                <th key={head} className="p-4 text-left font-black text-foreground">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b border-border last:border-b-0">
                <td className="p-4">
                  <p className="font-black text-foreground">{payment.userId?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{payment.userId?.email || payment.userId}</p>
                </td>
                <td className="p-4 font-bold text-muted-foreground">{payment.planSlug}</td>
                <td className="p-4 text-muted-foreground">{payment.currency} {payment.finalAmount}</td>
                <td className="p-4 text-muted-foreground">{payment.paymentMethod}</td>
                <td className="p-4 text-muted-foreground">{payment.paymentProvider}</td>
                <td className="p-4 font-bold text-muted-foreground">{payment.status}</td>
                <td className="p-4 text-xs text-muted-foreground">{payment.providerReference || "-"}</td>
                <td className="p-4">
                  {payment.paymentMethod === "manual" && payment.status === "pending" ? (
                    <button onClick={() => verifyManual(payment._id)} className="rounded-lg border border-border px-3 py-1.5 font-bold hover:bg-muted">
                      Verify
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
