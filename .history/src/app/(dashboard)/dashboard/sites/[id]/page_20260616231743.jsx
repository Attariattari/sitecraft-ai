"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Settings,
  Share2,
  Trash2,
  Globe,
  Monitor,
  LayoutTemplate,
  Palette,
  ExternalLink,
  Edit3,
} from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { toast } from "@/components/dashboard/Toast";

export default function SiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    async function fetchSite() {
      try {
        const res = await fetch(`/api/sites/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setSite(data.site);
        } else {
          toast("Site not found", "error");
          router.push("/dashboard/sites");
        }
      } catch (error) {
        toast("Failed to load site details", "error");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchSite();
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/sites/${site._id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Website deleted successfully");
        router.push("/dashboard/sites");
      } else {
        toast("Failed to delete website", "error");
      }
    } catch {
      toast("Error deleting website", "error");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/sites/${site._id}/publish`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setSite(data.site);
        toast("Website published successfully! 🎉");
      } else {
        toast(data.error || "Failed to publish", "error");
      }
    } catch {
      toast("Error publishing website", "error");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center gap-4 mb-8">
          <DashboardSkeleton className="w-8 h-8 rounded-full" />
          <div>
            <DashboardSkeleton className="w-48 h-6 mb-2" />
            <DashboardSkeleton className="w-32 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <DashboardSkeleton className="w-full h-64 rounded-xl" />
            <DashboardSkeleton className="w-full h-48 rounded-xl" />
          </div>
          <div className="space-y-6">
            <DashboardSkeleton className="w-full h-48 rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!site) return null;

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
        <div>
          <Link
            href="/dashboard/sites"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sites
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {site.inputData?.name ||
                site.generatedContent?.hero?.headline ||
                "Untitled Site"}
            </h1>
            <StatusBadge status={site.status} />
          </div>
          {site.isPublished && site.slug && (
            <a
              href={`/site/${site.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              sitecraft.ai/site/{site.slug}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => window.open(`/preview/${site._id}`, "_blank")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-all"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
            Preview
          </button>

          <Link
            href={`/dashboard/editor/${site._id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-all"
          >
            <Edit3 className="w-4 h-4 text-muted-foreground" />
            Edit
          </Link>

          {!site.isPublished ? (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="site-primary-button flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
            >
              <Share2 className="w-4 h-4" />
              {publishing ? "Publishing..." : "Publish"}
            </button>
          ) : (
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
              disabled
            >
              <Globe className="w-4 h-4" />
              Live Online
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <DashboardCard>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              Site configuration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="text-sm font-medium capitalize">
                  {site.category}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Profession</p>
                <p className="text-sm font-medium capitalize">
                  {site.inputData?.profession || "Not specified"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  Theme
                </p>
                <p className="text-sm font-medium capitalize">{site.themeId}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  Template
                </p>
                <p className="text-sm font-medium capitalize">Alpha</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <h3 className="text-sm font-semibold mb-4">Content Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Hero Headline
                </p>
                <p className="text-sm font-medium">
                  {site.generatedContent?.hero?.headline || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Hero Subheadline
                </p>
                <p className="text-sm">
                  {site.generatedContent?.hero?.subheadline || "—"}
                </p>
              </div>
              {site.generatedContent?.skills?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Technologies / Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {site.generatedContent.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium border border-border/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        {/* Analytics & Settings Sidebar */}
        <div className="space-y-6">
          <DashboardCard>
            <h3 className="text-sm font-semibold mb-4">Analytics</h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-primary" />
                Total Views
              </span>
              <span className="text-lg font-bold text-foreground">
                {site.analytics?.views || 0}
              </span>
            </div>
          </DashboardCard>

          <DashboardCard>
            <h3 className="text-sm font-semibold mb-4">Metadata</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Created
                </span>
                <span className="text-xs font-medium">
                  {new Date(site.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" /> Site ID
                </span>
                <span className="text-xs font-medium font-mono text-muted-foreground truncate max-w-[120px]">
                  {site._id}
                </span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="border-destructive/20">
            <h3 className="text-sm font-semibold text-destructive mb-2">
              Danger Zone
            </h3>
            <p className="text-[11px] text-muted-foreground mb-4">
              Permanently delete this website and all of its content. This
              action cannot be undone.
            </p>
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Website
            </button>
          </DashboardCard>
        </div>
      </div>

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
