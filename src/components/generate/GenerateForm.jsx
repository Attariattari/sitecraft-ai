"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, CheckCircle2, Globe, LayoutTemplate, Lock, Palette, Sparkles } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { toast } from "@/components/dashboard/Toast";

const steps = ["Basics", "Template", "Theme", "Personal Info", "Review"];
const defaultPages = ["home", "about", "skills", "projects", "services", "contact"];

function slugPreview(value) {
  return String(value || "my-website")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function GenerateForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [themes, setThemes] = useState([]);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "portfolio",
    targetAudience: "",
    primaryGoal: "",
    templateSlug: searchParams.get("template") || "",
    themeSlug: "",
    selectedPages: defaultPages,
    contactVisibility: { email: true, phone: false, location: false, socialLinks: true },
    seo: { metaTitle: "", metaDescription: "", keywords: [] },
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [meRes, catRes, infoRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/categories/available?context=generate"),
          fetch("/api/user/personal-info"),
        ]);
        if (meRes.ok) {
          const me = await meRes.json();
          setUser(me.user);
        }
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.categories || []);
          const first = catData.categories?.find((category) => category.isSelectable)?.slug || "portfolio";
          setForm((prev) => ({ ...prev, category: prev.category || first }));
        }
        const infoData = await infoRes.json();
        if (infoData.success) setPersonalInfo(infoData);
      } catch {
        toast("Generation setup could not load.", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadTemplatesAndThemes() {
      const [templateRes, themeRes] = await Promise.all([
        fetch(`/api/templates?status=active&category=${encodeURIComponent(form.category)}`),
        fetch("/api/themes/available?context=generate&includeLocked=true"),
      ]);
      const templateData = await templateRes.json();
      const themeData = await themeRes.json();
      if (templateData.success) {
        setTemplates(templateData.templates || []);
        const firstAllowed = templateData.templates?.find((template) => !template.locked);
        setForm((prev) => ({
          ...prev,
          templateSlug: prev.templateSlug && templateData.templates?.some((template) => template.slug === prev.templateSlug && !template.locked)
            ? prev.templateSlug
            : firstAllowed?.slug || "",
          selectedPages: firstAllowed?.pages?.filter((page) => !page.optional).map((page) => page.slug) || prev.selectedPages,
        }));
      }
      if (themeData.success) {
        setThemes(themeData.themes || []);
        const firstAllowed = themeData.themes?.find((theme) => !theme.locked);
        setForm((prev) => ({
          ...prev,
          themeSlug: prev.themeSlug && themeData.themes?.some((theme) => (theme.themeId === prev.themeSlug || theme.slug === prev.themeSlug) && !theme.locked)
            ? prev.themeSlug
            : firstAllowed?.themeId || firstAllowed?.slug || "",
        }));
      }
    }
    if (form.category) loadTemplatesAndThemes();
  }, [form.category]);

  const selectedTemplate = templates.find((template) => template.slug === form.templateSlug);
  const selectedTheme = themes.find((theme) => theme.themeId === form.themeSlug || theme.slug === form.themeSlug);
  const requiredStatus = useMemo(() => {
    const shared = personalInfo?.sharedInfo || {};
    const purpose = personalInfo?.purposeInfo?.[form.category] || {};
    return [
      ["fullName", "Full name", shared.fullName || shared.displayName || purpose.fullName],
      ["headline", "Headline", purpose.headline || purpose.professionalTitle || purpose.whatIDo],
      ["bio", "Bio", shared.bio || purpose.bio || purpose.aboutMe || purpose.aboutText],
      ["email", "Email", shared.email || purpose.email],
    ].map(([field, label, value]) => ({ field, label, complete: Boolean(String(value || "").trim()) }));
  }, [personalInfo, form.category]);
  const missingRequired = requiredStatus.filter((item) => !item.complete);
  function canContinue() {
    if (step === 0) return form.title.trim() && form.category;
    if (step === 1) return form.templateSlug && selectedTemplate && !selectedTemplate.locked;
    if (step === 2) return form.themeSlug && selectedTheme && !selectedTheme.locked;
    if (step === 3) return missingRequired.length === 0;
    return true;
  }

  async function generate() {
    if (!canContinue()) return;
    setGenerating(true);
    setMessage("Creating website preview...");
    try {
      const response = await fetch("/api/user/sites/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setMessage(data.message || "Website could not be generated.");
        if (data.code === "WEBSITE_LIMIT_REACHED") return;
        throw new Error(data.message || "Website could not be generated.");
      }
      window.location.href = data.previewUrl;
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return <DashboardCard><p className="text-sm font-semibold text-muted-foreground">Loading generation setup...</p></DashboardCard>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <div className="flex gap-2 overflow-x-auto">
          {steps.map((label, index) => (
            <button key={label} onClick={() => setStep(index)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${step === index ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
              {index + 1}. {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <DashboardCard>
            <SectionHeader icon={Globe} title="Website Basics" text="Start with a title, active category, and setup context." />
            <div className="mt-5 grid gap-4">
              <Input label="Website Title" value={form.title} onChange={(title) => setForm({ ...form, title })} placeholder="My Developer Portfolio" required />
              <p className="text-xs font-semibold text-muted-foreground">Slug preview: <span className="text-primary">/{slugPreview(form.title)}</span></p>
              <Textarea label="Website Short Description" value={form.description} onChange={(description) => setForm({ ...form, description })} placeholder="A short SEO-friendly summary." />
              <div className="grid gap-3 md:grid-cols-2">
                <Input label="Target Audience" value={form.targetAudience} onChange={(targetAudience) => setForm({ ...form, targetAudience })} placeholder="Clients, recruiters, employers" />
                <Input label="Primary Goal" value={form.primaryGoal} onChange={(primaryGoal) => setForm({ ...form, primaryGoal })} placeholder="Get clients, show portfolio" />
              </div>
              <div>
                <p className="mb-2 text-xs font-black uppercase text-muted-foreground">Website Purpose / Category</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {categories.map((category) => (
                    <button key={category.slug} type="button" disabled={!category.isSelectable} onClick={() => setForm({ ...form, category: category.slug })} className={`rounded-xl border p-4 text-left ${form.category === category.slug ? "border-primary bg-primary/5" : "border-border bg-card"} ${!category.isSelectable ? "opacity-60" : ""}`}>
                      <p className="font-black text-foreground">{category.label || category.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{category.isSelectable ? "Available now" : category.lockedReason || "Coming soon"}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DashboardCard>
        )}

        {step === 1 && (
          <DashboardCard>
            <SectionHeader icon={LayoutTemplate} title="Choose Template" text="Only active templates for your selected category can be used." />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <TemplateCard key={template.slug} template={template} selected={form.templateSlug === template.slug} onSelect={() => !template.locked && setForm({ ...form, templateSlug: template.slug, selectedPages: template.pages?.filter((page) => !page.optional).map((page) => page.slug) || defaultPages })} />
              ))}
            </div>
          </DashboardCard>
        )}

        {step === 2 && (
          <DashboardCard>
            <SectionHeader icon={Palette} title="Choose Theme" text="Theme access follows your current plan. Locked themes are blocked server-side too." />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {themes.map((theme) => (
                <ThemeCard key={theme.themeId || theme.slug} theme={theme} selected={form.themeSlug === (theme.themeId || theme.slug)} onSelect={() => !theme.locked && setForm({ ...form, themeSlug: theme.themeId || theme.slug })} />
              ))}
            </div>
          </DashboardCard>
        )}

        {step === 3 && (
          <DashboardCard>
            <SectionHeader icon={CheckCircle2} title="Review Personal Info" text="This saved data will fill your selected template dynamically." />
            {missingRequired.length ? (
              <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
                <p className="font-black">Complete your Personal Info before generating this website.</p>
                <p className="mt-2 text-sm">Missing: {missingRequired.map((item) => item.label).join(", ")}</p>
                <Link href="/dashboard/personal-info" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground">Update Personal Info</Link>
              </div>
            ) : null}
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {requiredStatus.map((item) => (
                <div key={item.field} className="rounded-lg border border-border bg-muted/30 p-3 text-sm font-semibold">
                  {item.complete ? <Check className="mr-2 inline size-4 text-primary" /> : <Lock className="mr-2 inline size-4 text-amber-600" />}
                  {item.label}
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Object.entries(form.contactVisibility).map(([key, checked]) => (
                <label key={key} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm font-bold">
                  <input type="checkbox" checked={checked} onChange={(event) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, [key]: event.target.checked } })} />
                  Show {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </label>
              ))}
            </div>
          </DashboardCard>
        )}

        {step === 4 && (
          <DashboardCard>
            <SectionHeader icon={Sparkles} title="Review & Generate" text="Final server checks happen after you click Generate." />
            <div className="mt-5 grid gap-3 text-sm">
              <Review label="Website title" value={form.title} />
              <Review label="Generated slug preview" value={slugPreview(form.title)} />
              <Review label="Category" value={form.category} />
              <Review label="Template" value={selectedTemplate?.name} />
              <Review label="Theme" value={selectedTheme?.name || selectedTheme?.label} />
              <Review label="Pages" value={form.selectedPages.join(", ")} />
            </div>
            {message ? <UpgradeMessage message={message} userPlan={user?.plan || "free"} /> : null}
            <button disabled={!canContinue() || generating} onClick={generate} className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-50">
              {generating ? "Generating..." : "Generate Website Preview"}
            </button>
          </DashboardCard>
        )}

        <div className="flex justify-between">
          <button disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className="rounded-lg border border-border px-4 py-2 text-sm font-black disabled:opacity-50">Back</button>
          {step < 4 ? (
            <button disabled={!canContinue()} onClick={() => setStep((value) => Math.min(4, value + 1))} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground disabled:opacity-50">
              Continue <ArrowRight className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      <DashboardCard className="h-fit">
        <p className="text-xs font-black uppercase text-primary">Generation Review</p>
        <div className="mt-4 space-y-3 text-sm">
          <Review label="Current plan" value={user?.plan || "free"} />
          <Review label="Category" value={form.category} />
          <Review label="Template" value={selectedTemplate?.name || "Select a template"} />
          <Review label="Theme" value={selectedTheme?.name || selectedTheme?.label || "Select a theme"} />
          <Review label="Missing info" value={missingRequired.length ? missingRequired.map((item) => item.label).join(", ") : "Ready"} />
        </div>
      </DashboardCard>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, text }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="size-5" /></span>
        <h2 className="text-xl font-black text-foreground">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function TemplateCard({ template, selected, onSelect }) {
  return (
    <button type="button" onClick={onSelect} className={`overflow-hidden rounded-xl border text-left ${selected ? "border-primary bg-primary/5" : "border-border bg-card"} ${template.locked ? "opacity-75" : ""}`}>
      <div className="relative aspect-[16/9] bg-muted">
        <Image src={template.previewImage || "/templates/template-preview.svg"} alt={template.name} fill sizes="360px" className="object-cover" />
        {template.locked ? <span className="absolute right-3 top-3 rounded-full bg-background px-2 py-1 text-xs font-black text-primary"><Lock className="mr-1 inline size-3" />Upgrade</span> : null}
      </div>
      <div className="p-4">
        <p className="font-black text-foreground">{template.name}</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{template.bestFor || template.shortDescription}</p>
        <p className="mt-3 text-xs font-semibold text-muted-foreground">Pages: {(template.pages || []).filter((page) => !page.optional).map((page) => page.name).join(", ")}</p>
      </div>
    </button>
  );
}

function ThemeCard({ theme, selected, onSelect }) {
  const colors = theme.colors || {};
  return (
    <button type="button" onClick={onSelect} className={`rounded-xl border p-4 text-left ${selected ? "border-primary bg-primary/5" : "border-border bg-card"} ${theme.locked ? "opacity-75" : ""}`}>
      <div className="mb-4 flex h-4 overflow-hidden rounded-full">
        {[colors.primary, colors.secondary, colors.accent, colors.background].filter(Boolean).map((color) => <span key={color} className="flex-1" style={{ backgroundColor: color }} />)}
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="font-black text-foreground">{theme.name || theme.label}</p>
        {theme.locked ? <Lock className="size-4 text-primary" /> : selected ? <Check className="size-4 text-primary" /> : null}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{theme.locked ? `Upgrade to ${theme.upgradeTo || "higher plan"}` : "Light/dark support"}</p>
    </button>
  );
}

function UpgradeMessage({ message, userPlan }) {
  const plan = userPlan === "free" ? "basic" : userPlan === "basic" ? "pro" : "";
  return (
    <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
      <p className="font-black">{message}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {plan ? <Link href={`/pricing/${plan}`} className="rounded-lg bg-primary px-3 py-2 font-black text-primary-foreground">Upgrade to {plan}</Link> : <Link href="/dashboard/sites" className="rounded-lg bg-primary px-3 py-2 font-black text-primary-foreground">Manage Websites</Link>}
        <Link href="/pricing" className="rounded-lg border border-amber-300 px-3 py-2 font-black">Compare Plans</Link>
      </div>
    </div>
  );
}

function Review({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/30 p-3">
      <span className="font-bold text-muted-foreground">{label}</span>
      <span className="text-right font-black text-foreground">{value || "-"}</span>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, required }) {
  return (
    <label className="block text-xs font-black uppercase text-muted-foreground">
      {label}{required ? " *" : ""}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm font-semibold text-foreground outline-none focus:border-primary" />
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block text-xs font-black uppercase text-muted-foreground">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 min-h-24 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm font-semibold text-foreground outline-none focus:border-primary" />
    </label>
  );
}
