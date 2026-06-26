"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  Bot,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Edit3,
  Eye,
  FileQuestion,
  Filter,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { readJsonResponse } from "@/lib/http/readJsonResponse";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "General",
  "AI Website Generation",
  "Plans & Pricing",
  "Themes & Templates",
  "Categories & Industries",
  "Dashboard",
  "Security",
  "Coming Soon",
];

const statuses = ["published", "draft", "archived"];
const visibilities = ["public", "admin_only", "ai_only"];
const sourceTypes = [
  "faq",
  "pricing",
  "feature",
  "category",
  "theme",
  "template",
  "policy",
  "how_it_works",
  "roadmap",
  "general",
];
const reviewStatuses = ["verified", "needs_review", "outdated"];

const blankEntry = {
  title: "",
  slug: "",
  question: "",
  answer: "",
  category: "General",
  tags: [],
  status: "draft",
  visibility: "public",
  priority: 0,
  sourceType: "general",
  relatedPlans: [],
  relatedFeatures: [],
  relatedCategories: [],
  relatedTemplates: [],
  relatedThemes: [],
  isAIAccessible: false,
  isPublicFAQ: false,
  isFeatured: false,
  sortOrder: 0,
  reviewStatus: "needs_review",
  lastReviewedAt: "",
};

export default function AdminKnowledgeBasePage() {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("all");
  const [visibility, setVisibility] = useState("all");
  const [sourceType, setSourceType] = useState("all");
  const [aiOnly, setAiOnly] = useState("all");
  const [publicFaq, setPublicFaq] = useState("all");
  const [reviewStatus, setReviewStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [previewQuestion, setPreviewQuestion] = useState("Is Agency plan available?");
  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/knowledge-base", { cache: "no-store" });
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      setEntries(data.entries || []);
      setStats(data.stats || null);
    } catch (error) {
      toast.error(error.message || "Could not load knowledge base");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesSearch =
        !term ||
        [
          entry.title,
          entry.question,
          entry.answer,
          entry.category,
          entry.sourceType,
          ...(entry.tags || []),
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      return (
        matchesSearch &&
        (category === "All" || entry.category === category) &&
        (status === "all" || entry.status === status) &&
        (visibility === "all" || entry.visibility === visibility) &&
        (sourceType === "all" || entry.sourceType === sourceType) &&
        (aiOnly === "all" || entry.isAIAccessible === (aiOnly === "yes")) &&
        (publicFaq === "all" || entry.isPublicFAQ === (publicFaq === "yes")) &&
        (reviewStatus === "all" || entry.reviewStatus === reviewStatus)
      );
    });
  }, [entries, search, category, status, visibility, sourceType, aiOnly, publicFaq, reviewStatus]);

  const saveEntry = async (entry) => {
    try {
      setSaving(true);
      const isEdit = Boolean(entry.id);
      const res = await fetch(
        isEdit ? `/api/admin/knowledge-base/${entry.id}` : "/api/admin/knowledge-base",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        },
      );
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      setEntries((current) =>
        isEdit
          ? current.map((item) => (item.id === data.entry.id ? data.entry : item))
          : [data.entry, ...current],
      );
      setEditing(null);
      toast.success("Knowledge entry saved");
      loadEntries();
    } catch (error) {
      toast.error(error.message || "Could not save entry");
    } finally {
      setSaving(false);
    }
  };

  const patchEntry = async (entry, patch) => {
    await saveEntry({ ...entry, ...patch });
  };

  const deleteEntry = async (entry) => {
    if (!window.confirm(`Delete ${entry.title}?`)) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/knowledge-base/${entry.id}`, { method: "DELETE" });
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      setEntries((current) => current.filter((item) => item.id !== entry.id));
      toast.success("Knowledge entry deleted");
      loadEntries();
    } catch (error) {
      toast.error(error.message || "Could not delete entry");
    } finally {
      setSaving(false);
    }
  };

  const seedDefaults = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/knowledge-base/seed", { method: "POST" });
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      toast.success(data.message || "Seed entries synced");
      loadEntries();
    } catch (error) {
      toast.error(error.message || "Could not seed defaults");
    } finally {
      setSaving(false);
    }
  };

  const runPreview = async (overrideQuestion) => {
    try {
      setPreviewing(true);
      setPreview(null);
      const question = overrideQuestion || previewQuestion;
      setPreviewQuestion(question);
      const res = await fetch("/api/admin/knowledge-base/preview-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      setPreview(data.preview);
    } catch (error) {
      toast.error(error.message || "Could not preview answer");
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Knowledge Base"
        description="Control public FAQ content, AI answer sources, visibility, review status, and trust-safe assistant previews."
        route="/admin/knowledge-base"
        badge="Super Admin"
      >
        <button
          onClick={loadEntries}
          disabled={loading || saving}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold transition hover:bg-muted disabled:opacity-50"
        >
          <RefreshCcw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </button>
        <button
          onClick={seedDefaults}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/15 disabled:opacity-50"
        >
          <ShieldCheck className="size-4" />
          Seed Defaults
        </button>
        <button
          onClick={() => setEditing(blankEntry)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add Entry
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        <AdminStatCard icon={FileQuestion} label="Total Entries" value={String(stats?.total ?? entries.length)} sub="All records" />
        <AdminStatCard icon={CheckCircle2} label="Published" value={String(stats?.published ?? 0)} sub="Public-ready" iconClass="bg-primary" />
        <AdminStatCard icon={Clock3} label="Draft" value={String(stats?.draft ?? 0)} sub="In progress" iconClass="bg-yellow-500" />
        <AdminStatCard icon={Bot} label="AI Accessible" value={String(stats?.aiAccessible ?? 0)} sub="Allowed context" />
        <AdminStatCard icon={Eye} label="Public FAQ" value={String(stats?.publicFAQ ?? 0)} sub="Accordion" />
        <AdminStatCard icon={CircleAlert} label="Needs Review" value={String(stats?.needsReview ?? 0)} sub="Review queue" iconClass="bg-orange-500" />
        <AdminStatCard icon={Archive} label="Outdated" value={String(stats?.outdated ?? 0)} sub="Hidden from AI" iconClass="bg-muted" />
        <AdminStatCard icon={RefreshCcw} label="Last Updated" value={formatDate(stats?.lastUpdated, true)} sub="Latest change" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-sm font-black text-foreground">Knowledge Entries</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Only published, verified, AI-accessible entries are used in public assistant context.
                </p>
              </div>
              <div className="relative w-full xl:w-96">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search question, title, tags..."
                  className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "shrink-0 rounded-xl border px-3 py-2 text-xs font-black transition",
                    category === item
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              <SelectFilter icon={Filter} value={status} onChange={setStatus} options={["all", ...statuses]} />
              <SelectFilter value={visibility} onChange={setVisibility} options={["all", ...visibilities]} />
              <SelectFilter value={sourceType} onChange={setSourceType} options={["all", ...sourceTypes]} />
              <SelectFilter value={aiOnly} onChange={setAiOnly} options={["all", "yes", "no"]} labels={{ yes: "AI yes", no: "AI no" }} />
              <SelectFilter value={publicFaq} onChange={setPublicFaq} options={["all", "yes", "no"]} labels={{ yes: "FAQ yes", no: "FAQ no" }} />
              <SelectFilter value={reviewStatus} onChange={setReviewStatus} options={["all", ...reviewStatuses]} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1260px] text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-black uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-4 text-left">Title / Question</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Source Type</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Visibility</th>
                  <th className="p-4 text-center">AI</th>
                  <th className="p-4 text-center">FAQ</th>
                  <th className="p-4 text-left">Review</th>
                  <th className="p-4 text-left">Last Reviewed</th>
                  <th className="p-4 text-left">Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={11} className="p-4">
                        <div className="h-14 animate-pulse rounded-xl bg-muted" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length ? (
                  filtered.map((entry) => (
                    <EntryRow
                      key={entry.id}
                      entry={entry}
                      onEdit={() => setEditing(entry)}
                      onPreview={() => {
                        runPreview(entry.question || entry.title);
                      }}
                      onPatch={patchEntry}
                      onDelete={deleteEntry}
                      disabled={saving}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="p-12 text-center">
                      <FileQuestion className="mx-auto mb-3 size-10 text-muted-foreground/30" />
                      <p className="font-bold text-foreground">No knowledge entries found.</p>
                      <p className="mt-1 text-xs text-muted-foreground">Seed defaults or adjust filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Sparkles className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-black text-foreground">AI Preview Panel</h2>
                <p className="text-xs text-muted-foreground">Test the public answer before users see it.</p>
              </div>
            </div>
            <textarea
              value={previewQuestion}
              onChange={(event) => setPreviewQuestion(event.target.value)}
              rows={4}
              className="mt-5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={runPreview}
              disabled={previewing}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {previewing ? <Loader2 className="size-4 animate-spin" /> : <Bot className="size-4" />}
              Preview Public Answer
            </button>
            {preview ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-primary">Final AI Answer</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{preview.answer}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-primary">Safety Result</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{preview.safety}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-primary">Context Entries Used</p>
                  <div className="mt-3 space-y-2">
                    {(preview.contextEntries || []).slice(0, 5).map((entry) => (
                      <div key={entry.id} className="rounded-lg border border-border bg-card p-3">
                        <p className="text-xs font-black text-foreground">{entry.title}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{entry.category} · {entry.sourceType}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-primary">Data Sources</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Plans: {(preview.sourceSummary?.plans || []).join(", ") || "None"}.
                    {" "}Categories: {(preview.sourceSummary?.availableCategories || []).join(", ") || "None"}.
                    {" "}Templates: {preview.sourceSummary?.activeTemplateCount ?? 0}.
                    {" "}Themes: {preview.sourceSummary?.activeThemeCount ?? 0}.
                  </p>
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-black text-foreground">Realtime Update Indicator</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Knowledge changes emit <span className="font-black text-foreground">knowledge-base:updated</span>,
              clear cached answers, and public FAQ refreshes on focus or next page load in serverless mode.
            </p>
          </section>
        </aside>
      </div>

      {editing ? (
        <EntryModal entry={editing} onClose={() => setEditing(null)} onSave={saveEntry} saving={saving} />
      ) : null}
    </div>
  );
}

function EntryRow({ entry, onEdit, onPreview, onPatch, onDelete, disabled }) {
  return (
    <tr className="align-top transition hover:bg-muted/20">
      <td className="p-4">
        <p className="font-black text-foreground">{entry.title}</p>
        <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{entry.question || "No question"}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {(entry.tags || []).slice(0, 4).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </td>
      <td className="p-4 text-xs font-bold text-muted-foreground">{entry.category}</td>
      <td className="p-4 text-xs font-bold text-muted-foreground">{labelize(entry.sourceType)}</td>
      <td className="p-4">
        <select
          value={entry.status}
          disabled={disabled}
          onChange={(event) => onPatch(entry, { status: event.target.value })}
          className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>{labelize(item)}</option>
          ))}
        </select>
      </td>
      <td className="p-4 text-xs font-bold text-muted-foreground">{labelize(entry.visibility)}</td>
      <td className="p-4 text-center"><BooleanPill active={entry.isAIAccessible} /></td>
      <td className="p-4 text-center"><BooleanPill active={entry.isPublicFAQ} /></td>
      <td className="p-4">
        <select
          value={entry.reviewStatus}
          disabled={disabled}
          onChange={(event) => onPatch(entry, { reviewStatus: event.target.value })}
          className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20"
        >
          {reviewStatuses.map((item) => (
            <option key={item} value={item}>{labelize(item)}</option>
          ))}
        </select>
      </td>
      <td className="p-4 text-xs text-muted-foreground">{formatDate(entry.lastReviewedAt)}</td>
      <td className="p-4 text-xs text-muted-foreground">{formatDate(entry.updatedAt)}</td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <button onClick={onPreview} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-primary">
            <Eye className="size-4" />
          </button>
          <button onClick={() => onPatch(entry, { status: "published", reviewStatus: "verified", isAIAccessible: true })} disabled={disabled} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-primary disabled:opacity-50">
            <CheckCircle2 className="size-4" />
          </button>
          <button onClick={() => onPatch(entry, { status: "archived", isAIAccessible: false, isPublicFAQ: false })} disabled={disabled} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50">
            <Archive className="size-4" />
          </button>
          <button onClick={onEdit} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <Edit3 className="size-4" />
          </button>
          <button onClick={() => onDelete(entry)} disabled={disabled} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50">
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EntryModal({ entry, onClose, onSave, saving }) {
  const [draft, setDraft] = useState(() => ({
    ...blankEntry,
    ...entry,
    tagsText: (entry.tags || []).join(", "),
    relatedPlansText: (entry.relatedPlans || []).join(", "),
    relatedFeaturesText: (entry.relatedFeatures || []).join(", "),
    relatedCategoriesText: (entry.relatedCategories || []).join(", "),
    relatedTemplatesText: (entry.relatedTemplates || []).join(", "),
    relatedThemesText: (entry.relatedThemes || []).join(", "),
    lastReviewedAt: entry.lastReviewedAt ? String(entry.lastReviewedAt).slice(0, 10) : "",
  }));

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    onSave({
      ...draft,
      tags: draft.tagsText,
      relatedPlans: draft.relatedPlansText,
      relatedFeatures: draft.relatedFeaturesText,
      relatedCategories: draft.relatedCategoriesText,
      relatedTemplates: draft.relatedTemplatesText,
      relatedThemes: draft.relatedThemesText,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="my-8 w-full max-w-6xl rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-black text-foreground">{draft.id ? "Edit Knowledge Entry" : "Add Knowledge Entry"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">Control FAQ visibility, AI access, source type, review state, and relationships.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" value={draft.title} onChange={(value) => update("title", value)} required />
              <Field label="Slug" value={draft.slug} onChange={(value) => update("slug", value)} />
              <Field label="Question" value={draft.question} onChange={(value) => update("question", value)} />
              <SelectField label="Category" value={draft.category} onChange={(value) => update("category", value)} options={categories.filter((item) => item !== "All")} />
              <SelectField label="Status" value={draft.status} onChange={(value) => update("status", value)} options={statuses} />
              <SelectField label="Visibility" value={draft.visibility} onChange={(value) => update("visibility", value)} options={visibilities} />
              <SelectField label="Source type" value={draft.sourceType} onChange={(value) => update("sourceType", value)} options={sourceTypes} />
              <SelectField label="Review status" value={draft.reviewStatus} onChange={(value) => update("reviewStatus", value)} options={reviewStatuses} />
              <Field label="Priority" type="number" value={draft.priority} onChange={(value) => update("priority", Number(value))} />
              <Field label="Sort order" type="number" value={draft.sortOrder} onChange={(value) => update("sortOrder", Number(value))} />
              <Field label="Last reviewed" type="date" value={draft.lastReviewedAt} onChange={(value) => update("lastReviewedAt", value)} />
              <Field label="Tags" value={draft.tagsText} onChange={(value) => update("tagsText", value)} />
            </div>
            <TextArea label="Answer" value={draft.answer} onChange={(value) => update("answer", value)} rows={8} required />
          </div>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
              <Toggle label="AI accessible" checked={draft.isAIAccessible} onChange={(value) => update("isAIAccessible", value)} />
              <Toggle label="Public FAQ" checked={draft.isPublicFAQ} onChange={(value) => update("isPublicFAQ", value)} />
              <Toggle label="Featured" checked={draft.isFeatured} onChange={(value) => update("isFeatured", value)} />
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="text-sm font-black text-foreground">Related Records</h3>
              <div className="mt-4 space-y-3">
                <Field label="Related plans" value={draft.relatedPlansText} onChange={(value) => update("relatedPlansText", value)} />
                <Field label="Related features" value={draft.relatedFeaturesText} onChange={(value) => update("relatedFeaturesText", value)} />
                <Field label="Related categories" value={draft.relatedCategoriesText} onChange={(value) => update("relatedCategoriesText", value)} />
                <Field label="Related templates" value={draft.relatedTemplatesText} onChange={(value) => update("relatedTemplatesText", value)} />
                <Field label="Related themes" value={draft.relatedThemesText} onChange={(value) => update("relatedThemesText", value)} />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-black uppercase tracking-wide text-primary">Public Preview</p>
              <h3 className="mt-2 text-lg font-black text-foreground">{draft.question || draft.title || "Question"}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{draft.answer || "Answer appears here."}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border p-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-muted">
            Cancel
          </button>
          <button disabled={saving} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {saving ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SelectFilter({ icon: Icon, value, onChange, options, labels = {} }) {
  return (
    <label className="relative block">
      {Icon ? <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /> : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-10 w-full rounded-xl border border-border bg-background px-3 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20",
          Icon && "pl-9",
        )}
      >
        {options.map((item) => (
          <option key={item} value={item}>{labels[item] || labelize(item)}</option>
        ))}
      </select>
    </label>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        required={required}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3, required = false }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      <textarea
        required={required}
        value={value ?? ""}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((item) => (
          <option key={item} value={item}>{labelize(item)}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2">
      <span className="text-xs font-black uppercase text-foreground">{label}</span>
      <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-black text-primary">
      {children}
    </span>
  );
}

function BooleanPill({ active }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase",
        active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
      )}
    >
      {active ? "Yes" : "No"}
    </span>
  );
}

function formatDate(value, compact = false) {
  if (!value) return compact ? "None" : "Not set";
  return new Date(value).toLocaleDateString(undefined, compact ? { month: "short", day: "numeric" } : undefined);
}

function labelize(value) {
  if (value === "all") return "All";
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
