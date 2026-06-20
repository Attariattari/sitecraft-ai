"use client";

import { useState, useEffect, useCallback } from "react";
import { siteCraftPersonalInfoCategories } from "@/lib/data";
import {
  getAccountPurposeConfig,
  getDashboardCopy,
  getUserSelectedPurposes,
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
  ChevronDown,
  ChevronUp,
  Globe,
  Phone,
  Mail,
  MapPin,
  Settings2,
  Layout,
  LayoutPanelLeft,
  Loader2,
  Briefcase,
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

const SOCIAL_LINKS = [
  "linkedin",
  "github",
  "facebook",
  "instagram",
  "x",
  "youtube",
  "tiktok",
];

const SHARED_SECTIONS_CONFIG = [
  {
    id: "identity",
    title: "Primary Brand Identity",
    description:
      "Your official name, logo, and professional bio used globally.",
    icon: User,
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "displayName", label: "Display Name / Brand Name", type: "text" },
      { name: "profileImage", label: "Profile Image URL", type: "url" },
      { name: "brandLogo", label: "Brand Logo URL", type: "url" },
      { name: "bio", label: "Short Bio / Company Slogan", type: "textarea" },
    ],
  },
  {
    id: "contact",
    title: "Global Contact Details",
    description: "Public contact information displayed on your websites.",
    icon: Phone,
    fields: [
      { name: "email", label: "Public Email", type: "email" },
      { name: "phone", label: "Phone Number", type: "phone" },
      { name: "whatsapp", label: "WhatsApp Number", type: "phone" },
      { name: "location", label: "Business Location", type: "text" },
      { name: "websiteUrl", label: "Existing Website", type: "url" },
      { name: "address", label: "Physical Address", type: "textarea" },
    ],
  },
  {
    id: "social",
    title: "Social Presence",
    description: "Links to your social media profiles.",
    icon: Globe,
    isSocial: true,
  },
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
// COMPONENT: ACCORDION SECTION
// ─────────────────────────────────────────────
function AccordionSection({
  id,
  title,
  description,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-all duration-300 mb-4",
        isOpen ? "ring-2 ring-primary/20 bg-background" : "hover:bg-muted/30",
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300",
              isOpen
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground leading-none">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center bg-muted transition-all duration-300",
            isOpen
              ? "bg-primary/10 text-primary rotate-180"
              : "text-muted-foreground",
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <div
        className={cn(
          "grid transition-all duration-500 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-8 pt-0 border-t border-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
            {children}
          </div>
        </div>
      </div>
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
  const [activeTab, setActiveTab] = useState(null); // Purpose ID
  const [expandedSection, setExpandedSection] = useState("identity");

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

        const selected = getUserSelectedPurposes(meData.user);
        if (selected.length > 0 && !activeTab) {
          setActiveTab(selected[0]);
        }

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

  const selectedPurposes = getUserSelectedPurposes(user);
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

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 py-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Personal Info System
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your professional data for AI website generation.
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
            Save All Changes
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
        {/* SIDEBAR PURPOSES */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-2 sticky top-6">
            <div className="flex flex-col gap-1">
              <div className="px-4 py-2 mb-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Active Purposes
                </span>
              </div>

              {selectedPurposes.map((pid) => {
                const config = getAccountPurposeConfig(pid);
                const IsActive = activeTab === pid;
                const Icon = ICON_MAP[config.icon] || Layout;
                return (
                  <button
                    key={pid}
                    onClick={() => setActiveTab(pid)}
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
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => router.push("/auth/account-purpose")}
                className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-all border border-dashed border-primary/30"
              >
                <Plus className="w-4 h-4" />
                Add More Purposes
              </button>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Plan Utilization
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
                purposes.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          <div className="space-y-2 mb-8 border-b border-border/50 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                {(() => {
                  const Icon = ICON_MAP[activePurposeConfig?.icon] || Layout;
                  return <Icon className="w-5 h-5" />;
                })()}
              </div>
              <h2 className="text-2xl font-black text-foreground">
                {activePurposeConfig?.label} Setup
              </h2>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Information in this tab is specifically optimized for your
              <span className="text-primary font-bold mx-1">
                {activePurposeConfig?.label.toLowerCase()}
              </span>
              websites.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* SHARED SECTIONS */}
            {SHARED_SECTIONS_CONFIG.map((sec) => (
              <AccordionSection
                key={sec.id}
                id={sec.id}
                title={sec.title}
                description={sec.description}
                icon={sec.icon}
                isOpen={expandedSection === sec.id}
                onToggle={() =>
                  setExpandedSection(expandedSection === sec.id ? null : sec.id)
                }
              >
                {sec.isSocial ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SOCIAL_LINKS.map((s) => (
                      <div key={s} className="space-y-2">
                        <label className="block text-[13px] font-bold text-foreground/80 uppercase tracking-widest leading-none">
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
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-[14px] focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sec.fields.map((f) => (
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
                )}
              </AccordionSection>
            ))}

            {/* PURPOSE SECTIONS */}
            {activePurposeConfig?.sections?.map((sec) => (
              <AccordionSection
                key={sec.sectionId}
                id={sec.sectionId}
                title={sec.title}
                description={
                  sec.description ||
                  `Specialized details for your ${activePurposeConfig.label.toLowerCase()} site.`
                }
                icon={Briefcase}
                isOpen={expandedSection === sec.sectionId}
                onToggle={() =>
                  setExpandedSection(
                    expandedSection === sec.sectionId ? null : sec.sectionId,
                  )
                }
              >
                <div className="space-y-6">
                  {sec.fields.map((field) => {
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
                      <FieldRenderer
                        key={field.name}
                        field={field}
                        value={purposeData[activeTab]?.[field.name]}
                        onChange={(fName, val) =>
                          handlePurposeChange(activeTab, fName, val)
                        }
                      />
                    );
                  })}
                </div>
              </AccordionSection>
            ))}
          </div>

          <div className="mt-12 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-black text-foreground">
                  Ready to Generate?
                </h4>
                <p className="text-sm text-muted-foreground font-medium max-w-md">
                  Once you save your changes, SiteCraft AI will use this data to
                  create a high-converting{" "}
                  {activePurposeConfig?.label.toLowerCase()} website for you.
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl text-base font-black shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-3"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
