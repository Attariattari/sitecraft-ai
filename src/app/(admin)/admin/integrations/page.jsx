import { ServerCog, CheckCircle2, XCircle, Settings, ExternalLink, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const integrations = [
  {
    name: "Cloudinary",
    category: "Media Storage",
    description: "Image and asset storage with CDN delivery. Used for user uploads, site images, and template previews.",
    status: "Connected",
    folder: "SiteCraft-AI",
    docsUrl: "#",
  },
  {
    name: "Google Gemini AI",
    category: "AI Provider",
    description: "Primary AI provider for website generation, content creation, and intelligent suggestions.",
    status: "Connected",
    model: "gemini-1.5-flash",
    docsUrl: "#",
  },
  {
    name: "SMTP / Nodemailer",
    category: "Email",
    description: "Transactional email sending — verification, password reset, welcome emails, and support replies.",
    status: "Connected",
    docsUrl: "#",
  },
  {
    name: "MongoDB Atlas",
    category: "Database",
    description: "Primary database storing all platform data — users, sites, orders, templates, and analytics.",
    status: "Connected",
    docsUrl: "#",
  },
  {
    name: "OpenAI",
    category: "AI Provider",
    description: "Secondary AI provider (optional). Can be used as a fallback when Gemini is unavailable.",
    status: "Not Configured",
    docsUrl: "#",
  },
  {
    name: "Stripe",
    category: "Payments",
    description: "Payment processing for plans, orders, and subscriptions.",
    status: "Not Configured",
    docsUrl: "#",
  },
];

const statusColors = {
  Connected: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Not Configured": "bg-muted text-muted-foreground border-border",
  Error: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Integrations"
        description="Manage all third-party service integrations connected to SiteCraft AI."
        route="/admin/integrations"
        badge="System"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Add Integration
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={CheckCircle2} label="Connected" value={String(integrations.filter(i => i.status === "Connected").length)} sub="Active integrations" iconClass="bg-emerald-500" />
        <AdminStatCard icon={XCircle} label="Not Configured" value={String(integrations.filter(i => i.status === "Not Configured").length)} sub="Pending setup" />
        <AdminStatCard icon={ServerCog} label="Total" value={String(integrations.length)} sub="All integrations" />
        <AdminStatCard icon={Settings} label="Last Synced" value="—" sub="Config last updated" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((intg, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/20 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-black text-foreground">{intg.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-bold">{intg.category}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{intg.description}</p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ml-3 shrink-0 ${statusColors[intg.status]}`}>
                {intg.status}
              </span>
            </div>
            {intg.folder && <p className="text-xs text-muted-foreground mb-3">Folder: <span className="font-mono text-foreground">{intg.folder}</span></p>}
            {intg.model && <p className="text-xs text-muted-foreground mb-3">Model: <span className="font-mono text-foreground">{intg.model}</span></p>}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
              <button className="flex items-center gap-1.5 text-xs font-bold text-foreground px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 transition-all">
                <Settings className="w-3.5 h-3.5" /> Configure
              </button>
              <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-all">
                <ExternalLink className="w-3.5 h-3.5" /> Docs
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
