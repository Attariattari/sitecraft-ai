"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Eye,
  EyeOff,
  Flag,
  RefreshCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { cn } from "@/lib/utils";

const statuses = ["Available Now", "In Progress", "Coming Soon"];

const statusConfig = {
  "Available Now": {
    icon: CheckCircle2,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  "In Progress": {
    icon: Clock3,
    className: "bg-accent/10 text-accent border-accent/20",
  },
  "Coming Soon": {
    icon: CircleDashed,
    className: "bg-muted text-muted-foreground border-border",
  },
};

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingKey, setSavingKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFlags = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/feature-flags", {
        cache: "no-store",
      });
      const data = await res.json();

      if (data.success) {
        setFlags(data.flags);
      } else {
        toast.error(data.message || "Failed to fetch feature flags");
      }
    } catch (error) {
      toast.error("Network error fetching feature flags");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const filteredFlags = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return flags;

    return flags.filter((flag) =>
      [flag.name, flag.key, flag.description, flag.status, flag.audience]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [flags, searchTerm]);

  const enabledCount = flags.filter((flag) => flag.enabled).length;
  const publicCount = flags.filter((flag) => flag.isPublic).length;
  const comingSoonCount = flags.filter(
    (flag) => flag.status === "Coming Soon",
  ).length;

  const updateFlag = async (key, patch) => {
    try {
      setSavingKey(key);
      const res = await fetch(`/api/admin/feature-flags/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();

      if (data.success) {
        setFlags((current) =>
          current.map((flag) => (flag.key === key ? data.flag : flag)),
        );
        toast.success("Feature flag updated");
      } else {
        toast.error(data.message || "Failed to update feature flag");
      }
    } catch (error) {
      toast.error("Network error updating feature flag");
    } finally {
      setSavingKey("");
    }
  };

  const syncDefaults = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/feature-flags", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setFlags(data.flags);
        toast.success(data.message || "Feature flags synced");
      } else {
        toast.error(data.message || "Failed to sync feature flags");
      }
    } catch (error) {
      toast.error("Network error syncing feature flags");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Feature Flags"
        description="Control which platform features are public, available, in progress, or coming soon. The public Features page reads this data live."
        route="/admin/feature-flags"
        badge="Live System"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchFlags();
            }}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-all disabled:opacity-50"
          >
            <RefreshCcw
              className={cn("w-4 h-4", (refreshing || loading) && "animate-spin")}
            />
            Refresh
          </button>
          <button
            onClick={syncDefaults}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            Sync Defaults
          </button>
        </div>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Flag}
          label="Total Flags"
          value={String(flags.length)}
          sub="All tracked features"
        />
        <AdminStatCard
          icon={CheckCircle2}
          label="Enabled"
          value={String(enabledCount)}
          sub="Currently active"
          iconClass="bg-primary"
        />
        <AdminStatCard
          icon={CircleDashed}
          label="Coming Soon"
          value={String(comingSoonCount)}
          sub="Public roadmap"
          iconClass="bg-muted"
        />
        <AdminStatCard
          icon={Eye}
          label="Public"
          value={String(publicCount)}
          sub="Shown on /features"
          iconClass="bg-accent"
        />
      </div>

      <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground font-semibold leading-relaxed">
            These flags are persisted in the database. Public `/features` uses
            public flags from this page and live category availability from the
            category system, so disabled or coming-soon items should not be
            presented as fully available.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">
              Live Feature Flags
            </h2>
            <span className="text-xs text-muted-foreground">
              {filteredFlags.length} shown
            </span>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search feature flags..."
              className="w-full h-10 rounded-xl border border-border bg-muted/30 pl-10 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="grid gap-4 px-5 py-5 md:grid-cols-[1.1fr_0.65fr_0.65fr_0.5fr]"
              >
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-full max-w-lg rounded bg-muted animate-pulse" />
                </div>
                <div className="h-9 rounded-xl bg-muted animate-pulse" />
                <div className="h-9 rounded-xl bg-muted animate-pulse" />
                <div className="h-9 rounded-xl bg-muted animate-pulse" />
              </div>
            ))
          ) : filteredFlags.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Flag className="mx-auto mb-3 w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm font-bold text-foreground">
                No feature flags found.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try another search or sync defaults.
              </p>
            </div>
          ) : (
            filteredFlags.map((flag) => (
              <FeatureFlagRow
                key={flag.key}
                flag={flag}
                saving={savingKey === flag.key}
                onUpdate={updateFlag}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureFlagRow({ flag, saving, onUpdate }) {
  const StatusIcon = statusConfig[flag.status]?.icon || CircleDashed;

  return (
    <div className="grid gap-4 px-5 py-5 transition-colors hover:bg-muted/20 md:grid-cols-[1.1fr_0.65fr_0.65fr_0.5fr] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-foreground">{flag.name}</p>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            {flag.audience}
          </span>
          {flag.isPublic ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              <Eye className="w-3 h-3" />
              Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              <EyeOff className="w-3 h-3" />
              Hidden
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
          {flag.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-mono text-muted-foreground/70">
          <span>{flag.key}</span>
          <span>Used by: {flag.usedBy}</span>
          {flag.benefit ? <span>Benefit: {flag.benefit}</span> : null}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Status
        </label>
        <div className="relative">
          <StatusIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={flag.status}
            disabled={saving}
            onChange={(event) =>
              onUpdate(flag.key, { status: event.target.value })
            }
            className={cn(
              "h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
              statusConfig[flag.status]?.className,
            )}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Live
        </label>
        <button
          disabled={saving}
          onClick={() => onUpdate(flag.key, { enabled: !flag.enabled })}
          className={cn(
            "relative h-10 w-full rounded-xl border px-3 text-left text-xs font-black transition-all disabled:opacity-50",
            flag.enabled
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-border bg-muted text-muted-foreground",
          )}
        >
          {flag.enabled ? "Enabled" : "Disabled"}
          <span
            className={cn(
              "absolute right-2 top-1/2 h-5 w-9 -translate-y-1/2 rounded-full transition-all",
              flag.enabled ? "bg-primary" : "bg-border",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
                flag.enabled ? "left-4" : "left-0.5",
              )}
            />
          </span>
        </button>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Public
        </label>
        <button
          disabled={saving}
          onClick={() => onUpdate(flag.key, { isPublic: !flag.isPublic })}
          className={cn(
            "flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-xs font-black transition-all disabled:opacity-50",
            flag.isPublic
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-border bg-muted text-muted-foreground",
          )}
        >
          {flag.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {flag.isPublic ? "Show" : "Hide"}
        </button>
      </div>
    </div>
  );
}
