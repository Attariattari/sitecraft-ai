"use client";

import { useEffect, useState } from "react";
import { Plus, TicketPercent } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 20,
    appliesToPlans: ["basic", "pro"],
    perUserLimit: 1,
    maxRedemptions: 0,
    bonusMonths: 0,
    description: "",
  });
  const [message, setMessage] = useState("");

  async function loadCoupons() {
    const response = await fetch("/api/admin/coupons");
    const data = await response.json();
    if (data.success) setCoupons(data.coupons || []);
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function createCoupon(event) {
    event.preventDefault();
    setMessage("Saving coupon...");
    const response = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setMessage(data.message || (data.success ? "Coupon saved." : "Coupon could not be saved."));
    if (data.success) {
      setForm((prev) => ({ ...prev, code: "", description: "" }));
      loadCoupons();
    }
  }

  async function disableCoupon(id) {
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    loadCoupons();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Coupons"
        description="Create and manage checkout coupons, bonus months, usage limits, and active status."
        route="/admin/coupons"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AdminStatCard icon={TicketPercent} label="Coupons" value={coupons.length} sub="Total records" />
        <AdminStatCard icon={TicketPercent} label="Active" value={coupons.filter((coupon) => coupon.isActive).length} sub="Can be applied" iconClass="bg-emerald-500" />
        <AdminStatCard icon={TicketPercent} label="Disabled" value={coupons.filter((coupon) => !coupon.isActive).length} sub="Archived" iconClass="bg-slate-500" />
        <AdminStatCard icon={TicketPercent} label="Used" value={coupons.reduce((sum, coupon) => sum + (coupon.usedCount || 0), 0)} sub="Redemptions" iconClass="bg-blue-500" />
      </div>

      <form onSubmit={createCoupon} className="rounded-xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 text-lg font-black text-foreground">
          <Plus className="size-5 text-primary" /> New coupon
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Input label="Code" value={form.code} onChange={(code) => setForm({ ...form, code: code.toUpperCase() })} />
          <Select label="Type" value={form.discountType} onChange={(discountType) => setForm({ ...form, discountType })} options={["percentage", "fixed", "bonus_months"]} />
          <Input label="Value" type="number" value={form.discountValue} onChange={(discountValue) => setForm({ ...form, discountValue })} />
          <Input label="Bonus months" type="number" value={form.bonusMonths} onChange={(bonusMonths) => setForm({ ...form, bonusMonths })} />
          <Input label="Per-user limit" type="number" value={form.perUserLimit} onChange={(perUserLimit) => setForm({ ...form, perUserLimit })} />
          <Input label="Max redemptions" type="number" value={form.maxRedemptions} onChange={(maxRedemptions) => setForm({ ...form, maxRedemptions })} />
        </div>
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Description"
          className="mt-4 min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground">Create coupon</button>
        {message ? <p className="mt-3 text-sm font-semibold text-muted-foreground">{message}</p> : null}
      </form>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {["Code", "Type", "Value", "Plans", "Used", "Status", "Actions"].map((head) => (
                <th key={head} className="p-4 text-left font-black text-foreground">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-b border-border last:border-b-0">
                <td className="p-4 font-black text-foreground">{coupon.code}</td>
                <td className="p-4 text-muted-foreground">{coupon.discountType}</td>
                <td className="p-4 text-muted-foreground">{coupon.discountValue}</td>
                <td className="p-4 text-muted-foreground">{coupon.appliesToPlans?.join(", ")}</td>
                <td className="p-4 text-muted-foreground">{coupon.usedCount || 0}</td>
                <td className="p-4 font-bold text-muted-foreground">{coupon.isActive ? "Active" : "Disabled"}</td>
                <td className="p-4">
                  <button onClick={() => disableCoupon(coupon._id)} className="rounded-lg border border-border px-3 py-1.5 font-bold hover:bg-muted">
                    Disable
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
