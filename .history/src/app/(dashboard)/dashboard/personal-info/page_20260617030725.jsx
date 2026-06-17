"use client";

import { useState, useEffect, useCallback } from "react";
import { siteCraftPersonalInfoCategories } from "@/lib/data";
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
  ChevronRight,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw,
  Info,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CategorySelector } from "@/components/dashboard/personal-info/CategorySelector";

const STORAGE_KEY = "sitecraft_personal_info";

// Icon map for categories
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

const BADGE_COLORS = {
  Popular: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  Standard: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  Niche: "bg-purple-500/15 text-purple-500 border-purple-500/20",
  New: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  Hot: "bg-red-500/15 text-red-500 border-red-500/20",
};

// ——————————————————————————————————————————
// DYNAMIC FIELD RENDERER
// ——————————————————————————————————————————
function FieldRenderer({ field, value, onChange, prefix = "" }) {
  const fieldName = prefix ? `${prefix}.${field.name}` : field.name;
  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all min-h-[44px]";

  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        <label className="block text-[14px] font-medium text-foreground">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(fieldName, e.target.value)}
          placeholder={
            field.placeholder || `Enter ${field.label.toLowerCase()}...`
          }
          className={cn(inputClass, "min-h-[100px] resize-y")}
        />
        {field.helperText && (
          <p className="text-[13px] text-muted-foreground">
            {field.helperText}
          </p>
        )}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-1.5">
        <label className="block text-[14px] font-medium text-foreground">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={value || ""}
          onChange={(e) => onChange(fieldName, e.target.value)}
          className={inputClass}
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
      <div className="flex items-center justify-between py-1">
        <label className="text-[14px] font-medium text-foreground">
          {field.label}
        </label>
        <button
          type="button"
          onClick={() => onChange(fieldName, !value)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2",
            value ? "bg-emerald-500" : "bg-muted-foreground/30",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
              value ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div className="space-y-1.5">
        <label className="block text-[14px] font-medium text-foreground">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(fieldName, e.target.value)}
          placeholder={field.placeholder || "0"}
          className={inputClass}
        />
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div className="space-y-1.5">
        <label className="block text-[14px] font-medium text-foreground">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(fieldName, e.target.value)}
          className={inputClass}
        />
      </div>
    );
  }

  if (field.type === "time") {
    return (
      <div className="space-y-1.5">
        <label className="block text-[14px] font-medium text-foreground">
          {field.label}
        </label>
        <input
          type="time"
          value={value || ""}
          onChange={(e) => onChange(fieldName, e.target.value)}
          className={inputClass}
        />
      </div>
    );
  }

  // Default: text, email, phone, url, image
  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "url" || field.type === "image"
        ? "url"
        : field.type === "phone"
          ? "tel"
          : "text";

  return (
    <div className="space-y-1.5">
      <label className="block text-[14px] font-medium text-foreground">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={inputType}
        value={value || ""}
        onChange={(e) => onChange(fieldName, e.target.value)}
        placeholder={
          field.placeholder ||
          (field.type === "url" || field.type === "image"
            ? "https://"
            : field.type === "email"
              ? "you@example.com"
              : `Enter ${field.label.toLowerCase()}...`)
        }
        className={inputClass}
      />
      {field.helperText && (
        <p className="text-[13px] text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  );
}

// ——————————————————————————————————————————
// REPEATER FIELD
// ——————————————————————————————————————————
function RepeaterField({ field, value, onChange, sectionKey }) {
  const items = Array.isArray(value) ? value : [];

  const addItem = () => {
    const newItem = {};
    (field.fields || []).forEach((f) => {
      newItem[f.name] = f.type === "switch" ? false : "";
    });
    onChange(sectionKey ? `${sectionKey}.${field.name}` : field.name, [
      ...items,
      newItem,
    ]);
  };

  const removeItem = (idx) => {
    const updated = items.filter((_, i) => i !== idx);
    onChange(sectionKey ? `${sectionKey}.${field.name}` : field.name, updated);
  };

  const updateItem = (idx, subField, val) => {
    const updated = items.map((item, i) => {
      if (i !== idx) return item;
      return { ...item, [subField]: val };
    });
    onChange(sectionKey ? `${sectionKey}.${field.name}` : field.name, updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[14px] font-semibold text-foreground">
          {field.label}
        </label>
        <span className="text-[13px] text-muted-foreground">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg py-6 text-center text-muted-foreground text-[14px]">
          No {field.label.toLowerCase()} added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="border border-border rounded-lg p-4 bg-muted/20 relative"
            >
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                {(field.fields || []).map((subField) => {
                  const isFullWidth =
                    subField.type === "textarea" || subField.type === "switch";
                  return (
                    <div
                      key={subField.name}
                      className={isFullWidth ? "col-span-1 md:col-span-2" : ""}
                    >
                      <FieldRenderer
                        field={subField}
                        value={item[subField.name]}
                        onChange={(_, val) =>
                          updateItem(idx, subField.name, val)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-3 text-[14px] font-medium text-muted-foreground hover:border-emerald-500/50 hover:text-emerald-600 hover:bg-emerald-500/5 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add {field.label}
      </button>
    </div>
  );
}

// ——————————————————————————————————————————
// COMPLETION SCORE CALCULATOR
// ——————————————————————————————————————————
function calcCompletion(category, formData) {
  if (!category) return 0;
  let total = 0;
  let filled = 0;
  category.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === "repeater") return; // skip repeaters for score
      total++;
      const sVal = formData?.[section.sectionId]?.[field.name];
      if (sVal && sVal !== "" && sVal !== false) filled++;
    });
  });
  return total === 0 ? 0 : Math.round((filled / total) * 100);
}

// ——————————————————————————————————————————
// MAIN PAGE
// ——————————————————————————————————————————
export default function PersonalInfoPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [score, setScore] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.categoryId) setSelectedCategoryId(parsed.categoryId);
        if (parsed.data) setFormData(parsed.data);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Set first section active when category changes
  useEffect(() => {
    if (!selectedCategoryId) return;
    const cat = siteCraftPersonalInfoCategories.find(
      (c) => c.id === selectedCategoryId,
    );
    if (cat && cat.sections.length > 0) {
      setActiveSectionId(cat.sections[0].sectionId);
    }
  }, [selectedCategoryId]);

  // Recompute score whenever form data changes
  useEffect(() => {
    if (!selectedCategoryId) {
      setScore(0);
      return;
    }
    const cat = siteCraftPersonalInfoCategories.find(
      (c) => c.id === selectedCategoryId,
    );
    setScore(calcCompletion(cat, formData));
  }, [selectedCategoryId, formData]);

  const selectedCategory = siteCraftPersonalInfoCategories.find(
    (c) => c.id === selectedCategoryId,
  );

  const activeSection = selectedCategory?.sections.find(
    (s) => s.sectionId === activeSectionId,
  );

  // Deep set a value using dot-path like "section.field"
  const handleFieldChange = useCallback((path, value) => {
    const parts = path.split(".");
    if (parts.length < 2) return;
    const sectionId = parts[0];
    const fieldName = parts.slice(1).join(".");

    setFormData((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [fieldName]: value,
      },
    }));
  }, []);

  const getFieldValue = (sectionId, fieldName) => {
    return formData?.[sectionId]?.[fieldName];
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          categoryId: selectedCategoryId,
          data: formData,
          savedAt: new Date().toISOString(),
        }),
      );
      setToast({
        type: "success",
        message: "Personal Info saved successfully!",
      });
    } catch {
      setToast({
        type: "error",
        message: "Failed to save. Storage may be full.",
      });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const resetAll = () => {
    setFormData({});
    setSelectedCategoryId(null);
    setActiveSectionId(null);
    localStorage.removeItem(STORAGE_KEY);
    setToast({ type: "success", message: "Personal Info cleared." });
    setTimeout(() => setToast(null), 2500);
  };

  if (!hydrated) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ——— PAGE COMPONENT ———
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

  return (
    <div className="max-w-[1200px] mx-auto w-full pb-20">
      {/* Top Page Header (Always Visible) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            SiteCraft AI
          </span>
        </div>
        <h1 className="text-[30px] md:text-[38px] font-black text-foreground tracking-tight leading-tight">
          Personal Info
        </h1>
        <p className="text-muted-foreground text-[15px] mt-2 max-w-xl">
          Your saved info powers AI-generated websites. Pick your website
          category to get started.
        </p>
      </div>

      {toast && (
        <div
          className={cn(
            "mb-6 p-4 rounded-lg flex items-center gap-3 text-[14px] font-medium",
            toast.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-red-500/10 text-red-600 border border-red-500/20",
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

      {/* Category Selector Component */}
      <CategorySelector
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* ——— DYNAMIC FORM ——— */}
      {selectedCategoryId && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Dynamic Form Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pt-8 border-t border-border">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-[28px] md:text-[34px] font-bold text-foreground tracking-tight">
                  {selectedCategory?.label}{" "}
                  <span className="text-muted-foreground font-normal text-[22px]">
                    Info
                  </span>
                </h2>
                <p className="text-[14px] text-muted-foreground mt-0.5">
                  {selectedCategory?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                type="button"
                onClick={saveToLocalStorage}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[15px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-md shadow-primary/20"
              >
                <Save className="w-4 h-4" />
                Save Info
              </button>
            </div>
          </div>

          {/* Completion Score */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
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
                <span className={cn("text-[16px] font-bold", scoreColor)}>
                  {score}%
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[16px] font-bold text-foreground">
                  Profile Completion
                </h3>
                <span className={cn("text-[13px] font-semibold", scoreColor)}>
                  {score >= 80
                    ? "Great!"
                    : score >= 50
                      ? "Good Progress"
                      : "Just Started"}
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground mb-3">
                Fill in your {selectedCategory?.label} details so SiteCraft AI
                can generate accurate, detailed websites for you.
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
          </div>

          {/* Main 2-col layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Section Nav */}
            <div className="w-full lg:w-60 shrink-0">
              <div className="bg-card border border-border rounded-2xl p-3 lg:sticky lg:top-6 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                <p className="hidden lg:block text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 pt-1 pb-2">
                  Sections
                </p>
                {selectedCategory?.sections.map((section) => {
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
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all text-left whitespace-nowrap lg:whitespace-normal shrink-0",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          isActive
                            ? "bg-primary"
                            : hasData
                              ? "bg-primary/50"
                              : "bg-border",
                        )}
                      />
                      {section.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            {activeSection && (
              <div className="flex-1 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm min-h-[400px]">
                <div className="mb-6 pb-5 border-b border-border">
                  <h2 className="text-[22px] md:text-[24px] font-bold text-foreground">
                    {activeSection.title}
                  </h2>
                  {activeSection.description && (
                    <p className="text-[14px] text-muted-foreground mt-1">
                      {activeSection.description}
                    </p>
                  )}
                </div>

                <div className="space-y-6">
                  {/* CASE 1: Whole section is a repeater */}
                  {activeSection.type === "repeater" ? (
                    <RepeaterField
                      field={{
                        name: activeSection.sectionId,
                        label: activeSection.title,
                        fields: activeSection.fields,
                      }}
                      value={formData?.[activeSection.sectionId]?.items}
                      onChange={(path, value) => {
                        setFormData((prev) => ({
                          ...prev,
                          [activeSection.sectionId]: {
                            ...(prev[activeSection.sectionId] || {}),
                            items: value,
                          },
                        }));
                      }}
                      sectionKey={activeSection.sectionId}
                    />
                  ) : (
                    /* CASE 2: Normal section with individual fields */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeSection.fields.map((field) => {
                        if (field.type === "repeater") {
                          return (
                            <div
                              key={field.name}
                              className="col-span-1 md:col-span-2"
                            >
                              <RepeaterField
                                field={field}
                                value={
                                  formData?.[activeSection.sectionId]?.[
                                    field.name
                                  ]
                                }
                                onChange={handleFieldChange}
                                sectionKey={activeSection.sectionId}
                              />
                            </div>
                          );
                        }

                        const isFullWidth =
                          field.type === "textarea" ||
                          field.type === "switch" ||
                          field.type === "tags";

                        return (
                          <div
                            key={field.name}
                            className={
                              isFullWidth ? "col-span-1 md:col-span-2" : ""
                            }
                          >
                            <FieldRenderer
                              field={field}
                              value={getFieldValue(
                                activeSection.sectionId,
                                field.name,
                              )}
                              onChange={handleFieldChange}
                              prefix={activeSection.sectionId}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Section navigation */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                  {(() => {
                    const sections = selectedCategory?.sections || [];
                    const currentIdx = sections.findIndex(
                      (s) => s.sectionId === activeSectionId,
                    );
                    const prevSection = sections[currentIdx - 1];
                    const nextSection = sections[currentIdx + 1];
                    return (
                      <>
                        <button
                          type="button"
                          disabled={!prevSection}
                          onClick={() =>
                            prevSection &&
                            setActiveSectionId(prevSection.sectionId)
                          }
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-medium border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          {prevSection ? prevSection.title : "Previous"}
                        </button>
                        {nextSection ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSectionId(nextSection.sectionId)
                            }
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-medium bg-foreground/5 hover:bg-foreground/10 border border-border transition-colors"
                          >
                            {nextSection.title}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={saveToLocalStorage}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Save Personal Info
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
