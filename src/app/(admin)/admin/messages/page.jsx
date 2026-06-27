"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Clock3,
  Eye,
  Inbox,
  Loader2,
  MailCheck,
  MessageSquare,
  RefreshCcw,
  Reply,
  Search,
  Send,
  ShieldAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { readJsonResponse } from "@/lib/http/readJsonResponse";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const statuses = ["all", "new", "read", "replied", "closed", "spam"];
const priorities = ["all", "low", "normal", "high"];
const readFilters = ["all", "unread", "read"];
const inquiryTypes = [
  "all",
  "General Question",
  "Pricing / Plan Question",
  "Website Generation Help",
  "Theme / Template Question",
  "Category Availability",
  "Technical Support",
  "Business Inquiry",
  "Feedback",
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [read, setRead] = useState("all");
  const [inquiryType, setInquiryType] = useState("all");
  const [replyMessage, setReplyMessage] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ search: debouncedSearch, status, priority, read, inquiryType, limit: "80" });
      const res = await fetch(`/api/admin/messages?${params}`, { cache: "no-store" });
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      setMessages(data.messages || []);
      setStats(data.stats || null);
    } catch (error) {
      toast.error(error.message || "Could not load messages");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, priority, read, inquiryType]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") loadMessages();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const unreadCount = useMemo(() => messages.filter((message) => !message.isRead).length, [messages]);

  const openMessage = async (message) => {
    setSelected(message);
    setReplyMessage(message.replyMessage || "");
    if (!message.isRead || message.status === "new") {
      await patchMessage(message, { isRead: true, status: message.status === "new" ? "read" : message.status }, { silent: true });
    }
  };

  const patchMessage = async (message, patch, { silent = false } = {}) => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      setMessages((current) => current.map((item) => (item.id === data.message.id ? data.message : item)));
      setSelected((current) => (current?.id === data.message.id ? data.message : current));
      if (!silent) toast.success("Message updated");
      return data.message;
    } catch (error) {
      toast.error(error.message || "Could not update message");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const reply = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/messages/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage }),
      });
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      setMessages((current) => current.map((item) => (item.id === data.message.id ? data.message : item)));
      setSelected(data.message);
      toast.success(data.notice || "Reply saved");
    } catch (error) {
      toast.error(error.message || "Could not send reply");
    } finally {
      setSaving(false);
    }
  };

  const moveToSpam = async (message) => {
    if (!window.confirm("Move this message to spam?")) return;
    await patchMessage(message, { status: "spam", priority: "low", isRead: true });
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Messages"
        description="View, filter, reply to, and manage public contact messages from SiteCraft AI users."
        route="/admin/messages"
        badge="Super Admin"
      >
        <button
          onClick={loadMessages}
          disabled={loading || saving}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold transition hover:bg-muted disabled:opacity-50"
        >
          <RefreshCcw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <AdminStatCard icon={Inbox} label="Total Messages" value={String(stats?.total ?? messages.length)} sub="All contact messages" />
        <AdminStatCard icon={MessageSquare} label="New Messages" value={String(stats?.new ?? 0)} sub={`${unreadCount} unread`} iconClass="bg-primary" />
        <AdminStatCard icon={MailCheck} label="Replied" value={String(stats?.replied ?? 0)} sub="Answered" iconClass="bg-emerald-500" />
        <AdminStatCard icon={CheckCircle2} label="Closed" value={String(stats?.closed ?? 0)} sub="Resolved" />
        <AdminStatCard icon={ShieldAlert} label="Spam" value={String(stats?.spam ?? 0)} sub="Filtered" iconClass="bg-orange-500" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-sm font-black text-foreground">Contact Inbox</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Polling refresh is enabled as the serverless realtime fallback.
                </p>
              </div>
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, subject, message..."
                  className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <FilterSelect value={status} onChange={setStatus} options={statuses} />
              <FilterSelect value={inquiryType} onChange={setInquiryType} options={inquiryTypes} />
              <FilterSelect value={priority} onChange={setPriority} options={priorities} />
              <FilterSelect value={read} onChange={setRead} options={readFilters} />
            </div>
          </div>

          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-4">
                  <div className="h-16 animate-pulse rounded-xl bg-muted" />
                </div>
              ))
            ) : messages.length ? (
              messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => openMessage(message)}
                  className={cn(
                    "flex w-full flex-col gap-3 p-4 text-left transition hover:bg-muted/30 lg:flex-row lg:items-center lg:justify-between",
                    selected?.id === message.id && "bg-primary/5",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!message.isRead ? <span className="size-2 rounded-full bg-primary" /> : null}
                      <p className="font-black text-foreground">{message.name}</p>
                      <span className="text-xs font-bold text-muted-foreground">{message.email}</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-bold text-foreground">{message.subject}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{message.message}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Badge>{message.inquiryType}</Badge>
                    <StatusBadge status={message.status} />
                    <Badge>{message.priority}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-12 text-center">
                <Inbox className="mx-auto mb-3 size-10 text-muted-foreground/30" />
                <p className="font-bold text-foreground">No messages found.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5">
          {selected ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-primary">{selected.inquiryType}</p>
                  <h2 className="mt-2 text-xl font-black text-foreground">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.name} · {selected.email}</p>
                  {selected.phone ? <p className="mt-1 text-xs text-muted-foreground">{selected.phone}</p> : null}
                </div>
                <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <X className="size-5" />
                </button>
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm font-semibold leading-7 text-foreground whitespace-pre-wrap">{selected.message}</p>
                <p className="mt-4 text-xs text-muted-foreground">Submitted {formatDate(selected.createdAt)} · IP {selected.ipAddress || "Not available"}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField label="Status" value={selected.status} options={statuses.filter((item) => item !== "all")} onChange={(value) => patchMessage(selected, { status: value })} />
                <SelectField label="Priority" value={selected.priority} options={priorities.filter((item) => item !== "all")} onChange={(value) => patchMessage(selected, { priority: value })} />
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-muted-foreground">Admin Notes</span>
                <textarea
                  rows={4}
                  value={selected.adminNotes || ""}
                  onChange={(event) => setSelected((current) => ({ ...current, adminNotes: event.target.value }))}
                  onBlur={() => patchMessage(selected, { adminNotes: selected.adminNotes || "" })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-muted-foreground">Reply by Email</span>
                <textarea
                  rows={5}
                  value={replyMessage}
                  onChange={(event) => setReplyMessage(event.target.value)}
                  placeholder="Write a reply..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={reply}
                  disabled={saving}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Reply
                </button>
                <button
                  onClick={() => patchMessage(selected, { status: "closed" })}
                  disabled={saving}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-black text-foreground hover:bg-muted disabled:opacity-60"
                >
                  <Archive className="size-4" />
                  Close
                </button>
                <button
                  onClick={() => patchMessage(selected, { isRead: true, status: selected.status === "new" ? "read" : selected.status })}
                  disabled={saving}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-black text-foreground hover:bg-muted disabled:opacity-60"
                >
                  <Eye className="size-4" />
                  Mark Read
                </button>
                <button
                  onClick={() => moveToSpam(selected)}
                  disabled={saving}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-black text-destructive hover:bg-destructive/10 disabled:opacity-60"
                >
                  <ShieldAlert className="size-4" />
                  Spam
                </button>
              </div>

              {selected.replyMessage ? (
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-primary">Last Reply</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground whitespace-pre-wrap">{selected.replyMessage}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-[460px] flex-col items-center justify-center text-center">
              <Reply className="mb-3 size-10 text-muted-foreground/40" />
              <p className="font-black text-foreground">Select a message</p>
              <p className="mt-1 text-sm text-muted-foreground">Open a message to mark it read, add notes, reply, or change status.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20"
    >
      {options.map((option) => (
        <option key={option} value={option}>{labelize(option)}</option>
      ))}
    </select>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>{labelize(option)}</option>
        ))}
      </select>
    </label>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-black text-muted-foreground">
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={cn(
      "rounded-full px-2.5 py-1 text-[10px] font-black uppercase",
      status === "new" && "bg-primary/10 text-primary",
      status === "replied" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      status === "closed" && "bg-muted text-muted-foreground",
      status === "spam" && "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      status === "read" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    )}>
      {status}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleString();
}

function labelize(value) {
  if (value === "all") return "All";
  return String(value || "").replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
