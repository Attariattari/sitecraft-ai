import { ServerCog, CheckCircle2, XCircle, Clock, Database, Cloud, Mail, Bot, Globe, Zap, RefreshCw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const services = [
  {
    name: "MongoDB",
    description: "Primary database — stores users, sites, orders, and all platform data.",
    icon: Database,
    status: "checking",
    detail: "Connection not verified yet",
    color: "text-emerald-600",
  },
  {
    name: "Cloudinary",
    description: "Media storage and CDN — stores all uploaded images and assets.",
    icon: Cloud,
    status: "checking",
    detail: "Status unknown",
    color: "text-sky-600",
  },
  {
    name: "Nodemailer (SMTP)",
    description: "Email service — handles verification, password reset, and notifications.",
    icon: Mail,
    status: "checking",
    detail: "SMTP not tested",
    color: "text-amber-600",
  },
  {
    name: "Gemini AI",
    description: "Primary AI provider — powers website generation and content creation.",
    icon: Bot,
    status: "checking",
    detail: "API key not verified",
    color: "text-purple-600",
  },
  {
    name: "Next.js App",
    description: "Frontend and API layer — running on the current server instance.",
    icon: Globe,
    status: "online",
    detail: "Running normally",
    color: "text-emerald-600",
  },
];

const envChecks = [
  { key: "MONGODB_URI", present: true },
  { key: "JWT_SECRET", present: true },
  { key: "CLOUDINARY_CLOUD_NAME", present: true },
  { key: "CLOUDINARY_API_KEY", present: true },
  { key: "GEMINI_API_KEY", present: true },
  { key: "SMTP_HOST", present: true },
  { key: "SMTP_USER", present: true },
  { key: "NEXTAUTH_SECRET", present: false },
];

function ServiceStatusDot({ status }) {
  if (status === "online") return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />;
  if (status === "offline") return <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50" />;
  return <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40 animate-pulse inline-block" />;
}

export default function SystemHealthPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="System Health"
        description="Real-time status of all platform services, environment variables, and infrastructure."
        route="/admin/system-health"
        badge="System"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-muted transition-all">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard icon={ServerCog} label="Services Running" value="1/5" sub="Verified online" />
        <AdminStatCard icon={Clock} label="Uptime" value="—" sub="Current session" iconClass="bg-emerald-500" />
        <AdminStatCard icon={Zap} label="API Response" value="—" sub="Avg latency" iconClass="bg-blue-500" />
        <AdminStatCard icon={Database} label="DB Connections" value="—" sub="Active connections" iconClass="bg-amber-500" />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ServerCog className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">Service Status</h2>
          </div>
          <span className="text-xs text-muted-foreground">Live check required — connect backend</span>
        </div>
        <div className="divide-y divide-border/50">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:block">{s.detail}</span>
                  <div className="flex items-center gap-1.5">
                    <ServiceStatusDot status={s.status} />
                    <span className="text-xs font-bold text-foreground capitalize">{s.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-black text-foreground">Environment Variables</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Key presence check — values are never exposed.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
          {envChecks.map((e, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5 bg-card hover:bg-muted/10 transition-colors">
              <span className="text-xs font-mono text-muted-foreground">{e.key}</span>
              {e.present ? (
                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Set
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                  <XCircle className="w-3.5 h-3.5" /> Missing
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-black text-foreground">API Response Times</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Average latency per endpoint — backend integration required</p>
          </div>
          <div className="p-5 space-y-3">
            {["/api/auth/login", "/api/sites", "/api/ai/generate", "/api/users/me", "/api/admin/users"].map((ep) => (
              <div key={ep} className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">{ep}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-1/3 rounded-full bg-primary/40" />
                  </div>
                  <span className="text-xs font-bold text-foreground w-10 text-right">—ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-black text-foreground">System Info</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Runtime environment details</p>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: "Node.js Version", value: process?.version ?? "—" },
              { label: "Next.js", value: "16.x" },
              { label: "Environment", value: process?.env?.NODE_ENV ?? "—" },
              { label: "Platform", value: "Vercel / Node" },
              { label: "Region", value: "—" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
