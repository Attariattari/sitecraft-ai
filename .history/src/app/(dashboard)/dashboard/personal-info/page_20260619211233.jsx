"use client";

import { useState, useEffect, useCallback } from "react";
import { siteCraftPersonalInfoCategories } from "@/lib/data";
import {
  getAccountPurposeConfig,
  getDashboardCopy,
} from "@/lib/accountPurposeResolver";
import { getPurposeLimitByPlan } from "@/lib/purposeLimits";
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
  Globe,
  Phone,
  Mail,
  MapPin,
  Settings2,
  Layout,
  LayoutPanelLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

const SHARED_FIELDS = [
  { name: "fullName", label: "Full Name", type: "text", required: true },
  { name: "displayName", label: "Display Name / Brand Name", type: "text" },
  { name: "email", label: "Primary Email", type: "email" },
  { name: "phone", label: "Phone Number", type: "phone" },
  { name: "whatsapp", label: "WhatsApp Number", type: "phone" },
  { name: "location", label: "Address / Location", type: "text" },
  { name: "websiteUrl", label: "Existing Website", type: "url" },
  { name: "bio", label: "Short Bio / Company Slogan", type: "textarea" },
  { name: "profileImage", label: "Profile Image URL", type: "url" },
  { name: "brandLogo", label: "Brand Logo URL", type: "url" },
];

const SOCIAL_LINKS = [
  "linkedin",
  "github",
  "facebook",
  "instagram",
  "x",
  "youtube",
  "tiktok",
];

