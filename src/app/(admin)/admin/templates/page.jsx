"use client";

import { useEffect, useState } from "react";
import { LayoutTemplate, Plus, Search, Star, Archive } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const emptyForm = {
  name: "",
  slug: "",
  category: "portfolio",
  status: "draft",
  shortDescription: "",
  description: "",
  bestFor: "",
  purpose: "",
  previewImage: "/templates/template-preview.svg",
  thumbnailImage: "/templates/template-preview.svg",
  layoutStyle: "balanced",
  sectionsText: "Hero, About, Skills, Projects, Services, Contact",
  requiredFieldsText: "fullName, headline, bio, email",
  optionalFieldsText: "phone, location, profileImage, skills, projects, services, experience, education, socialLinks, testimonials",
  pagesJson: "[]",
  dataBindingsJson: "{}",
  recommendedThemesText: "emerald, modernDark, royalBlue",
  availablePlans: ["free", "basic", "pro"],
  isFeatured: false,
  isPremium: false,
  sortOrder: 0,
};

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  async function loadTemplates() {
    const response = await fetch("/api/admin/templates");
    const data = await response.json();
    if (data.success) setTemplates(data.templates || []);
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  function toPayload(value) {
    return {
      ...value,
      sections: value.sectionsText.split(",").map((item) => item.trim()).filter(Boolean),
      requiredFields: value.requiredFieldsText.split(",").map((item) => item.trim()).filter(Boolean),
      optionalFields: value.optionalFieldsText.split(",").map((item) => item.trim()).filter(Boolean),
      pagesJson: value.pagesJson,
      dataBindingsJson: value.dataBindingsJson,
      recommendedThemes: value.recommendedThemesText.split(",").map((item) => item.trim()).filter(Boolean),
      supportedThemes: value.recommendedThemesText.split(",").map((item) => item.trim()).filter(Boolean),
      sortOrder: Number(value.sortOrder || 0),
      order: Number(value.sortOrder || 0),
    };
  }

  async function saveTemplate(event) {
    event.preventDefault();
    setMessage("Saving template...");
    const response = await fetch(editingId ? `/api/admin/templates/${editingId}` : "/api/admin/templates", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(form)),
    });
    const data = await response.json();
    setMessage(data.message || (data.success ? "Template saved." : "Template could not be saved."));
    if (data.success) {
      setForm(emptyForm);
      setEditingId("");
      loadTemplates();
    }
  }

  function editTemplate(template) {
    setEditingId(template.id);
    setForm({
      ...emptyForm,
      ...template,
      sectionsText: (template.sections || []).join(", "),
      requiredFieldsText: (template.requiredFields || []).join(", "),
      optionalFieldsText: (template.optionalFields || []).join(", "),
      pagesJson: JSON.stringify(template.pages || [], null, 2),
      dataBindingsJson: JSON.stringify(template.dataBindings || {}, null, 2),
      recommendedThemesText: (template.recommendedThemes || []).join(", "),
      availablePlans: template.availablePlans || ["free", "basic", "pro"],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function hideTemplate(id) {
    await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
    loadTemplates();
  }

  const filtered = templates.filter((template) => {
    const term = search.toLowerCase();
    return [template.name, template.category, template.status, template.bestFor].join(" ").toLowerCase().includes(term);
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Templates"
        description="Manage website templates available to users for AI-powered site generation."
        route="/admin/templates"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AdminStatCard icon={LayoutTemplate} label="Total Templates" value={templates.length} sub="Template library" />
        <AdminStatCard icon={LayoutTemplate} label="Active" value={templates.filter((t) => t.status === "active").length} sub="Visible" iconClass="bg-emerald-500" />
        <AdminStatCard icon={Star} label="Featured" value={templates.filter((t) => t.isFeatured).length} sub="Highlighted" iconClass="bg-yellow-500" />
        <AdminStatCard icon={Archive} label="Planned" value={templates.filter((t) => ["coming_soon", "planned"].includes(t.status)).length} sub="Roadmap" />
      </div>

      <form onSubmit={saveTemplate} className="rounded-2xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 text-lg font-black text-foreground">
          <Plus className="size-5 text-primary" />
          {editingId ? "Edit Template" : "Add Template"}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Input label="Name" value={form.name} onChange={(name) => setForm({ ...form, name, slug: form.slug || slugify(name) })} />
          <Input label="Slug" value={form.slug} onChange={(slug) => setForm({ ...form, slug })} />
          <Select label="Status" value={form.status} onChange={(status) => setForm({ ...form, status })} options={["active", "draft", "coming_soon", "planned", "hidden"]} />
          <Select label="Category" value={form.category} onChange={(category) => setForm({ ...form, category })} options={["portfolio", "business", "landing-page", "restaurant", "clinic", "realestate", "school", "ecommerce"]} />
          <Input label="Best for" value={form.bestFor} onChange={(bestFor) => setForm({ ...form, bestFor })} />
          <Input label="Purpose" value={form.purpose} onChange={(purpose) => setForm({ ...form, purpose })} />
          <Input label="Preview image" value={form.previewImage} onChange={(previewImage) => setForm({ ...form, previewImage })} />
          <Input label="Thumbnail image" value={form.thumbnailImage} onChange={(thumbnailImage) => setForm({ ...form, thumbnailImage })} />
          <Input label="Layout style" value={form.layoutStyle} onChange={(layoutStyle) => setForm({ ...form, layoutStyle })} />
          <Input label="Sort order" type="number" value={form.sortOrder} onChange={(sortOrder) => setForm({ ...form, sortOrder })} />
          <Input label="Recommended themes" value={form.recommendedThemesText} onChange={(recommendedThemesText) => setForm({ ...form, recommendedThemesText })} />
        </div>
        <Input className="mt-4" label="Short description" value={form.shortDescription} onChange={(shortDescription) => setForm({ ...form, shortDescription })} />
        <Input className="mt-4" label="Sections" value={form.sectionsText} onChange={(sectionsText) => setForm({ ...form, sectionsText })} />
        <Input className="mt-4" label="Required fields" value={form.requiredFieldsText} onChange={(requiredFieldsText) => setForm({ ...form, requiredFieldsText })} />
        <Input className="mt-4" label="Optional fields" value={form.optionalFieldsText} onChange={(optionalFieldsText) => setForm({ ...form, optionalFieldsText })} />
        <textarea
          value={form.pagesJson}
          onChange={(event) => setForm({ ...form, pagesJson: event.target.value })}
          placeholder="Template pages JSON"
          className="mt-4 min-h-32 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-primary"
        />
        <textarea
          value={form.dataBindingsJson}
          onChange={(event) => setForm({ ...form, dataBindingsJson: event.target.value })}
          placeholder="Data bindings JSON"
          className="mt-4 min-h-32 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-primary"
        />
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Full template description"
          className="mt-4 min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <div className="mt-4 flex flex-wrap gap-4">
          {["free", "basic", "pro"].map((plan) => (
            <label key={plan} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <input
                type="checkbox"
                checked={form.availablePlans.includes(plan)}
                onChange={(event) => {
                  const next = event.target.checked
                    ? [...form.availablePlans, plan]
                    : form.availablePlans.filter((item) => item !== plan);
                  setForm({ ...form, availablePlans: next });
                }}
              />
              {plan}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <input type="checkbox" checked={form.isPremium} onChange={(event) => setForm({ ...form, isPremium: event.target.checked })} />
            Premium
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground">
            {editingId ? "Update Template" : "Create Template"}
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(""); setForm(emptyForm); }} className="rounded-lg border border-border px-4 py-2 text-sm font-black">
              Cancel
            </button>
          ) : null}
        </div>
        {message ? <p className="mt-3 text-sm font-semibold text-muted-foreground">{message}</p> : null}
      </form>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search templates..."
          className="w-full rounded-xl border border-border bg-card py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              {["Template", "Category", "Plans", "Status", "Featured", "Actions"].map((head) => (
                <th key={head} className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((template) => (
              <tr key={template.id} className="hover:bg-muted/20">
                <td className="px-5 py-4">
                  <p className="font-black text-foreground">{template.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{template.slug}</p>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{template.category}</td>
                <td className="px-5 py-4 text-muted-foreground">{template.availablePlans?.join(", ")}</td>
                <td className="px-5 py-4"><Badge>{template.status}</Badge></td>
                <td className="px-5 py-4 text-muted-foreground">{template.isFeatured ? "Yes" : "No"}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => editTemplate(template)} className="rounded-lg border border-border px-3 py-1.5 font-bold hover:bg-muted">Edit</button>
                    <button onClick={() => hideTemplate(template.id)} className="rounded-lg border border-border px-3 py-1.5 font-bold hover:bg-muted">Hide</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function slugify(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Badge({ children }) {
  return <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase text-primary">{children}</span>;
}

function Input({ label, value, onChange, type = "text", className = "" }) {
  return (
    <label className={`block text-xs font-black uppercase text-muted-foreground ${className}`}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(type === "number" ? Number(event.target.value) : event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-xs font-black uppercase text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground outline-none focus:border-primary"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
