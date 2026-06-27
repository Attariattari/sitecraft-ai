"use client";

import { useEffect, useState } from "react";
import { Gift, Mail, RefreshCcw, ShieldCheck, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function AdminMembershipInvitesPage() {
  const [invites, setInvites] = useState([]);
  const [stats, setStats] = useState({});
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [form, setForm] = useState({
    targetEmail: "",
    planSlug: "pro",
    durationType: "months",
    durationValue: 3,
    tokenExpiresAt: "",
    adminMessage: "",
    source: "admin_gift",
    sendEmailNow: true,
  });

  async function loadInvites() {
    const response = await fetch("/api/admin/membership-invites");
    const data = await response.json();
    if (data.success) {
      setInvites(data.invites || []);
      setStats(data.stats || {});
    }
  }

  useEffect(() => {
    loadInvites();
    const timer = setInterval(loadInvites, 30_000);
    return () => clearInterval(timer);
  }, []);

  async function createInvite(event) {
    event.preventDefault();
    setMessage("Creating invite...");
    setPreviewUrl("");
    const response = await fetch("/api/admin/membership-invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setMessage(data.message || (data.success ? "Invite created." : "Invite could not be created."));
    if (data.success) {
      setPreviewUrl(data.redeemUrl || "");
      setForm((prev) => ({ ...prev, targetEmail: "", adminMessage: "" }));
      loadInvites();
    }
  }

  async function resend(id) {
    const response = await fetch(`/api/admin/membership-invites/${id}/resend`, { method: "POST" });
    const data = await response.json();
    setMessage(data.message || (data.success ? "Invite resent." : "Invite could not be resent."));
    setPreviewUrl(data.redeemUrl || "");
    loadInvites();
  }

  async function revoke(id) {
    const reason = window.prompt("Reason for revoking this invite?", "Revoked by Super Admin");
    if (!reason) return;
    const response = await fetch(`/api/admin/membership-invites/${id}/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const data = await response.json();
    setMessage(data.message || (data.success ? "Invite revoked." : "Invite could not be revoked."));
    loadInvites();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Membership Invites"
        description="Send secure, single-use Basic or Pro membership gift links to specific users."
        route="/admin/membership-invites"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        <AdminStatCard icon={Gift} label="Total" value={stats.total || 0} sub="Invites" />
        <AdminStatCard icon={Mail} label="Sent" value={stats.sent || 0} sub="Email sent" iconClass="bg-blue-500" />
        <AdminStatCard icon={ShieldCheck} label="Redeemed" value={stats.redeemed || 0} sub="Activated" iconClass="bg-emerald-500" />
        <AdminStatCard icon={RefreshCcw} label="Draft" value={stats.draft || 0} sub="Not sent" iconClass="bg-slate-500" />
        <AdminStatCard icon={XCircle} label="Revoked" value={stats.revoked || 0} sub="Stopped" iconClass="bg-red-500" />
        <AdminStatCard icon={XCircle} label="Failed" value={stats.failed || 0} sub="Email issues" iconClass="bg-yellow-500" />
      </div>

      <form onSubmit={createInvite} className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-black text-foreground">Create Invite</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Input label="Target email" value={form.targetEmail} onChange={(targetEmail) => setForm({ ...form, targetEmail })} />
          <Select label="Plan" value={form.planSlug} onChange={(planSlug) => setForm({ ...form, planSlug })} options={["basic", "pro"]} />
          <Select label="Duration type" value={form.durationType} onChange={(durationType) => setForm({ ...form, durationType })} options={["months", "days"]} />
          <Input label="Duration value" type="number" value={form.durationValue} onChange={(durationValue) => setForm({ ...form, durationValue })} />
          <Input label="Expiry date" type="date" value={form.tokenExpiresAt} onChange={(tokenExpiresAt) => setForm({ ...form, tokenExpiresAt })} />
          <Select label="Source" value={form.source} onChange={(source) => setForm({ ...form, source })} options={["admin_gift", "promotion", "manual_bonus", "support_compensation"]} />
        </div>
        <textarea
          value={form.adminMessage}
          onChange={(event) => setForm({ ...form, adminMessage: event.target.value })}
          placeholder="Optional admin message"
          className="mt-4 min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <label className="mt-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <input
            type="checkbox"
            checked={form.sendEmailNow}
            onChange={(event) => setForm({ ...form, sendEmailNow: event.target.checked })}
          />
          Send email now
        </label>
        <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground">Create invite</button>
        {message ? <p className="mt-3 text-sm font-semibold text-muted-foreground">{message}</p> : null}
        {previewUrl ? (
          <div className="mt-3 rounded-lg border border-primary/20 bg-primary/10 p-3 text-xs font-semibold text-muted-foreground">
            Secure preview link created for admin use: <span className="break-all text-foreground">{previewUrl}</span>
          </div>
        ) : null}
      </form>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {["Target", "Plan", "Duration", "Status", "Email", "Expires", "Redeemed", "Source", "Actions"].map((head) => (
                <th key={head} className="p-4 text-left font-black text-foreground">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.id} className="border-b border-border last:border-b-0">
                <td className="p-4">
                  <p className="font-black text-foreground">{invite.targetUserId?.name || invite.targetEmail}</p>
                  <p className="text-xs text-muted-foreground">{invite.targetEmail}</p>
                </td>
                <td className="p-4 font-bold text-muted-foreground">{invite.planSlug}</td>
                <td className="p-4 text-muted-foreground">{invite.durationLabel}</td>
                <td className="p-4"><Status status={invite.status} /></td>
                <td className="p-4 text-muted-foreground">{invite.emailStatus}</td>
                <td className="p-4 text-muted-foreground">{invite.tokenExpiresAt ? new Date(invite.tokenExpiresAt).toLocaleDateString() : "-"}</td>
                <td className="p-4 text-muted-foreground">{invite.redeemedAt ? new Date(invite.redeemedAt).toLocaleDateString() : "-"}</td>
                <td className="p-4 text-muted-foreground">{invite.source}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => resend(invite.id)} className="rounded-lg border border-border px-3 py-1.5 font-bold hover:bg-muted">Resend</button>
                    <button onClick={() => revoke(invite.id)} className="rounded-lg border border-border px-3 py-1.5 font-bold hover:bg-muted">Revoke</button>
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

function Status({ status }) {
  return <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-black uppercase text-primary">{status}</span>;
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
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
