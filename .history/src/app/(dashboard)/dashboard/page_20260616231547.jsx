"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Sparkles,
  BarChart3,
  TrendingUp,
  Eye,
  Coins,
  CheckCircle2,
  FileText,
  ArrowRight,
  Clock,
  Zap,
  ExternalLink,
} from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import {
  DashboardCard,
  DashboardStatCard,
} from "@/components/dashboard/DashboardCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardGridSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

export default function DashboardPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSites() {
      try {
        const res = await fetch("/api/sites");
        const data = await res.json();
        if (data.success) setSites(data.sites || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, []);

  const totalSites = sites.length;
  const publishedSites = sites.filter((s) => s.isPublished).length;
  const draftSites = sites.filter((s) => !s.isPublished).length;
  const totalViews = sites.reduce(
    (acc, s) => acc + (s.analytics?.views || 0),
    0,
  );
  const recentSites = sites.slice(0, 5);

  return (
    <DashboardShell>
      {/* Welcome header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-6 lg:p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="site-badge-emerald text-[10px]">
                <Sparkles className="w-2.5 h-2.5 inline mr-1" />
                AI-Powered
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Welcome back! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
              Create, manage, and publish your AI-powered websites. You have{" "}
              <span className="text-primary font-semibold">3 credits</span>{" "}
              remaining.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/dashboard/sites"
              className="site-secondary-button px-4 py-2.5 rounded-lg text-sm font-semibold"
            >
              View Sites
            </Link>
            <Link
              href="/dashboard/generate"
              className="site-primary-button px-4 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Globe,
            label: "Total Websites",
            value: loading ? "—" : totalSites,
            sub: "All time",
            iconClass: "bg-blue-500/15",
            trend: null,
          },
          {
            icon: CheckCircle2,
            label: "Published",
            value: loading ? "—" : publishedSites,
            sub: "Live sites",
            iconClass: "bg-emerald-500/15",
            trend: null,
          },
          {
            icon: FileText,
            label: "Drafts",
            value: loading ? "—" : draftSites,
            sub: "In progress",
            iconClass: "bg-orange-500/15",
            trend: null,
          },
          {
            icon: Eye,
            label: "Total Views",
            value: loading ? "—" : totalViews.toLocaleString(),
            sub: "Across all sites",
            iconClass: "bg-purple-500/15",
            trend: null,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            animate="visible"
            custom={i}
            variants={fadeUp}
          >
            <DashboardStatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent websites */}
        <motion.div
          className="lg:col-span-2"
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
        >
          <DashboardPageHeader
            title="Recent Websites"
            description="Your latest generated websites"
          >
            <Link
              href="/dashboard/sites"
              className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </DashboardPageHeader>

          <div className="mt-4 space-y-3">
            {loading ? (
              <DashboardGridSkeleton count={3} variant="row" />
            ) : recentSites.length === 0 ? (
              <DashboardCard>
                <DashboardEmptyState
                  icon={Globe}
                  title="No websites yet"
                  description="Generate your first AI-powered website in minutes."
                  actionLabel="Generate Website"
                  actionHref="/dashboard/generate"
                />
              </DashboardCard>
            ) : (
              recentSites.map((site) => (
                <DashboardCard key={site._id} className="group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {site.inputData?.name ||
                            site.generatedContent?.hero?.headline ||
                            "Untitled Site"}
                        </h3>
                        <StatusBadge status={site.status} />
                      </div>
                      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(site.createdAt).toLocaleDateString()}
                        </span>
                        <span className="capitalize">{site.category}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {site.analytics?.views || 0} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          window.open(`/preview/${site._id}`, "_blank")
                        }
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/dashboard/sites/${site._id}`}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </DashboardCard>
              ))
            )}
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          className="space-y-5"
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeUp}
        >
          {/* AI Credits card */}
          <DashboardCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                AI Credits
              </h3>
              <Link
                href="/dashboard/credits"
                className="text-[11px] text-primary hover:underline"
              >
                Manage
              </Link>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div>
                <span className="text-3xl font-bold text-foreground">3</span>
                <span className="text-sm text-muted-foreground">/5</span>
              </div>
              <span className="site-badge-emerald text-[10px]">Free Plan</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-primary to-emerald-400" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              2 credits used · 3 remaining
            </p>
            <Link
              href="/dashboard/billing"
              className="mt-4 flex items-center justify-between w-full px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 text-xs font-semibold text-accent hover:bg-accent/15 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                Upgrade for more
              </span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </DashboardCard>

          {/* Quick actions */}
          <DashboardCard>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: "Generate Website",
                  href: "/dashboard/generate",
                  icon: Sparkles,
                  primary: true,
                },
                { label: "My Websites", href: "/dashboard/sites", icon: Globe },
                {
                  label: "Analytics",
                  href: "/dashboard/analytics",
                  icon: BarChart3,
                },
                {
                  label: "View Credits",
                  href: "/dashboard/credits",
                  icon: Coins,
                },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      action.primary
                        ? "site-primary-button justify-center"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </DashboardCard>

          {/* AI usage summary */}
          <DashboardCard>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              This Month
            </h3>
            <div className="space-y-3">
              {[
                { label: "Websites generated", value: totalSites },
                {
                  label: "Total page views",
                  value: totalViews.toLocaleString(),
                },
                { label: "Published sites", value: publishedSites },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {loading ? "—" : item.value}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
