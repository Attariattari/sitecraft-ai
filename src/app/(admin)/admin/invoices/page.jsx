"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    async function loadInvoices() {
      const response = await fetch("/api/admin/invoices");
      const data = await response.json();
      if (data.success) setInvoices(data.invoices || []);
    }
    loadInvoices();
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Invoices"
        description="Review generated invoice records for verified payments."
        route="/admin/invoices"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AdminStatCard icon={FileText} label="Total Invoices" value={invoices.length} sub="All records" />
        <AdminStatCard icon={FileText} label="Paid" value={invoices.filter((invoice) => invoice.status === "paid").length} sub="Settled" iconClass="bg-emerald-500" />
        <AdminStatCard icon={FileText} label="Pending" value={invoices.filter((invoice) => invoice.status === "pending").length} sub="Outstanding" iconClass="bg-yellow-500" />
        <AdminStatCard icon={FileText} label="Refunded" value={invoices.filter((invoice) => invoice.status === "refunded").length} sub="Returned" iconClass="bg-red-500" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {["Invoice #", "User", "Amount", "Discount", "Final", "Status", "Issued"].map((head) => (
                <th key={head} className="p-4 text-left font-black text-foreground">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="border-b border-border last:border-b-0">
                <td className="p-4 font-black text-foreground">{invoice.invoiceNumber}</td>
                <td className="p-4">
                  <p className="font-bold text-foreground">{invoice.userId?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{invoice.userId?.email || invoice.userId}</p>
                </td>
                <td className="p-4 text-muted-foreground">{invoice.currency} {invoice.amount}</td>
                <td className="p-4 text-muted-foreground">{invoice.discountAmount}</td>
                <td className="p-4 font-bold text-muted-foreground">{invoice.finalAmount}</td>
                <td className="p-4 font-bold text-muted-foreground">{invoice.status}</td>
                <td className="p-4 text-muted-foreground">{invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