// ─────────────────────────────────────────────
// COMPONENT: FIELD RENDERER
// ─────────────────────────────────────────────
function FieldRenderer({ field, value, onChange }) {
  const base =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200";

  if (field.type === "textarea") {
    return (
      <div className="space-y-2">
        <label className="block text-[13px] font-semibold text-foreground/80 uppercase tracking-wide">
          {field.label}{" "}
          {field.required && <span className="text-primary">*</span>}
        </label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          className={cn(base, "min-h-[100px] resize-y")}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-2">
        <label className="block text-[13px] font-semibold text-foreground/80 uppercase tracking-wide">
          {field.label}{" "}
          {field.required && <span className="text-primary">*</span>}
        </label>
        <select
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
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
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5 group hover:bg-muted/10 transition-colors">
        <label className="text-[13px] font-semibold text-foreground/80 uppercase tracking-wide cursor-pointer">
          {field.label}
        </label>
        <button
          onClick={() => onChange(field.name, !value)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
            value ? "bg-primary" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
              value ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>
    );
  }

  if (field.type === "tags") {
    return (
      <div className="space-y-2">
        <label className="block text-[13px] font-semibold text-foreground/80 uppercase tracking-wide">
          {field.label} (Comma separated)
        </label>
        <input
          type="text"
          value={Array.isArray(value) ? value.join(", ") : value || ""}
          onChange={(e) => {
            const val = e.target.value;
            const tags = val
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            onChange(field.name, tags);
          }}
          placeholder="e.g. React, Next.js, Tailwind"
          className={base}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-semibold text-foreground/80 uppercase tracking-wide">
        {field.label}{" "}
        {field.required && <span className="text-primary">*</span>}
      </label>
      <input
        type={
          field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : field.type === "time"
                ? "time"
                : field.type === "email"
                  ? "email"
                  : field.type === "url"
                    ? "url"
                    : field.type === "phone"
                      ? "tel"
                      : "text"
        }
        value={value || ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={`Enter ${field.label.toLowerCase()}...`}
        className={base}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT: REPEATER FIELD
// ─────────────────────────────────────────────
function RepeaterField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  const addItem = () => {
    const blank = {};
    (field.fields || []).forEach(
      (f) => (blank[f.name] = f.type === "switch" ? false : ""),
    );
    onChange(field.name, [...items, blank]);
  };

  const removeItem = (idx) =>
    onChange(
      field.name,
      items.filter((_, i) => i !== idx),
    );

  const updateItem = (idx, subField, val) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [subField]: val };
    onChange(field.name, newItems);
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h4 className="text-sm font-bold text-foreground/70 uppercase tracking-tight">
          {field.label}
        </h4>
        <span className="text-[11px] font-bold bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
          {items.length} items
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-6 border border-border rounded-xl bg-card/50 relative group shadow-sm hover:shadow-md transition-all"
          >
            <button
              onClick={() => removeItem(idx)}
              className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(field.fields || []).map((f) => (
                <div
                  key={f.name}
                  className={
                    f.type === "textarea" || f.type === "repeater"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  <FieldRenderer
                    field={f}
                    value={item[f.name]}
                    onChange={(fName, val) => updateItem(idx, fName, val)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-4 text-sm font-bold text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
      >
        <Plus className="w-4 h-4" /> Add New {field.label}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function PersonalInfoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("shared"); // "shared" or purpose ID
  const [activePurposeSection, setActivePurposeSection] = useState(null);

  const [sharedData, setSharedData] = useState({});
  const [purposeData, setPurposeData] = useState({});
  const [socialLinks, setSocialLinks] = useState({});

  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meData.success || !meData.authenticated) {
          router.replace("/login");
          return;
        }
        setUser(meData.user);

        const res = await fetch("/api/user/personal-info");
        const data = await res.json();
        if (data.success) {
          setSharedData(data.sharedInfo || {});
          setPurposeData(data.purposeInfo || {});
          setSocialLinks(data.sharedInfo?.socialLinks || {});
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const payload = {
        sharedInfo: { ...sharedData, socialLinks },
      };

      if (activeTab !== "shared") {
        payload.activePurpose = activeTab;
        payload.purposeInfo = purposeData[activeTab] || {};
      }

      const res = await fetch("/api/user/personal-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setToast({
          type: "success",
          message: "All changes saved successfully!",
        });
      } else {
        setToast({
          type: "error",
          message: result.message || "Failed to save.",
        });
      }
    } catch (err) {
      setToast({ type: "error", message: "A server error occurred." });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleSharedChange = (name, val) =>
    setSharedData((prev) => ({ ...prev, [name]: val }));
  const handleSocialChange = (name, val) =>
    setSocialLinks((prev) => ({ ...prev, [name]: val }));
  const handlePurposeChange = (purposeId, fieldName, val) => {
    setPurposeData((prev) => ({
      ...prev,
      [purposeId]: { ...(prev[purposeId] || {}), [fieldName]: val },
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground font-medium">
          Loading Personal Info System...
        </p>
      </div>
    );
  }

  const selectedPurposes = user?.selectedPurposes || [];
  const activePurposeConfig =
    activeTab !== "shared" ? getAccountPurposeConfig(activeTab) : null;

  // Identify fields to exclude from purpose-specific form (they are in sharedInfo)
  const sharedFieldNames = [
    "fullName",
    "displayName",
    "email",
    "phone",
    "whatsapp",
    "location",
    "profileImage",
    "logo",
    "brandLogo",
    "aboutMe",
    "shortBio",
    "bio",
    "website",
    "address",
  ];

  if (
    activePurposeConfig &&
    !activePurposeSection &&
    activePurposeConfig.sections?.length > 0
  ) {
    setActivePurposeSection(activePurposeConfig.sections[0].sectionId);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 py-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Personal Info System
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your shared brand identity and specialized website purposes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={cn(
            "mb-8 p-4 rounded-xl flex items-center gap-3 font-bold border animate-in fade-in slide-in-from-top-2",
            toast.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-red-500/10 text-red-600 border-red-500/20",
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {toast.message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR TABS */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-2 sticky top-6">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setActiveTab("shared")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === "shared"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Settings2 className="w-5 h-5" />
                Global Shared Info
              </button>

              <div className="my-2 px-4 py-2">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Selected Purposes
                </span>
              </div>

              {selectedPurposes.map((pid) => {
                const config = getAccountPurposeConfig(pid);
                const IsActive = activeTab === pid;
                const Icon = ICON_MAP[config.icon] || Layout;
                return (
                  <button
                    key={pid}
                    onClick={() => {
                      setActiveTab(pid);
                      if (config.sections?.length > 0) {
                        setActivePurposeSection(config.sections[0].sectionId);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                      IsActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {config.label}
                    {user?.primaryPurpose === pid && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => router.push("/auth/account-purpose")}
                className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-all border border-dashed border-primary/20"
              >
                <Plus className="w-4 h-4" />
                Manage Purposes
              </button>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Plan Limit
                </span>
                <span className="text-[10px] font-black text-primary uppercase">
                  {user?.plan}
                </span>
              </div>
              <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{
                    width: `${(selectedPurposes.length / getPurposeLimitByPlan(user?.plan)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                {selectedPurposes.length} of {getPurposeLimitByPlan(user?.plan)}{" "}
                purposes used.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {activeTab === "shared" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* GLOBAL SHARED FIELDS */}
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-muted/30 p-6 border-b border-border">
                  <h3 className="text-xl font-bold text-foreground">
                    Shared Brand Identity
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    These fields are used across all your website categories to
                    maintain brand consistency.
                  </p>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SHARED_FIELDS.map((f) => (
                    <div
                      key={f.name}
                      className={f.type === "textarea" ? "md:col-span-2" : ""}
                    >
                      <FieldRenderer
                        field={f}
                        value={sharedData[f.name]}
                        onChange={handleSharedChange}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SOCIAL LINKS */}
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-muted/30 p-6 border-b border-border">
                  <h3 className="text-xl font-bold text-foreground">
                    Global Social Presence
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect your profiles once, use them everywhere.
                  </p>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SOCIAL_LINKS.map((s) => (
                    <div key={s} className="space-y-2">
                      <label className="block text-[13px] font-semibold text-foreground/80 uppercase tracking-wide capitalize">
                        {s}
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <Globe className="w-4 h-4" />
                        </div>
                        <input
                          type="url"
                          placeholder={`https://${s}.com/your-profile`}
                          value={socialLinks[s] || ""}
                          onChange={(e) =>
                            handleSocialChange(s, e.target.value)
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-[14px] focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-primary/5 p-6 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                      {(() => {
                        const Icon =
                          ICON_MAP[activePurposeConfig?.icon] || Layout;
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {activePurposeConfig?.label} Specific Details
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Unique information required for your{" "}
                        {activePurposeConfig?.label.toLowerCase()} website.
                      </p>
                    </div>
                  </div>
                  {user?.primaryPurpose === activeTab && (
                    <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-tighter shadow-sm">
                      PRIMARY PURPOSE
                    </span>
                  )}
                </div>

                {activePurposeConfig?.sections?.length > 0 && (
                  <div className="border-b border-border overflow-x-auto">
                    <div className="flex p-2 gap-2">
                      {activePurposeConfig.sections.map((s) => (
                        <button
                          key={s.sectionId}
                          onClick={() => setActivePurposeSection(s.sectionId)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                            activePurposeSection === s.sectionId
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {activePurposeConfig?.sections
                    ?.find((s) => s.sectionId === activePurposeSection)
                    ?.fields.map((field) => {
                      // Skip shared fields
                      if (sharedFieldNames.includes(field.name)) return null;

                      if (field.type === "repeater") {
                        return (
                          <RepeaterField
                            key={field.name}
                            field={field}
                            value={purposeData[activeTab]?.[field.name]}
                            onChange={(fName, val) =>
                              handlePurposeChange(activeTab, fName, val)
                            }
                          />
                        );
                      }

                      return (
                        <div key={field.name} className="mb-6">
                          <FieldRenderer
                            field={field}
                            value={purposeData[activeTab]?.[field.name]}
                            onChange={(fName, val) =>
                              handlePurposeChange(activeTab, fName, val)
                            }
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-8 h-8 text-emerald-500" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Pro-Tip for {activePurposeConfig?.label}
                    </h4>
                    <p className="text-[13px] text-muted-foreground font-medium">
                      Entering specialized data here allows SiteCraft AI to
                      create much higher quality content tailored specifically
                      for {activePurposeConfig?.label.toLowerCase()} use-cases.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Category Info
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
