"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Archive,
  Bot,
  CalendarClock,
  CheckCircle2,
  Edit3,
  Eye,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const emptyBlog = {
  title: "",
  slug: "",
  summary: "",
  excerpt: "",
  content: "",
  category: "AI Website Generation",
  tags: "",
  keywords: "",
  metaTitle: "",
  metaDescription: "",
  imageUrl: "",
  imageAlt: "",
  status: "draft",
  isFeatured: false,
};

const statuses = ["all", "draft", "pending", "published", "rejected", "archived"];
const sources = ["all", "manual", "ai_auto", "ai_manual"];

const initialAIProgress = {
  open: false,
  status: "idle",
  title: "AI Blog Generation",
  message: "",
  blog: null,
  steps: [],
};

function buildProgressSteps(activeIndex = 0, status = "running") {
  const labels = [
    "Sending topic to AI blog workflow",
    "Building SiteCraft AI platform context",
    "Generating or selecting safe blog content",
    "Verifying content rules and duplicate title",
    "Generating blog image and saving draft",
  ];

  return labels.map((label, index) => ({
    label,
    status:
      status === "error" && index === activeIndex
        ? "error"
        : status === "success" || index < activeIndex
          ? "success"
          : index === activeIndex
            ? "running"
            : "pending",
  }));
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "all", category: "all", source: "all" });
  const [editing, setEditing] = useState(null);
  const [aiTopic, setAiTopic] = useState("");
  const [aiProgress, setAiProgress] = useState(initialAIProgress);
  const debouncedFilters = useDebouncedValue(filters, 350);

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(debouncedFilters);
      const res = await fetch(`/api/admin/blogs?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setBlogs(data.blogs || []);
      setStats(data.stats || {});
      setCategories(data.categories || []);
    } catch (error) {
      toast.error(error.message || "Could not load blogs");
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  const loadAutomation = useCallback(async () => {
    try {
      const [settingsRes, logsRes] = await Promise.all([
        fetch("/api/admin/blog-automation/settings", { cache: "no-store" }),
        fetch("/api/admin/blog-automation/logs", { cache: "no-store" }),
      ]);
      const settingsData = await settingsRes.json();
      const logsData = await logsRes.json();
      if (settingsData.success) setSettings(settingsData.settings);
      if (logsData.success) setLogs(logsData.logs || []);
    } catch (error) {
      toast.error("Could not load automation settings");
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  useEffect(() => {
    loadAutomation();
  }, [loadAutomation]);

  const selectedBlog = useMemo(() => editing || emptyBlog, [editing]);

  const saveBlog = async () => {
    try {
      setSaving(true);
      const isEdit = Boolean(selectedBlog.id);
      const res = await fetch(isEdit ? `/api/admin/blogs/${selectedBlog.id}` : "/api/admin/blogs", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedBlog),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setEditing(null);
      toast.success("Blog saved");
      await loadBlogs();
    } catch (error) {
      toast.error(error.message || "Could not save blog");
    } finally {
      setSaving(false);
    }
  };

  const action = async (blog, endpoint, label, body = {}) => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/blogs/${blog.id}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success(label);
      await loadBlogs();
    } catch (error) {
      toast.error(error.message || "Action failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteBlog = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"?`)) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/blogs/${blog.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Blog deleted");
      await loadBlogs();
    } catch (error) {
      toast.error(error.message || "Could not delete blog");
    } finally {
      setSaving(false);
    }
  };

  const generateAI = async () => {
    try {
      setSaving(true);
      setAiProgress({
        open: true,
        status: "running",
        title: "AI Blog Generation",
        message: aiTopic
          ? `Creating blog for: ${aiTopic}`
          : "Choosing a SiteCraft AI-safe topic automatically.",
        blog: null,
        steps: buildProgressSteps(0, "running"),
      });
      setTimeout(() => {
        setAiProgress((current) =>
          current.status === "running"
            ? { ...current, steps: buildProgressSteps(1, "running"), message: "Collecting plans, categories, features, and truth rules." }
            : current,
        );
      }, 450);
      setTimeout(() => {
        setAiProgress((current) =>
          current.status === "running"
            ? { ...current, steps: buildProgressSteps(2, "running"), message: "Generating content or using a safe fallback if Gemini is unavailable." }
            : current,
        );
      }, 1100);
      setTimeout(() => {
        setAiProgress((current) =>
          current.status === "running"
            ? { ...current, steps: buildProgressSteps(3, "running"), message: "Checking duplicate title, unsafe claims, and SiteCraft AI rules." }
            : current,
        );
      }, 1800);
      const res = await fetch("/api/admin/blogs/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic }),
      });
      setAiProgress((current) =>
        current.status === "running"
          ? { ...current, steps: buildProgressSteps(4, "running"), message: "Saving generated blog and refreshing admin data." }
          : current,
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAiProgress({
        open: true,
        status: "success",
        title: data.quotaLimited ? "Fallback Blog Created" : "AI Blog Created",
        message:
          data.message ||
          (data.usedFallback
            ? "Safe fallback blog was created for review."
            : "New AI blog was created and is waiting for review."),
        blog: data.blog || null,
        steps: buildProgressSteps(5, "success"),
      });
      toast.success(data.message || "AI blog generated and waiting for review");
      setAiTopic("");
      await Promise.all([loadBlogs(), loadAutomation()]);
    } catch (error) {
      setAiProgress((current) => ({
        ...current,
        open: true,
        status: "error",
        title: "AI Blog Failed",
        message: error.message || "AI blog generation failed.",
        steps: buildProgressSteps(2, "error"),
      }));
      toast.error(error.message || "AI blog generation failed");
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async (patch) => {
    try {
      const next = { ...settings, ...patch };
      setSettings(next);
      const res = await fetch("/api/admin/blog-automation/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSettings(data.settings);
      toast.success("Automation settings saved");
    } catch (error) {
      toast.error(error.message || "Could not save settings");
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Blogs"
        description="Manage SiteCraft AI blog content, SEO metadata, AI generation, verification, and publishing workflow."
        route="/admin/blogs"
        badge="Super Admin"
      >
        <button onClick={loadBlogs} disabled={loading} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-muted disabled:opacity-50">
          <RefreshCcw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </button>
        <button onClick={() => setEditing(emptyBlog)} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" />
          Manual Blog
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        <AdminStatCard icon={Sparkles} label="Total Blogs" value={String(stats.total || 0)} sub="All entries" />
        <AdminStatCard icon={Edit3} label="Draft" value={String(stats.draft || 0)} sub="Manual work" />
        <AdminStatCard icon={CalendarClock} label="Pending" value={String(stats.pending || 0)} sub="Needs review" iconClass="bg-yellow-500" />
        <AdminStatCard icon={CheckCircle2} label="Published" value={String(stats.published || 0)} sub="Public" iconClass="bg-primary" />
        <AdminStatCard icon={Bot} label="AI Generated" value={String(stats.aiGenerated || 0)} sub="AI source" iconClass="bg-accent" />
        <AdminStatCard icon={X} label="Rejected" value={String(stats.rejected || 0)} sub="Failed/rejected" iconClass="bg-destructive" />
        <AdminStatCard icon={CalendarClock} label="Scheduled" value={String(stats.scheduled || 0)} sub="Future" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={filters.search}
                  onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                  placeholder="Search blogs..."
                  className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-bold">
                {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))} className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-bold">
                <option value="all">all categories</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value }))} className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-bold">
                {sources.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Published</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-border/70 align-top last:border-0">
                    <td className="max-w-sm p-4">
                      <p className="font-black text-foreground">{blog.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-muted-foreground">{blog.summary}</p>
                    </td>
                    <td className="p-4 text-sm font-bold">{blog.category}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-black uppercase text-primary">{blog.status}</span>
                    </td>
                    <td className="p-4 text-xs font-black uppercase text-muted-foreground">{blog.source}</td>
                    <td className="p-4 text-sm font-bold">{blog.isFeatured ? "Yes" : "No"}</td>
                    <td className="p-4 text-xs font-semibold text-muted-foreground">{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "-"}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {blog.status === "published" && (
                          <Link href={`/blog/${blog.slug}`} target="_blank" className="rounded-lg border border-border p-2 hover:bg-muted" title="View"><Eye className="size-4" /></Link>
                        )}
                        <button onClick={() => setEditing({ ...blog, tags: blog.tags?.join(", ") || "", keywords: blog.keywords?.join(", ") || "", imageUrl: blog.image?.url || "", imageAlt: blog.image?.alt || "" })} className="rounded-lg border border-border p-2 hover:bg-muted" title="Edit"><Edit3 className="size-4" /></button>
                        <button onClick={() => action(blog, "publish", "Blog published")} className="rounded-lg border border-border p-2 text-primary hover:bg-primary/10" title="Publish"><Send className="size-4" /></button>
                        <button onClick={() => action(blog, "reject", "Blog rejected")} className="rounded-lg border border-border p-2 hover:bg-muted" title="Reject"><X className="size-4" /></button>
                        <button onClick={() => action(blog, "reject", "Blog archived", { status: "archived" })} className="rounded-lg border border-border p-2 hover:bg-muted" title="Archive"><Archive className="size-4" /></button>
                        <button onClick={() => action(blog, "regenerate-image", "Image regenerated")} className="rounded-lg border border-border p-2 hover:bg-muted" title="Regenerate image"><ImageIcon className="size-4" /></button>
                        <button onClick={() => deleteBlog(blog)} className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10" title="Delete"><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-sm font-bold text-muted-foreground">
                      No blogs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-primary" />
              <h2 className="text-sm font-black text-foreground">AI Blog Generation</h2>
            </div>
            <input
              value={aiTopic}
              onChange={(event) => setAiTopic(event.target.value)}
              placeholder="Optional topic angle..."
              className="mt-4 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button onClick={generateAI} disabled={saving} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              <Sparkles className="size-4" />
              Run AI Blog Now
            </button>
          </section>

          {settings && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-black text-foreground">Automation Settings</h2>
              <label className="mt-4 flex items-center justify-between gap-3 text-sm font-bold">
                Enable AI auto blogging
                <input type="checkbox" checked={Boolean(settings.enabled)} onChange={(event) => saveSettings({ enabled: event.target.checked })} />
              </label>
              <label className="mt-3 flex items-center justify-between gap-3 text-sm font-bold">
                Auto publish after approval
                <input type="checkbox" checked={Boolean(settings.autoPublishAfterAIApproval)} onChange={(event) => saveSettings({ autoPublishAfterAIApproval: event.target.checked })} />
              </label>
              <label className="mt-4 block text-xs font-black uppercase tracking-wider text-muted-foreground">Frequency hours</label>
              <input type="number" min="1" max="168" value={settings.frequencyHours || 24} onChange={(event) => setSettings((current) => ({ ...current, frequencyHours: event.target.value }))} onBlur={() => saveSettings({ frequencyHours: settings.frequencyHours })} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-bold" />
              <p className="mt-4 text-xs font-semibold text-muted-foreground">Last run: {settings.lastRunAt ? new Date(settings.lastRunAt).toLocaleString() : "Never"}</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">Next run: {settings.nextRunAt ? new Date(settings.nextRunAt).toLocaleString() : "-"}</p>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-black text-foreground">Automation Logs</h2>
            <div className="mt-4 space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase text-primary">{log.status}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{log.startedAt ? new Date(log.startedAt).toLocaleString() : ""}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{log.message}</p>
                </div>
              ))}
              {logs.length === 0 && <p className="text-sm font-semibold text-muted-foreground">No automation logs yet.</p>}
            </div>
          </section>
        </aside>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto border-l border-border bg-card shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-primary">{selectedBlog.id ? "Edit Blog" : "Manual Blog"}</p>
                <h2 className="text-xl font-black text-foreground">{selectedBlog.title || "New SiteCraft AI blog"}</h2>
              </div>
              <button onClick={() => setEditing(null)} className="rounded-xl border border-border p-2 hover:bg-muted"><X className="size-5" /></button>
            </div>
            <div className="grid gap-4 p-5">
              {[
                ["title", "Title"],
                ["slug", "Slug"],
                ["summary", "Summary"],
                ["excerpt", "Excerpt"],
                ["metaTitle", "Meta title"],
                ["metaDescription", "Meta description"],
                ["tags", "Tags comma-separated"],
                ["keywords", "Keywords comma-separated"],
                ["imageUrl", "Featured image URL"],
                ["imageAlt", "Image alt text"],
              ].map(([key, label]) => (
                <label key={key} className="grid gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  {label}
                  <input value={selectedBlog[key] || ""} onChange={(event) => setEditing((current) => ({ ...current, [key]: event.target.value }))} className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-semibold normal-case tracking-normal text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
                </label>
              ))}
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Category
                  <select value={selectedBlog.category} onChange={(event) => setEditing((current) => ({ ...current, category: event.target.value }))} className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-bold text-foreground">
                    {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Status
                  <select value={selectedBlog.status} onChange={(event) => setEditing((current) => ({ ...current, status: event.target.value }))} className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-bold text-foreground">
                    {statuses.filter((item) => item !== "all").map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-3 pt-7 text-sm font-bold">
                  <input type="checkbox" checked={Boolean(selectedBlog.isFeatured)} onChange={(event) => setEditing((current) => ({ ...current, isFeatured: event.target.checked }))} />
                  Featured
                </label>
              </div>
              <label className="grid gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                Content
                <textarea value={selectedBlog.content || ""} onChange={(event) => setEditing((current) => ({ ...current, content: event.target.value }))} rows={16} className="rounded-xl border border-border bg-background p-3 text-sm font-medium normal-case leading-7 tracking-normal text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </label>
              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <button onClick={() => setEditing(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-muted">Cancel</button>
                <button onClick={saveBlog} disabled={saving} className="rounded-xl bg-primary px-5 py-2 text-sm font-black text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Save Blog</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {aiProgress.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <div className="flex items-center gap-2">
                  {aiProgress.status === "running" && (
                    <Loader2 className="size-5 animate-spin text-primary" />
                  )}
                  {aiProgress.status === "success" && (
                    <CheckCircle2 className="size-5 text-primary" />
                  )}
                  {aiProgress.status === "error" && (
                    <AlertCircle className="size-5 text-destructive" />
                  )}
                  <h2 className="text-lg font-black text-foreground">
                    {aiProgress.title}
                  </h2>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                  {aiProgress.message}
                </p>
              </div>
              <button
                onClick={() => setAiProgress(initialAIProgress)}
                disabled={aiProgress.status === "running"}
                className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close progress"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {aiProgress.steps.map((step, index) => (
                <div
                  key={step.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-black",
                      step.status === "success" && "bg-primary text-primary-foreground",
                      step.status === "running" && "bg-primary/10 text-primary",
                      step.status === "error" && "bg-destructive/10 text-destructive",
                      step.status === "pending" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {step.status === "success" ? (
                      <CheckCircle2 className="size-4" />
                    ) : step.status === "running" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : step.status === "error" ? (
                      <AlertCircle className="size-4" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{step.label}</p>
                    <p className="text-xs font-semibold capitalize text-muted-foreground">
                      {step.status}
                    </p>
                  </div>
                </div>
              ))}

              {aiProgress.blog && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-primary">
                    Generated Blog
                  </p>
                  <p className="mt-2 text-sm font-black text-foreground">
                    {aiProgress.blog.title}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    Status: {aiProgress.blog.status} · Category: {aiProgress.blog.category}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-border p-5">
              {aiProgress.blog?.slug && aiProgress.blog.status === "published" && (
                <Link
                  href={`/blog/${aiProgress.blog.slug}`}
                  target="_blank"
                  className="rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-muted"
                >
                  View Public
                </Link>
              )}
              <button
                onClick={() => setAiProgress(initialAIProgress)}
                disabled={aiProgress.status === "running"}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-black text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {aiProgress.status === "running" ? "Working..." : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
