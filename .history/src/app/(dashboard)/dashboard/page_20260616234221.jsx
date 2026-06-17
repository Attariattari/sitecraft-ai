"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Eye,
  Zap,
  ArrowRight,
  Clock,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  Layout,
  Plus,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  DashboardCard,
  DashboardStatCard,
} from "@/components/dashboard/DashboardCard";
import { DashboardGridSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DashboardOverviewHeader } from "@/components/dashboard/DashboardOverviewHeader";
import { DashboardQuickAction } from "@/components/dashboard/DashboardQuickAction";
import { DashboardChecklist } from "@/components/dashboard/DashboardChecklist";
import { DashboardActivityList } from "@/components/dashboard/DashboardActivityList";
import { DashboardAnalyticsSnapshot } from "@/components/dashboard/DashboardAnalyticsSnapshot";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" },
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
        if (data.success) {
          // Sort by newest first
          const sorted = (data.sites || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setSites(sorted);
        }
      } catch (e) {
        console.error("Failed to fetch sites:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, []);

  const totalSites = sites.length;
  const publishedSites = sites.filter((s) => s.isPublished).length;
  const totalViews = sites.reduce(
    (acc, s) => acc + (s.analytics?.views || 0),
    0,
  );
  const recentSites = sites.slice(0, 3);

  // Mock data for new sections
  const checklistItems = [
    {
      title: "Complete your profile",
      link: "/dashboard/profile",
      completed: true,
    },
    {
      title: "Generate your first website",
      link: "/dashboard/generate",
      completed: totalSites > 0,
    },
    {
      title: "Choose a professional theme",
      link: "/dashboard/themes",
      completed: totalSites > 0,
    },
    {
      title: "Preview your website",
      link: "/dashboard/sites",
      completed: totalSites > 0,
    },
    {
      title: "Publish your website",
      link: "/dashboard/sites",
      completed: publishedSites > 0,
    },
    {
      title: "Connect custom domain",
      link: "/dashboard/domains",
      completed: false,
    },
  ];

  const recentActivity = [
    ...(sites.length > 0
      ? [
          {
            type: "generate",
            title: "New website generated",
            time: "Recent",
            target: sites[0].inputData?.name || "Portfolio",
          },
        ]
      : []),
    ...(publishedSites > 0
      ? [
          {
            type: "publish",
            title: "Website published live",
            time: "Recently",
            target: sites.find((s) => s.isPublished)?.inputData?.name,
          },
        ]
      : []),
    {
      type: "update",
      title: "Profile information updated",
      time: "2 days ago",
    },
  ];

  return (
    <DashboardShell>
      {/* 1. Welcome Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <DashboardOverviewHeader
          userName="User"
          plan="Pro Early Access"
          remainingCredits={12}
        />
      </motion.div>

      {/* 2. Quick Action CTA Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="mb-10"
      >
        <DashboardQuickAction />
      </motion.div>

      {/* 3. Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          {
            icon: Layout,
            label: "Total Websites",
            value: loading ? "—" : totalSites,
            sub: "Projects started",
            iconClass: "bg-blue-500/10 text-blue-500",
          },
          {
            icon: CheckCircle2,
            label: "Published Sites",
            value: loading ? "—" : publishedSites,
            sub: "Active online",
            iconClass: "bg-emerald-500/10 text-emerald-500",
          },
          {
            icon: Sparkles,
            label: "AI Credits",
            value: "12",
            sub: "Monthly allowance",
            iconClass: "bg-purple-500/10 text-purple-500",
          },
          {
            icon: Eye,
            label: "Total Traffic",
            value: loading ? "—" : totalViews.toLocaleString(),
            sub: "Last 30 days",
            iconClass: "bg-orange-500/10 text-orange-500",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 2}
          >
            <DashboardStatCard
              {...stat}
              cardClass="hover:border-primary/30 transition-colors"
              iconClass={stat.iconClass.split(" ")[0]} // taking the bg color only
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* 4. Recent Websites Section */}
        <motion.div
          className="lg:col-span-2 flex flex-col"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Projects</h2>
            <Link
              href="/dashboard/sites"
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
            >
              View all sites <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {loading ? (
              <DashboardGridSkeleton count={3} variant="row" />
            ) : recentSites.length === 0 ? (
              <DashboardCard className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Layout className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">No websites yet</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-6">
                    Start your journey by generating your first AI website in
                    seconds.
                  </p>
                  <Link
                    href="/dashboard/generate"
                    className="site-primary-button px-6 py-2 rounded-xl text-sm inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Generate Project
                  </Link>
                </div>
              </DashboardCard>
            ) : (
              recentSites.map((site) => (
                <DashboardCard
                  key={site._id}
                  className="group hover:border-primary/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/5 flex items-center justify-center shrink-0">
                      <Globe className="w-6 h-6 text-primary/60 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-foreground truncate">
                          {site.inputData?.name ||
                            site.generatedContent?.hero?.headline ||
                            "Untitled Site"}
                        </h3>
                        <StatusBadge status={site.status} />
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {new Date(site.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="uppercase tracking-widest text-[9px]">
                          {site.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />{" "}
                          {site.analytics?.views || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          window.open(`/preview/${site._id}`, "_blank")
                        }
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                        title="Quick Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/dashboard/sites/${site._id}`}
                        className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-bold hover:bg-muted hover:border-primary/20 transition-all"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </DashboardCard>
              ))
            )}
          </div>
        </motion.div>

        {/* 5, 6. Sidebar Column (AI Credits + Performance) */}
        <div className="space-y-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={7}
          >
            {/* AI Credits Mini Card */}
            <DashboardCard className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  AI Usage
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Pro
                </span>
              </div>
              <div className="text-3xl font-black mb-2 leading-none">
                12{" "}
                <span className="text-sm font-medium text-muted-foreground tracking-normal">
                  / 50
                </span>
              </div>
              <div className="w-full h-1.5 bg-primary/20 rounded-full overflow-hidden mb-3">
                <div className="h-full w-[24%] bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium mb-4">
                You have used 24% of your monthly AI generation allowance.
              </p>
              <Link
                href="/dashboard/credits"
                className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
              >
                View full usage <ArrowRight className="w-3 h-3" />
              </Link>
            </DashboardCard>
          </motion.div>

          {/* 6. Performance Snapshot */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={8}
          >
            <DashboardAnalyticsSnapshot
              views={totalViews}
              publishedCount={publishedSites}
            />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* 7. Checklist */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={9}
        >
          <DashboardChecklist items={checklistItems} />
        </motion.div>

        {/* 8. Recent Activity */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={10}
        >
          <DashboardActivityList activities={recentActivity} />
        </motion.div>

        {/* 9. Help Center / Support CTA */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={11}
        >
          <DashboardCard className="h-full flex flex-col justify-between overflow-hidden relative group border-accent/20">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent/5 rounded-full group-hover:scale-150 transition-transform duration-700" />

            <div className="relative p-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">Need a hand?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Our help center is packed with guides, video tutorials, and
                documentation to help you build the perfect website.
              </p>
            </div>

            <div className="relative space-y-2 mt-auto">
              <Link
                href="/dashboard/help"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-accent/10 text-accent text-sm font-bold hover:bg-accent/20 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Layout className="w-4 h-4" /> Visit Help Center
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/support"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-border text-foreground text-sm font-bold hover:bg-muted transition-all"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />{" "}
                  Contact Support
                </span>
                <ArrowRight className="w-4 h-4 opacity-30" />
              </Link>
            </div>
          </DashboardCard>
        </motion.div>
      </div>

      {/* Footer / Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border mt-12"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              AI Engine Online
            </span>
          </div>
          <span className="text-border">|</span>
          <span className="text-[11px] text-muted-foreground">
            Version 4.0.2-prod
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          &copy; {new Date().getFullYear()} SiteCraft AI. All systems
          operational.
        </p>
      </motion.div>
    </DashboardShell>
  );
}
