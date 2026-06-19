import { Cpu, CheckCircle2, AlertCircle, Settings } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const providers = [
  {
    name: "Google Gemini",
    model: "gemini-1.5-flash",
    status: "active",
    role: "Primary",
    rateLimit: "1500 req/min",
    costPer1k: "$0.075",
    description: "Fast, multimodal model optimized for speed and cost.",
  },
  {
    name: "OpenAI",
    model: "gpt-4o-mini",
    status: "standby",
    role: "Fallback",
    rateLimit: "500 req/min",
    costPer1k: "$0.15",
    description: "High-quality fallback provider for complex tasks.",
  },
];

export default function AdminAIProvidersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="AI Providers"
        description="Configure AI providers, manage keys (server-side), and set fallback behavior. API keys are never exposed here."
        route="/admin/ai/providers"
      />

      <div className="p-4 rounded-2xl border border-border bg-muted/20 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Security:</strong> API keys are
          stored in environment variables and never displayed here. Configure
          keys in your deployment environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((p, i) => (
          <div
            key={i}
            className={`rounded-2xl border bg-card p-5 space-y-4 ${p.status === "active" ? "border-primary/30 shadow-md shadow-primary/5" : "border-border"}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-black text-foreground">
                    {p.name}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.role === "Primary" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {p.role}
                  </span>
                </div>
                <p className="text-xs font-mono text-muted-foreground">
                  {p.model}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {p.status === "active" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                )}
                <span
                  className={`text-xs font-bold capitalize ${p.status === "active" ? "text-emerald-600" : "text-muted-foreground"}`}
                >
                  {p.status}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{p.description}</p>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Rate Limit
                </p>
                <p className="text-sm font-bold text-foreground">
                  {p.rateLimit}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Cost / 1K tokens
                </p>
                <p className="text-sm font-bold text-foreground">
                  {p.costPer1k}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">API Key</span>
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                  ••••••••••••SET IN ENV
                </span>
              </div>
            </div>
            <button className="flex items-center gap-2 w-full px-4 py-2 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-all">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Configure
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
