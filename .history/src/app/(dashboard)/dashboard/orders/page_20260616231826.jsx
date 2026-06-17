"use client";

import { ShoppingBag } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";

export default function DashboardOrdersPage() {
  const orders = []; // Replace with actual orders data if available

  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Order History"
        description="View your past purchases, subscriptions, and invoices."
      />

      <DashboardCard className="p-0 overflow-hidden">
        {orders.length === 0 ? (
          <DashboardEmptyState
            icon={ShoppingBag}
            title="No orders yet"
            description="When you purchase a plan or credits, your invoices will appear here."
            actionLabel="View Plans"
            actionHref="/dashboard/billing"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    {/* Render order details here when data is available */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </DashboardShell>
  );
}
