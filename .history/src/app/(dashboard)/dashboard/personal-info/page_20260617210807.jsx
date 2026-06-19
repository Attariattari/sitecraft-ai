"use client";

import { useState, useEffect, useCallback } from "react";
import { siteCraftPersonalInfoCategories } from "@/lib/data";
import {
  getUserAccountPurpose,
  getAccountPurposeConfig,
  getDashboardCopy,
} from "@/lib/accountPurposeResolver";
import {
  User,
  Building,
  Scissors,
  ShoppingBag,
  Utensils,
  Stethoscope,
  Building2,
  Lightbulb,
  GraduationCap,
  MonitorPlay,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sitecraft_personal_info";

const ICON_MAP = {
  User,
  Building,
  Scissors,
  ShoppingBag,
  Utensils,
  Stethoscope,
  Building2,
  Lightbulb,
  GraduationCap,
  MonitorPlay,
};

// ─────────────────────────────────────────────
// FIELD RENDERER
// ─────────────────────────────────────────────
function FieldRenderer({ field, value, onChange, sectionId }) {
  const fieldPath = `${sectionId}.${field.name}`;

  const base =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200";

  if (field.type === "textarea") {
    return (
      <div className="space-y-2">
        <label className="block text-[13px] font-semibold text-foreground/80 uppercase tracking-wide">
          {field.label}
          {field.required && <span className="text-primary ml-1">*</span>}
        </label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(fieldPath, e.target.value)}
          placeholder={
            field.placeholder || `Enter ${field.label.toLowerCase()}…`
          }
          className={cn(base, "min-h-[110px] resize-y")}
        />
        {field.helperText && (
          <p className="text-[12px] text-muted-foreground">
            {field.helperText}
          </p>
        )}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-2">
        <label className="block text-[13px] font-semibold text-foreground/80 uppercase tracking-wide">
          {field.label}
          {field.required && <span className="text-primary ml-1">*</span>}
        </label>
        <select
          value={value || ""}
          onChange={(e) => onChange(fieldPath, e.target.value)}
          className={cn(base, "cursor-pointer")}
        >
          <option value="">Select {field.label}</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "switch") {
    return (
      <div className="flex items-center justify-between py-2 px-4 rounded-xl border border-border bg-muted/20">
        <label className="text-[14px] font-medium text-foreground">
          {field.label}
        </label>
        <button
          type="button"
          onClick={() => onChange(fieldPath, !value)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2",
            value ? "bg-primary" : "bg-muted-foreground/30",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
              value ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>
    );
  }

  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "url" || field.type === "image"
        ? "url"
        : field.type === "phone"
          ? "tel"
          : field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : field.type === "time"
                ? "time"
                : "text";

  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-semibold text-foreground/80 uppercase tracking-wide">
        {field.label}
        {field.required && <span className="text-primary ml-1">*</span>}
      </label>
      <input
        type={inputType}
        value={value || ""}
        onChange={(e) => onChange(fieldPath, e.target.value)}
        placeholder={
          field.placeholder ||
          (field.type === "url" || field.type === "image"
            ? "https://"
            : field.type === "email"
              ? "you@example.com"
              : `Enter ${field.label.toLowerCase()}…`)
        }
        className={base}
      />
      {field.helperText && (
        <p className="text-[12px] text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// REPEATER FIELD
// ─────────────────────────────────────────────
function RepeaterField({ field, value, onChange, sectionId }) {
  const items = Array.isArray(value) ? value : [];
  const path = `${sectionId}.${field.name}`;

  const addItem = () => {
    const blank = {};
    (field.fields || []).forEach((f) => {
      blank[f.name] = f.type === "switch" ? false : "";
    });
    onChange(path, [...items, blank]);
  };

  const removeItem = (idx) =>
    onChange(
      path,
      items.filter((_, i) => i !== idx),
    );

  const updateItem = (idx, subField, val) =>
    onChange(
      path,
      items.map((item, i) => (i !== idx ? item : { ...item, [subField]: val })),
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-foreground/80 uppercase tracking-wide">
          {field.label}
        </label>
        <span className="text-[12px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl py-8 text-center text-muted-foreground text-[14px]">
          No {field.label.toLowerCase()} added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="border border-border rounded-xl p-5 bg-muted/10 relative"
            >
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                {(field.fields || []).map((subField) => (
                  <div
                    key={subField.name}
                    className={
                      subField.type === "textarea" || subField.type === "switch"
                        ? "col-span-1 md:col-span-2"
                        : ""
                    }
                  >
                    <FieldRenderer
                      field={subField}
                      value={item[subField.name]}
                      onChange={(_, val) => updateItem(idx, subField.name, val)}
                      sectionId=""
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-3 text-[14px] font-medium text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200"
      >
        <Plus className="w-4 h-4" /> Add {field.label}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPLETION SCORE
// ─────────────────────────────────────────────
function calcCompletion(category, formData) {
  if (!category) return 0;
  let total = 0;
  let filled = 0;
  category.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === "repeater") return;
      total++;
      const v = formData?.[section.sectionId]?.[field.name];
      if (v && v !== "" && v !== false) filled++;
    });
  });
  return total === 0 ? 0 : Math.round((filled / total) * 100);
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function PersonalInfoPage() {
  const [user, setUser] = useState(null);
  const [accountPurpose, setAccountPurpose] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [score, setScore] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Load user + init data ──
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const { user: u } = await res.json();
          setUser(u);
          const purpose = getUserAccountPurpose(u);
          setAccountPurpose(purpose);

          // Load saved data from localStorage
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
              const parsed = JSON.parse(raw);
              const data = parsed.data?.[purpose] || {};
              setFormData(data);
            }
          } catch (_) {}
        } else {
          // Not authenticated — try localStorage fallback
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
              const parsed = JSON.parse(raw);
              const fallbackPurpose = parsed.selectedCategory || "portfolio";
              setAccountPurpose(fallbackPurpose);
              setFormData(parsed.data?.[fallbackPurpose] || {});
            } else {
              setAccountPurpose("portfolio");
            }
          } catch (_) {
            setAccountPurpose("portfolio");
          }
        }
      } catch (_) {
        setAccountPurpose("portfolio");
      } finally {
        setHydrated(true);
      }
    };
    init();
  }, []);

  // ── Set first section active when purpose resolves ──
  const category = accountPurpose
    ? siteCraftPersonalInfoCategories.find((c) => c.id === accountPurpose)
    : null;

  useEffect(() => {
    if (category?.sections?.length) {
      setActiveSectionId(category.sections[0].sectionId);
    }
  }, [accountPurpose]);

  // ── Recompute score ──
  useEffect(() => {
    setScore(calcCompletion(category, formData));
  }, [formData, category]);

  // ── Field change handler ──
  const handleFieldChange = useCallback((path, value) => {
    const parts = path.split(".");
    if (parts.length < 2) return;
    const [sectionId, ...rest] = parts;
    const fieldName = rest.join(".");
    setFormData((prev) => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || {}), [fieldName]: value },
    }));
  }, []);

  const getFieldValue = (sectionId, fieldName) =>
    formData?.[sectionId]?.[fieldName];

  // ── Save to localStorage ──
  const handleSave = () => {
    if (!accountPurpose) return;
    setSaving(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : { data: {} };
      const updated = {
        selectedCategory: accountPurpose,
        data: { ...(existing.data || {}), [accountPurpose]: formData },
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setToast({ type: "success", message: "Profile saved successfully!" });
    } catch (_) {
      setToast({
        type: "error",
        message: "Failed to save. Storage may be full.",
      });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3500);
  };

  // ── Reset ──
  const handleReset = () => {
    setFormData({});
    setToast({ type: "success", message: "Form cleared." });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Derived values ──
  const dashboardCopy = accountPurpose ? getDashboardCopy(accountPurpose) : {};
  const activeSection = category?.sections?.find(
    (s) => s.sectionId === activeSectionId,
  );
  const CategoryIcon = category?.icon ? ICON_MAP[category.icon] || User : User;

  const scoreColor =
    score >= 80
      ? "text-emerald-500"
      : score >= 50
        ? "text-yellow-500"
        : "text-muted-foreground";
  const scoreBg =
    score >= 80
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-yellow-500"
        : "bg-muted-foreground/30";

  // ─────────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────────
  if (!hydrated) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading your profile…
          </p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Could not load your profile category.
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="max-w-[1180px] mx-auto w-full pb-24 px-4 md:px-0">
      {/* ── PAGE HEADER ── */}
      <div className="mb-10 pt-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            {/* Purpose badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-bold px-3 py-1.5 rounded-full border border-primary/20 uppercase tracking-widest">
                <CategoryIcon className="w-3.5 h-3.5" />
                {category.label}
              </span>
            </div>
            <h1 className="text-[30px] md:text-[38px] font-black text-foreground tracking-tight leading-tight">
              {dashboardCopy.personalInfoTitle || "Personal Info"}
            </h1>
            <p className="text-muted-foreground text-[15px] mt-2 max-w-xl">
              {dashboardCopy.personalInfoSubtitle ||
                "Keep your information up to date. This powers your AI-generated websites."}
            </p>
          </div>

          {/* Save / Reset buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[15px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md shadow-primary/20 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Info"}
            </button>
          </div>
        </div>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div
          className={cn(
            "mb-6 p-4 rounded-xl flex items-center gap-3 text-[14px] font-medium border",
            toast.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-red-500/10 text-red-600 border-red-500/20",
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* ── COMPLETION BANNER ── */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
        {/* Circular SVG */}
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted/30"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 201} 201`}
              className={
                score >= 80
                  ? "stroke-emerald-500"
                  : score >= 50
                    ? "stroke-yellow-500"
                    : "stroke-muted-foreground/40"
              }
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-[16px] font-black", scoreColor)}>
              {score}%
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h3 className="text-[16px] font-bold text-foreground">
              Profile Completion
            </h3>
            <span className={cn("text-[13px] font-semibold", scoreColor)}>
              {score >= 80
                ? "🎉 Great! AI has enough data."
                : score >= 50
                  ? "📈 Good Progress"
                  : "🚀 Just Getting Started"}
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground mb-3">
            Fill in your <strong>{category.label}</strong> details so SiteCraft
            AI can generate perfectly tailored websites.
          </p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                scoreBg,
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* AI hint */}
        <div className="hidden xl:flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 max-w-[200px]">
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[12px] text-foreground/80 font-medium leading-snug">
            The more you fill in, the better your AI website will be.
          </p>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── SECTION NAV (Sticky Sidebar) ── */}
        <aside className="w-full lg:w-56 xl:w-64 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-3 lg:sticky lg:top-6">
            <p className="hidden lg:block text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-1 pb-3">
              Sections
            </p>

            {/* Mobile: horizontal scroll */}
            <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
              {category.sections.map((section) => {
                const isActive = activeSectionId === section.sectionId;
                const sectionData = formData[section.sectionId] || {};
                const hasData = Object.values(sectionData).some(
                  (v) =>
                    v !== "" &&
                    v !== false &&
                    v !== null &&
                    v !== undefined &&
                    (!Array.isArray(v) || v.length > 0),
                );

                return (
                  <button
                    key={section.sectionId}
                    type="button"
                    onClick={() => setActiveSectionId(section.sectionId)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 text-left whitespace-nowrap lg:whitespace-normal w-auto lg:w-full",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0 transition-colors",
                        isActive
                          ? "bg-primary"
                          : hasData
                            ? "bg-emerald-500"
                            : "bg-muted-foreground/30",
                      )}
                    />
                    <span className="truncate">{section.title}</span>
                    {hasData && !isActive && (
                      <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Save shortcut */}
            <div className="hidden lg:block mt-4 pt-4 border-t border-border">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-[13px] font-bold transition-all duration-200"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving…" : "Save All"}
              </button>
            </div>
          </div>
        </aside>

        {/* ── ACTIVE SECTION FORM ── */}
        <div className="flex-1 min-w-0">
          {activeSection ? (
            <div
              key={activeSection.sectionId}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-7 pb-5 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <CategoryIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-foreground">
                    {activeSection.title}
                  </h2>
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    {activeSection.description ||
                      `Fill in your ${activeSection.title.toLowerCase()} details.`}
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-6">
                {activeSection.fields.map((field) => {
                  if (field.type === "repeater") {
                    return (
                      <RepeaterField
                        key={field.name}
                        field={field}
                        value={
                          formData?.[activeSection.sectionId]?.[field.name]
                        }
                        onChange={handleFieldChange}
                        sectionId={activeSection.sectionId}
                      />
                    );
                  }

                  const isFullWidth =
                    field.type === "textarea" ||
                    field.type === "switch" ||
                    field.fullWidth;

                  return (
                    <div
                      key={field.name}
                      className={isFullWidth ? "col-span-2" : ""}
                    >
                      <FieldRenderer
                        field={field}
                        value={getFieldValue(
                          activeSection.sectionId,
                          field.name,
                        )}
                        onChange={handleFieldChange}
                        sectionId={activeSection.sectionId}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Section bottom nav */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                {/* Prev */}
                {(() => {
                  const idx = category.sections.findIndex(
                    (s) => s.sectionId === activeSection.sectionId,
                  );
                  const prev = category.sections[idx - 1];
                  const next = category.sections[idx + 1];
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          prev && setActiveSectionId(prev.sectionId)
                        }
                        disabled={!prev}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-muted-foreground hover:text-foreground border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        ← Previous
                      </button>

                      {next ? (
                        <button
                          type="button"
                          onClick={() => setActiveSectionId(next.sectionId)}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm"
                        >
                          Next: {next.title}{" "}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSave}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
                        >
                          <Save className="w-4 h-4" /> Save Profile
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 flex items-center justify-center text-muted-foreground">
              Select a section from the left to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
