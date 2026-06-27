"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Eye,
  Trash2,
  Share2,
  Edit3,
  ExternalLink,
  Globe,
  Search,
  SlidersHorizontal,
  Clock,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardGridSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { toast } from "@/components/dashboard/Toast";

const STATUS_FILTERS = ["All", "Draft", "Generated", "Published", "Archived"];

export default function DashboardSitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [publishing, setPublishing] = useState(null);
  const [limit, setLimit] = useState(null);

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    setLoading(true);
    try {
      const res = await fetch("/api/sites");
      const data = await res.json();
      if (data.success) {
        setSites(data.sites || []);
        setLimit(data.limit || null);
      }
    } catch (e) {
      toast("Failed to load websites", "error");
    } finally {
      setLoading(false);
    }
  }

  const openDeleteConfirm = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sites/${deletingId}`, { method: "DELETE" });
      if (res.ok) {
        setSites((prev) => prev.filter((s) => s._id !== deletingId));
        toast("Website deleted successfully");
      } else {
        toast("Failed to delete website", "error");
      }
    } catch {
      toast("Error deleting website", "error");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const handlePublish = async (site) => {
    setPublishing(site._id);
    try {
      const res = await fetch(`/api/user/sites/${site._id}/publish`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setSites((prev) =>
          prev.map((s) => (s._id === site._id ? data.site : s)),
        );
        toast("Website published! 🎉");
      } else {
        toast(data.error || "Failed to publish", "error");
      }
    } catch {
      toast("Error publishing website", "error");
    } finally {
      setPublishing(null);
    }
  };

  const filtered = sites.filter((s) => {
    const matchSearch =
      search === "" ||
      (s.inputData?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.category || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || s.status?.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <DashboardShell>
      <DashboardPageHeader
        title="My Websites"
        description={limit ? `${limit.currentCount}/${limit.limit} websites used on ${limit.planSlug} plan` : `${sites.length} website${sites.length !== 1 ? "s" : ""} total`}
      >
        <Link
          href="/dashboard/generate"
          className="site-primary-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Sparkles className="w-4 h-4" />
          Generate New
        </Link>
      </DashboardPageHeader>

      {limit && !limit.allowed ? (
        <DashboardCard className="border-amber-300 bg-amber-50 text-amber-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black">{limit.reason}</p>
              <p className="mt-1 text-sm">Create space by managing existing websites, or upgrade for higher website capacity.</p>
            </div>
            <div className="flex gap-2">
              {limit.recommendedPlan ? <Link href={`/pricing/${limit.recommendedPlan}`} className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground">Upgrade to {limit.recommendedPlan}</Link> : null}
              <Link href="/pricing" className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-black">Compare Plans</Link>
            </div>
          </div>
        </DashboardCard>
      ) : null}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search websites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Sites list */}
      {loading ? (
        <DashboardGridSkeleton count={4} variant="row" />
      ) : filtered.length === 0 ? (
        <DashboardCard>
          {sites.length === 0 ? (
            <DashboardEmptyState
              icon={Globe}
              title="No websites yet"
              description="Generate your first AI-powered website in minutes."
              actionLabel="Generate Website"
              actionHref="/dashboard/generate"
            />
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No websites match your search.
              </p>
            </div>
          )}
        </DashboardCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((site, i) => (
            <motion.div
              key={site._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <DashboardCard className="group">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Site icon / thumbnail */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-400/10 border border-primary/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-foreground truncate max-w-[200px]">
                        {site.inputData?.name ||
                          site.siteName ||
                          site.generatedContent?.hero?.headline ||
                          "Untitled Site"}
                      </h3>
                      <StatusBadge status={site.status} />
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                      <span className="capitalize">
                        {site.category || "Portfolio"}
                      </span>
                      <span>·</span>
                      <span>{site.themeId || "Default theme"}</span>
                      {site.templateSlug ? (
                        <>
                          <span>Â·</span>
                          <span>{site.templateSlug}</span>
                        </>
                      ) : null}
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(site.createdAt).toLocaleDateString()}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        {site.analytics?.views || 0} views
                      </span>
                    </div>
                    {site.isPublished && site.slug && (
                      <a
                        href={`/site/${site.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-[11px] text-primary hover:underline"
                      >
                        sitecraft.ai/site/{site.slug}{" "}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() =>
                        window.open(`/dashboard/sites/${site._id}/preview`, "_blank")
                      }
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>

                    <Link
                      href={`/dashboard/editor/${site._id}`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Link>

                    {!site.isPublished ? (
                      <button
                        onClick={() => handlePublish(site)}
                        disabled={publishing === site._id}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/15 transition-all disabled:opacity-50"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        {publishing === site._id ? "Publishing..." : "Publish"}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          window.open(`/site/${site.slug}`, "_blank")
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Live
                      </button>
                    )}

                    <button
                      onClick={() => openDeleteConfirm(site._id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </DashboardCard>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Website"
        description="Are you sure you want to permanently delete this website? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />
    </DashboardShell>
  );
}
