import { Mail, Plus, Eye, Edit2, Copy } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const templates = [
  {
    name: "Signup Verification",
    key: "signup-verification",
    subject: "Verify your SiteCraft AI account",
    lastUpdated: "Jun 10, 2026",
    status: "Active",
  },
  {
    name: "Forgot Password",
    key: "forgot-password",
    subject: "Reset your SiteCraft AI password",
    lastUpdated: "Jun 8, 2026",
    status: "Active",
  },
  {
    name: "Welcome Email",
    key: "welcome",
    subject: "Welcome to SiteCraft AI!",
    lastUpdated: "Jun 5, 2026",
    status: "Active",
  },
  {
    name: "Website Published",
    key: "site-published",
    subject: "Your website is live on SiteCraft AI",
    lastUpdated: "Jun 1, 2026",
    status: "Active",
  },
  {
    name: "Support Reply",
    key: "support-reply",
    subject: "Response to your support ticket",
    lastUpdated: "May 28, 2026",
    status: "Active",
  },
  {
    name: "Security Code",
    key: "security-code",
    subject: "Your SiteCraft AI security code",
    lastUpdated: "May 20, 2026",
    status: "Active",
  },
];

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Email Templates"
        description="Manage transactional email templates sent to users from SiteCraft AI."
        route="/admin/email-templates"
        badge="Support"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={Mail} label="Total Templates" value="6" sub="All email templates" />
        <AdminStatCard icon={Mail} label="Active" value="6" sub="Currently in use" />
        <AdminStatCard icon={Mail} label="Sent This Month" value="—" sub="Emails delivered" />
        <AdminStatCard icon={Mail} label="Open Rate" value="—" sub="Avg email open rate" />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">Template Library</h2>
          </div>
          <span className="text-xs text-muted-foreground">{templates.length} templates</span>
        </div>
        <div className="divide-y divide-border/50">
          {templates.map((t, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground truncate">{t.subject}</p>
              </div>
              <div className="hidden md:flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground">Updated {t.lastUpdated}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-emerald-500/10 text-emerald-600">
                  {t.status}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all" title="Preview">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all" title="Edit">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all" title="Duplicate">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card">
        <h3 className="text-sm font-black text-foreground mb-3">Template Variables</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Use these variables inside template content — they are replaced dynamically at send time.
        </p>
        <div className="flex flex-wrap gap-2">
          {["{{name}}", "{{email}}", "{{verificationLink}}", "{{resetLink}}", "{{siteTitle}}", "{{siteUrl}}", "{{securityCode}}"].map((v) => (
            <span key={v} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-muted border border-border text-muted-foreground">
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
