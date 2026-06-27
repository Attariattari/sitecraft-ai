"use client";

import { useState } from "react";

export default function GeneratedSiteContactForm({ siteSlug, services = [] }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", serviceInterest: "", message: "", website: "" });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch(`/api/sites/${siteSlug}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Message could not be sent.");
      setStatus("Message sent successfully.");
      setForm({ name: "", email: "", phone: "", subject: "", serviceInterest: "", message: "", website: "" });
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[var(--border)] bg-[var(--softBackground)] p-5 text-left">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
        <Input label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
        <Input label="Phone" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
        <Input label="Subject" value={form.subject} onChange={(subject) => setForm({ ...form, subject })} />
      </div>
      {!!services.length && (
        <label className="mt-4 block text-xs font-black uppercase text-[var(--mutedText)]">
          Service Interest
          <select value={form.serviceInterest} onChange={(event) => setForm({ ...form, serviceInterest: event.target.value })} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none">
            <option value="">Select a service</option>
            {services.map((service, index) => <option key={`${service.title || service.name}-${index}`} value={service.title || service.name}>{service.title || service.name}</option>)}
          </select>
        </label>
      )}
      <label className="mt-4 block text-xs font-black uppercase text-[var(--mutedText)]">
        Message
        <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required rows={5} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none" />
      </label>
      <input className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
      <button disabled={submitting} className="mt-5 rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-black text-white disabled:opacity-60">{submitting ? "Sending..." : "Send Message"}</button>
      {status ? <p className="mt-3 text-sm font-semibold text-[var(--mutedText)]">{status}</p> : null}
    </form>
  );
}

function Input({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="block text-xs font-black uppercase text-[var(--mutedText)]">
      {label}
      <input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none" />
    </label>
  );
}
