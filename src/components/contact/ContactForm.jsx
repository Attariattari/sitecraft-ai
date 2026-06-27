"use client";

import { useState } from "react";
import { Loader2, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { readJsonResponse } from "@/lib/http/readJsonResponse";

const inquiryTypes = [
  "General Question",
  "Pricing / Plan Question",
  "Website Generation Help",
  "Theme / Template Question",
  "Category Availability",
  "Technical Support",
  "Business Inquiry",
  "Feedback",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  inquiryType: "General Question",
  message: "",
  companyWebsite: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || form.message.trim().length < 10) {
      const message = "Please complete name, email, subject, and a message of at least 10 characters.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setSending(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      const message = "Your message has been sent successfully. Our team will review it and respond as soon as possible.";
      setSuccess(message);
      toast.success(message);
      setForm(initialForm);
    } catch (err) {
      const message = err.message || "Could not send your message.";
      setError(message);
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form id="contact-form" onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-sm font-semibold leading-6 text-foreground">
          Please do not send passwords, payment details, or private sensitive information through this form.
        </p>
      </div>

      <input
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        value={form.companyWebsite}
        onChange={(event) => update("companyWebsite", event.target.value)}
        className="hidden"
        name="companyWebsite"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" value={form.name} onChange={(value) => update("name", value)} placeholder="Your name" required />
        <Field label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} placeholder="you@example.com" required />
        <Field label="Phone optional" value={form.phone} onChange={(value) => update("phone", value)} placeholder="Optional" />
        <label className="block">
          <span className="mb-2 block text-sm font-black text-foreground">Inquiry type</span>
          <select
            value={form.inquiryType}
            onChange={(event) => update("inquiryType", event.target.value)}
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      <Field label="Subject" value={form.subject} onChange={(value) => update("subject", value)} placeholder="How can we help?" required className="mt-5" />

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-black text-foreground">Message</span>
        <textarea
          required
          minLength={10}
          maxLength={2500}
          rows="7"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="Tell us what you need..."
        />
        <span className="mt-2 block text-xs font-semibold text-muted-foreground">{form.message.length}/2500 characters</span>
      </label>

      {success ? <p className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm font-bold text-primary">{success}</p> : null}
      {error ? <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive">{error}</p> : null}

      <button
        disabled={sending}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90 disabled:opacity-60"
      >
        {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required = false, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-black text-foreground">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        placeholder={placeholder}
      />
    </label>
  );
}
