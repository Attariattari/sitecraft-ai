import Link from "next/link";
import {
  Bot,
  MessageSquareCode,
  ScrollText,
  Cpu,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const aiLinks = [
  {
    title: "Prompt Manager",
    desc: "Manage category-wise AI prompts",
    href: "/admin/ai/prompts",
    icon: MessageSquareCode,
  },
  {
    title: "AI Logs",
    desc: "Browse generation logs & errors",
    href: "/admin/ai/logs",
    icon: ScrollText,
  },
  {
    title: "AI Providers",
    desc: "Configure Gemini / OpenAI",
    href: "/admin/ai/providers",
    icon: Cpu,
  },
  {
    title: "AI Usage",
    desc: "Token & credit usage analytics",
    href: "/admin/ai/usage",
    icon: TrendingUp,
  },
];

export default function AdminAIPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="AI Control Center"
        description="Manage AI providers, monitor usage, configure prompts, and view generation logs."
        route="/admin/ai"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Bot}
          label="Total Generations"
          value="—"
          sub="All time"
        />
        <AdminStatCard
          icon={TrendingUp}
          label="Today's Requests"
          value="—"
          sub="Last 24h"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={AlertCircle}
          label="Error Rate"
          value="—"
          sub="Last 24h"
        />
        <AdminStatCard
          icon={Cpu}
          label="Active Provider"
          value="Gemini"
          sub="1.5 Flash"
          iconClass="bg-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <l.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground">{l.title}</p>
              <p className="text-xs text-muted-foreground">{l.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-black text-foreground mb-4">
          Provider Status
        </h2>
        <div className="space-y-3">
          {[
            { name: "Gemini 1.5 Flash", status: "active", role: "Primary" },
            { name: "GPT-4o Mini", status: "standby", role: "Fallback" },
          ].map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2 h-2 rounded-full ${p.status === "active" ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
                />
                <span className="text-sm font-semibold text-foreground">
                  {p.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({p.role})
                </span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${p.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
