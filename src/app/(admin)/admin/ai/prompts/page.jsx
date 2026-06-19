import { MessageSquareCode, Plus, ChevronDown } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const categories = [
  "Portfolio",
  "Business",
  "E-commerce",
  "Restaurant",
  "Blog",
  "Photography",
  "Agency",
  "Education",
  "Healthcare",
  "Real Estate",
];

const promptSamples = [
  {
    category: "Portfolio",
    version: "v2.1",
    tokens: 420,
    lastUpdated: "3 days ago",
    active: true,
  },
  {
    category: "Business",
    version: "v1.8",
    tokens: 380,
    lastUpdated: "1 week ago",
    active: true,
  },
  {
    category: "E-commerce",
    version: "v2.0",
    tokens: 510,
    lastUpdated: "2 days ago",
    active: true,
  },
  {
    category: "Restaurant",
    version: "v1.5",
    tokens: 340,
    lastUpdated: "2 weeks ago",
    active: false,
  },
];

export default function AdminAIPromptsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Prompt Manager"
        description="Manage category-wise AI system prompts used for website generation."
        route="/admin/ai/prompts"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          New Prompt
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={MessageSquareCode}
          label="Total Prompts"
          value={promptSamples.length.toString()}
          sub="Categories configured"
        />
        <AdminStatCard
          icon={MessageSquareCode}
          label="Active"
          value={promptSamples.filter((p) => p.active).length.toString()}
          sub="In use"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={MessageSquareCode}
          label="Avg Tokens"
          value="413"
          sub="Per prompt"
        />
        <AdminStatCard
          icon={MessageSquareCode}
          label="Pending Update"
          value="2"
          sub="Need review"
          iconClass="bg-yellow-500"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {[
                "Category",
                "Version",
                "Tokens",
                "Last Updated",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {promptSamples.map((p, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4 text-sm font-bold text-foreground">
                  {p.category}
                </td>
                <td className="px-5 py-4 text-xs font-mono text-muted-foreground">
                  {p.version}
                </td>
                <td className="px-5 py-4 text-sm text-foreground">
                  {p.tokens}
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {p.lastUpdated}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${p.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                  >
                    {p.active ? "Active" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="text-xs text-primary font-bold hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-2xl border border-border bg-muted/20">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Note:</strong> Prompts are stored
          in the database and versioned. Do not delete active prompt versions in
          production.
        </p>
      </div>
    </div>
  );
}
