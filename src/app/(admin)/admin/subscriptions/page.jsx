"use client";

import { useEffect, useState } from "react";
import { Gift, RefreshCcw, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [gift, setGift] = useState({ userId: "", planSlug: "pro", months: 1, reason: "" });
  const [message, setMessage] = useState("");

  async function loadSubscriptions() {
    const response = await fetch("/api/admin/subscriptions");
    const data = await response.json();
    if (data.success) setSubscriptions(data.subscriptions || []);
  }

  useEffect(() => {
    loadSubscriptions();
    const timer = setInterval(loadSubscriptions, 30_000);
    return () => clearInterval(timer);
  }, []);

  async function giftPlan(event) {
    event.preventDefault();
    setMessage("Creating grant...");
    const response = await fetch("/api/admin/subscriptions/gift-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gift),
    });
    const data = await response.json();
    setMessage(data.message || (data.success ? "Plan granted." : "Plan could not be granted."));
    if (data.success) loadSubscriptions();
  }

  async function extend(id) {
    await fetch(`/api/admin/subscriptions/${id}/extend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ months: 1, reason: "Admin extension" }),
    });
    loadSubscriptions();
  }

  async function cancel(id) {
    await fetch(`/api/admin/subscriptions/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Cancelled by Super Admin" }),
    });
    loadSubscriptions();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Subscriptions"
        description="Gift, extend, cancel, and review SiteCraft AI memberships with audit-backed admin actions."
        route="/admin/subscriptions"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AdminStatCard icon={RefreshCcw} label="Subscriptions" value={subscriptions.length} sub="Loaded records" />
        <AdminStatCard icon={RefreshCcw} label="Active" value={subscriptions.filter((item) => ["active", "gifted"].includes(item.status)).length} sub="Current access" iconClass="bg-emerald-500" />
        <AdminStatCard icon={Gift} label="Admin granted" value={subscriptions.filter((item) => item.adminGranted).length} sub="Gifted access" iconClass="bg-blue-500" />
        <AdminStatCard icon={XCircle} label="Cancelled" value={subscriptions.filter((item) => item.status === "cancelled").length} sub="Ended" iconClass="bg-red-500" />
      </div>

      <form onSubmit={giftPlan} className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-black text-foreground">Gift plan access</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <Input label="User ID" value={gift.userId} onChange={(userId) => setGift({ ...gift, userId })} />
          <Select label="Plan" value={gift.planSlug} onChange={(planSlug) => setGift({ ...gift, planSlug })} options={["basic", "pro"]} />
          <Input label="Months" type="number" value={gift.months} onChange={(months) => setGift({ ...gift, months })} />
          <Input label="Reason" value={gift.reason} onChange={(reason) => setGift({ ...gift, reason })} />
        </div>
        <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground">Grant plan</button>
        {message ? <p className="mt-3 text-sm font-semibold text-muted-foreground">{message}</p> : null}
      </form>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {["User", "Plan", "Status", "Expiry", "Source", "Admin grant", "Reason", "Actions"].map((head) => (
                <th key={head} className="p-4 text-left font-black text-foreground">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription._id} className="border-b border-border last:border-b-0">
                <td className="p-4">
                  <p className="font-black text-foreground">{subscription.userId?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{subscription.userId?.email || subscription.userId}</p>
                </td>
                <td className="p-4 font-bold text-muted-foreground">{subscription.planSlug}</td>
                <td className="p-4 font-bold text-muted-foreground">{subscription.status}</td>
                <td className="p-4 text-muted-foreground">{subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : "-"}</td>
                <td className="p-4 text-muted-foreground">{subscription.grantSource || (subscription.adminGranted ? "admin_gift" : "paid")}</td>
                <td className="p-4 text-muted-foreground">{subscription.adminGranted ? "Yes" : "No"}</td>
                <td className="p-4 text-muted-foreground">{subscription.grantReason || "-"}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => extend(subscription._id)} className="rounded-lg border border-border px-3 py-1.5 font-bold hover:bg-muted">+1 month</button>
                    <button onClick={() => cancel(subscription._id)} className="rounded-lg border border-border px-3 py-1.5 font-bold hover:bg-muted">Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="text-xs font-black uppercase text-muted-foreground">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(type === "number" ? Number(event.target.value) : event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="text-xs font-black uppercase text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground outline-none focus:border-primary"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
