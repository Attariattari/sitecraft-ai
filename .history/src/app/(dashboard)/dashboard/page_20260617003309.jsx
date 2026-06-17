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
  Gauge,
  Rocket,
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
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.6, ease: "easeOut" },
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
        className="w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: Layout,
              label: "Total Websites",
              value: loading ? "—" : totalSites,
              sub: "Projects started",
              iconClass: "bg-blue-500/10 text-blue-500",
              trend: totalSites > 0 ? 12 : null,
            },
            {
              icon: CheckCircle2,
              label: "Published Sites",
              value: loading ? "—" : publishedSites,
              sub: "Active online",
              iconClass: "bg-emerald-500/10 text-emerald-500",
              trend: publishedSites > 0 ? 8 : null,
            },
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {[
          { icon: Layout, label: "Total Websites", value: loading ? "—" : totalSites, sub: "Projects started", iconClass: "bg-blue-500/10 text-blue-500" },
          { icon: CheckCircle2, label: "Published Sites", value: loading ? "—" : publishedSites, sub: "Active online", iconClass: "bg-emerald-500/10 text-emerald-500" },
          { icon: Clock, label: "Draft Sites", value: loading ? "—" : sites.filter(s => !s.isPublished).length, sub: "Work in progress", iconClass: "bg-orange-500/10 text-orange-500" },
          { icon: Sparkles, label: "AI Credits", value: "12", sub: "Monthly allowance", iconClass: "bg-purple-500/10 text-purple-500" },
          { icon: Eye, label: "Total Views", value: loading ? "—" : totalViews.toLocaleString(), sub: "Across all sites", iconClass: "bg-pink-500/10 text-pink-500" },
          { icon: Plus, label: "Last Generated", value: loading ? "—" : (sites[0] ? new Date(sites[0].createdAt).toLocaleDateString() : "Never"), sub: "Latest activity", iconClass: "bg-indigo-500/10 text-indigo-500" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial="hidden" animate="visible" variants={fadeUp} custom={i + 2}>
            <DashboardStatCard 
              {...stat} 
              cardClass="hover:border-primary/30 transition-all duration-300 h-full"
              iconClass={stat.iconClass.split(" ")[0]}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* 4. Recent Websites Section */}
        <motion.div
          className="lg:col-span-2 flex flex-col"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6.5}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-1">Recent Projects</h2>
              <p className="text-sm text-muted-foreground">Manage and monitor your latest websites</p>
            </div>
            <Link
              href="/dashboard/sites"
              className="text-sm font-bold text-primary flex items-center gap-2 hover:gap-3 transition-all hover:underline"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {loading ? (
              <DashboardGridSkeleton count={3} variant="row" />
            ) : recentSites.length === 0 ? (
              <DashboardCard className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <Layout className="w-8 h-8 text-primary/50" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">No websites yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-7">
                    Start your journey by generating your first AI-powered website in seconds. It takes less than 2 minutes.
                  </p>
                  <Link
                    href="/dashboard/generate"
                    className="site-primary-button px-6 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Rocket className="w-4 h-4" /> Create First Site
                  </Link>
                </div>
              </DashboardCard>
            ) : (
              recentSites.map((site, idx) => (
                <motion.div
                  key={site._id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={idx + 7}
                >
                  <DashboardCard className="group hover:border-primary/30 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/5 flex items-center justify-center shrink-0 group-hover:from-primary/15 transition-all">
                        <Globe className="w-6 h-6 text-primary/60 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-sm font-bold text-foreground truncate">
                            {site.inputData?.name ||
                              site.generatedContent?.hero?.headline ||
                              "Untitled Site"}
                          </h3>
                          <StatusBadge status={site.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {new Date(site.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-muted-foreground/30">•</span>
                          <span className="uppercase tracking-wider">
                            {site.category || "General"}
                          </span>
                          <span className="text-muted-foreground/30">•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />{" "}
                            {site.analytics?.views?.toLocaleString() || 0}
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
                          className="px-4 py-2 rounded-lg border border-border text-xs font-bold hover:bg-muted hover:border-primary/20 transition-all"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </DashboardCard>
                </motion.div>
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
            custom={7.5}
          >
            {/* AI Credits Mini Card */}
            <DashboardCard className="bg-gradient-to-br from-primary/12 to-primary/0 border-primary/25 hover:border-primary/35 transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold flex items-center gap-2.5 text-foreground">
                  <Zap className="w-5 h-5 text-primary" />
                  AI Generation Credits
                </h3>
                <span className="text-xs font-black uppercase tracking-wider text-primary bg-primary/12 px-2.5 py-1 rounded-lg">
                  Pro Plan
                </span>
              </div>
              <div className="mb-5">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-black text-foreground">12</span>
                  <span className="text-base font-medium text-muted-foreground">/ 50 used</span>
                </div>
                <div className="text-xs font-medium text-muted-foreground leading-relaxed">
                  You have used 24% of your monthly AI generation allowance.
                </div>
              </div>
              <div className="w-full h-2 bg-primary/15 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  initial={{ width: 0 }}
                  animate={{ width: "24%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <Link
                href="/dashboard/credits"
                className="text-xs font-bold text-primary flex items-center gap-1.5 hover:gap-2 transition-all hover:underline"
              >
                View detailed usage <ArrowRight className="w-3 h-3" />
              </Link>
            </DashboardCard>
          </motion.div>

          {/* 6. Performance Snapshot */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={8.5}
          >
            <DashboardAnalyticsSnapshot
              views={totalViews}
              publishedCount={publishedSites}
            />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
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
          <DashboardCard className="h-full flex flex-col justify-between overflow-hidden relative group border-accent/25 hover:border-accent/35 bg-gradient-to-br from-accent/8 to-accent/0 transition-all duration-300">
            <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-accent/8 rounded-full group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-5 group-hover:bg-accent/25 transition-colors">
                <HelpCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground">Need help?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-7">
                Browse our comprehensive guides, video tutorials, and documentation to master SiteCraft AI.
              </p>
            </div>

            <div className="relative space-y-2.5 mt-auto">
              <Link
                href="/dashboard/help"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-accent/15 text-accent text-sm font-bold hover:bg-accent/25 transition-all group/link"
              >
                <span className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" /> Help Center
                </span>
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/support"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-border/60 text-foreground text-sm font-bold hover:bg-muted/50 hover:border-border transition-all group/link"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />{" "}
                  Contact Support
                </span>
                <ArrowRight className="w-4 h-4 opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
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
