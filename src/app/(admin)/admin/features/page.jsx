"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  CircleDashed,
  Edit3,
  Eye,
  EyeOff,
  Layers3,
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
import { cn } from "@/lib/utils";

const planSlugs = ["free", "basic", "pro", "agency"];
const categories = [
  ["all", "All"],
  ["ai_generation", "AI Generation"],
  ["themes_templates", "Themes & Templates"],
  ["dashboard_management", "Dashboard"],
  ["seo_growth", "SEO & Growth"],
  ["security_auth", "Security"],
  ["admin_controls", "Admin Controls"],
  ["agency_tools", "Agency Tools"],
  ["billing_plans", "Billing"],
  ["media_content", "Media"],
  ["publishing", "Publishing"],
];
const statuses = [
  ["available", "Available Now"],
  ["in_progress", "In Progress"],
  ["coming_soon", "Coming Soon"],
];

const blankFeature = {
  title: "",
  slug: "",
  featureKey: "",
  shortDescription: "",
  longDescription: "",
  category: "ai_generation",
  icon: "Sparkles",
  status: "coming_soon",
  badge: "",
  publicVisible: true,
  pricingVisible: true,
  dashboardVisible: false,
  sortOrder: 0,
  isPopular: false,
  isHighlighted: false,
  benefits: [],
  useCases: [],
  ctaLabel: "",
  ctaHref: "",
  plans: {
    free: { included: false, label: "Basic", limitText: "Not included" },
    basic: { included: false, label: "Standard", limitText: "Not included" },
    pro: { included: false, label: "Advanced", limitText: "Not included" },
    agency: { included: false, label: "Full", limitText: "Not included" },
  },
};

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState(null);

  const loadFeatures = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/features", { cache: "no-store" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setFeatures(data.features || []);
      setComparison(data.comparison || null);
    } catch (error) {
      toast.error(error.message || "Could not load features");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return features.filter((feature) => {
      const matchesCategory = category === "all" || feature.category === category;
      const matchesSearch =
        !term ||
        [
          feature.title,
          feature.slug,
          feature.shortDescription,
          feature.category,
          feature.status,
          feature.badge,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [features, search, category]);

  const stats = useMemo(() => {
    const proFeatures = features.filter((feature) => feature.plans?.pro?.included).length;
    const futureFeatures = features.filter((feature) => feature.status === "coming_soon").length;
    return {
      total: features.length,
      publicVisible: features.filter((feature) => feature.publicVisible).length,
      available: features.filter((feature) => feature.status === "available").length,
      inProgress: features.filter((feature) => feature.status === "in_progress").length,
      comingSoon: features.filter((feature) => feature.status === "coming_soon").length,
      proFeatures,
      futureFeatures,
    };
  }, [features]);

  const seedDefaults = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/features/seed", { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setFeatures(data.features || []);
      toast.success(data.message || "Defaults synced");
    } catch (error) {
      toast.error(error.message || "Could not sync defaults");
    } finally {
      setSaving(false);
    }
  };

  const saveFeature = async (feature) => {
    try {
      setSaving(true);
      const isEdit = Boolean(feature.id);
      const res = await fetch(isEdit ? `/api/admin/features/${feature.id}` : "/api/admin/features", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feature),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setFeatures((current) =>
        isEdit
          ? current.map((item) => (item.id === data.feature.id ? data.feature : item))
          : [...current, data.feature],
      );
      setEditing(null);
      toast.success("Feature saved");
    } catch (error) {
      toast.error(error.message || "Could not save feature");
    } finally {
      setSaving(false);
    }
  };

  const patchFeature = async (feature, patch) => {
    await saveFeature({ ...feature, ...patch });
  };

  const deleteFeature = async (feature) => {
    if (!window.confirm(`Delete ${feature.title}?`)) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/features/${feature.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setFeatures((current) => current.filter((item) => item.id !== feature.id));
      toast.success("Feature deleted");
    } catch (error) {
      toast.error(error.message || "Could not delete feature");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Features"
        description="Manage public feature showcase content, roadmap status, visibility, and plan availability display."
        route="/admin/features"
        badge="Super Admin"
      >
        <button
          onClick={loadFeatures}
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
          Sync Defaults
        </button>
        <button
          onClick={() => setEditing(blankFeature)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add Feature
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        <AdminStatCard icon={Layers3} label="Total Features" value={String(stats.total)} sub="Catalog items" />
        <AdminStatCard icon={Eye} label="Public Visible" value={String(stats.publicVisible)} sub="Shown on /features" />
        <AdminStatCard icon={CheckCircle2} label="Available Now" value={String(stats.available)} sub="Live status" iconClass="bg-primary" />
        <AdminStatCard icon={RefreshCcw} label="In Progress" value={String(stats.inProgress)} sub="Roadmap build" iconClass="bg-yellow-500" />
        <AdminStatCard icon={CircleDashed} label="Coming Soon" value={String(stats.comingSoon)} sub="Future roadmap" iconClass="bg-muted" />
        <AdminStatCard icon={Sparkles} label="Pro Features" value={String(stats.proFeatures)} sub="Pro included" iconClass="bg-accent" />
        <AdminStatCard icon={BarChart3} label="Future Tools" value={String(stats.futureFeatures)} sub="Coming soon" iconClass="bg-emerald-500" />
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-black text-foreground">Feature Catalog</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Backend entitlements remain the source of truth. The plan editor here controls public display labels.
              </p>
            </div>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search features..."
                className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  "shrink-0 rounded-xl border px-3 py-2 text-xs font-black transition",
                  category === key
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-black uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-4 text-left">Feature</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Public</th>
                <th className="p-4 text-center">Pricing</th>
                <th className="p-4 text-left">Plans</th>
                <th className="p-4 text-center">Sort</th>
                <th className="p-4 text-left">Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={9} className="p-4">
                      <div className="h-12 animate-pulse rounded-xl bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center">
                    <Layers3 className="mx-auto mb-3 size-10 text-muted-foreground/30" />
                    <p className="font-bold text-foreground">No features found.</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try another filter or sync defaults.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((feature) => (
                  <FeatureRow
                    key={feature.id}
                    feature={feature}
                    onEdit={() => setEditing(feature)}
                    onPatch={patchFeature}
                    onDelete={deleteFeature}
                    disabled={saving}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {comparison ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-black text-foreground">Plan Entitlement Snapshot</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {comparison.plans.map((plan) => (
              <div key={plan.slug} className="rounded-xl border border-border bg-background p-4">
                <p className="font-black text-foreground">{plan.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {plan.limits.websites} websites ·{" "}
                  {plan.limits.themes} themes ·{" "}
                  {plan.limits.aiCreditsPerMonth} AI credits
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {editing ? (
        <FeatureModal
          feature={editing}
          onClose={() => setEditing(null)}
          onSave={saveFeature}
          saving={saving}
        />
      ) : null}
    </div>
  );
}

function FeatureRow({ feature, onEdit, onPatch, onDelete, disabled }) {
  return (
    <tr className="align-top transition hover:bg-muted/20">
      <td className="p-4">
        <p className="font-black text-foreground">{feature.title}</p>
        <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{feature.shortDescription}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {feature.badge ? <Badge>{feature.badge}</Badge> : null}
          {feature.isHighlighted ? <Badge>Highlighted</Badge> : null}
        </div>
      </td>
      <td className="p-4 text-xs font-bold text-muted-foreground">{labelFor(categories, feature.category)}</td>
      <td className="p-4">
        <select
          value={feature.status}
          disabled={disabled}
          onChange={(event) => onPatch(feature, { status: event.target.value })}
          className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20"
        >
          {statuses.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </td>
      <td className="p-4 text-center">
        <VisibilityButton active={feature.publicVisible} disabled={disabled} onClick={() => onPatch(feature, { publicVisible: !feature.publicVisible })} />
      </td>
      <td className="p-4 text-center">
        <VisibilityButton active={feature.pricingVisible} disabled={disabled} onClick={() => onPatch(feature, { pricingVisible: !feature.pricingVisible })} />
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {planSlugs.map((plan) => (
            <span
              key={plan}
              className={cn(
                "rounded-full border px-2 py-1 text-[10px] font-black uppercase",
                feature.plans?.[plan]?.included
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              {plan}
            </span>
          ))}
        </div>
      </td>
      <td className="p-4 text-center font-mono text-xs text-muted-foreground">{feature.sortOrder}</td>
      <td className="p-4 text-xs text-muted-foreground">{feature.updatedAt ? new Date(feature.updatedAt).toLocaleDateString() : "New"}</td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <Edit3 className="size-4" />
          </button>
          <button onClick={() => onDelete(feature)} disabled={disabled} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50">
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function FeatureModal({ feature, onClose, onSave, saving }) {
  const [draft, setDraft] = useState(() => ({
    ...blankFeature,
    ...feature,
    plans: { ...blankFeature.plans, ...(feature.plans || {}) },
    benefitsText: (feature.benefits || []).join("\n"),
    useCasesText: (feature.useCases || []).join("\n"),
  }));

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const updatePlan = (plan, field, value) =>
    setDraft((current) => ({
      ...current,
      plans: {
        ...current.plans,
        [plan]: { ...current.plans[plan], [field]: value },
      },
    }));

  const submit = (event) => {
    event.preventDefault();
    onSave({
      ...draft,
      benefits: draft.benefitsText,
      useCases: draft.useCasesText,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="my-8 w-full max-w-5xl rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-black text-foreground">{draft.id ? "Edit Feature" : "Add Feature"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">Control showcase copy, public visibility, roadmap status, and plan labels.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Feature title" value={draft.title} onChange={(value) => update("title", value)} required />
              <Field label="Slug" value={draft.slug} onChange={(value) => update("slug", value)} />
              <SelectField label="Category" value={draft.category} onChange={(value) => update("category", value)} options={categories.filter(([key]) => key !== "all")} />
              <SelectField label="Status" value={draft.status} onChange={(value) => update("status", value)} options={statuses} />
              <Field label="Icon name" value={draft.icon} onChange={(value) => update("icon", value)} />
              <Field label="Feature key" value={draft.featureKey} onChange={(value) => update("featureKey", value)} />
              <Field label="Badge" value={draft.badge} onChange={(value) => update("badge", value)} />
              <Field label="Sort order" type="number" value={draft.sortOrder} onChange={(value) => update("sortOrder", Number(value))} />
              <Field label="CTA label" value={draft.ctaLabel} onChange={(value) => update("ctaLabel", value)} />
              <Field label="CTA href" value={draft.ctaHref} onChange={(value) => update("ctaHref", value)} />
            </div>
            <TextArea label="Short description" value={draft.shortDescription} onChange={(value) => update("shortDescription", value)} required />
            <TextArea label="Long description" value={draft.longDescription} onChange={(value) => update("longDescription", value)} rows={4} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea label="Benefits" value={draft.benefitsText} onChange={(value) => update("benefitsText", value)} rows={5} />
              <TextArea label="Use cases" value={draft.useCasesText} onChange={(value) => update("useCasesText", value)} rows={5} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Toggle label="Public visible" checked={draft.publicVisible} onChange={(value) => update("publicVisible", value)} />
              <Toggle label="Pricing visible" checked={draft.pricingVisible} onChange={(value) => update("pricingVisible", value)} />
              <Toggle label="Dashboard visible" checked={draft.dashboardVisible} onChange={(value) => update("dashboardVisible", value)} />
              <Toggle label="Popular" checked={draft.isPopular} onChange={(value) => update("isPopular", value)} />
              <Toggle label="Highlighted" checked={draft.isHighlighted} onChange={(value) => update("isHighlighted", value)} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="text-sm font-black text-foreground">Plan Availability Editor</h3>
              <div className="mt-4 space-y-3">
                {planSlugs.map((plan) => (
                  <div key={plan} className="rounded-xl border border-border bg-card p-3">
                    <Toggle label={plan} checked={draft.plans?.[plan]?.included} onChange={(value) => updatePlan(plan, "included", value)} />
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <Field label="Label" value={draft.plans?.[plan]?.label || ""} onChange={(value) => updatePlan(plan, "label", value)} />
                      <Field label="Limit text" value={draft.plans?.[plan]?.limitText || ""} onChange={(value) => updatePlan(plan, "limitText", value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-black uppercase tracking-wide text-primary">Preview</p>
              <h3 className="mt-2 text-xl font-black text-foreground">{draft.title || "Feature title"}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{draft.shortDescription || "Short description appears here."}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{labelFor(statuses, draft.status)}</Badge>
                <Badge>{labelFor(categories, draft.category)}</Badge>
                {draft.badge ? <Badge>{draft.badge}</Badge> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-muted">
            Cancel
          </button>
          <button disabled={saving} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {saving ? "Saving..." : "Save Feature"}
          </button>
        </div>
      </form>
    </div>
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
        {options.map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
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

function VisibilityButton({ active, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border transition disabled:opacity-50",
        active
          ? "border-primary/20 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
    </button>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-black text-primary">
      {children}
    </span>
  );
}

function labelFor(options, key) {
  return options.find(([value]) => value === key)?.[1] || key;
}
