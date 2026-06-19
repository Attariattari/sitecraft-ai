import {
  LayoutTemplate,
  Plus,
  Search,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const mockTemplates = [
  {
    name: "Modern Portfolio",
    category: "Portfolio",
    uses: 142,
    premium: false,
    active: true,
  },
  {
    name: "Agency Pro",
    category: "Business",
    uses: 98,
    premium: true,
    active: true,
  },
  {
    name: "Shop Starter",
    category: "E-commerce",
    uses: 67,
    premium: false,
    active: true,
  },
  {
    name: "Blog Clean",
    category: "Blog",
    uses: 55,
    premium: false,
    active: true,
  },
  {
    name: "Restaurant Elite",
    category: "Restaurant",
    uses: 44,
    premium: true,
    active: false,
  },
];

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Templates"
        description="Manage website templates available to users for AI-powered site generation."
        route="/admin/templates"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={LayoutTemplate}
          label="Total Templates"
          value={mockTemplates.length.toString()}
          sub="All templates"
        />
        <AdminStatCard
          icon={LayoutTemplate}
          label="Active"
          value={mockTemplates.filter((t) => t.active).length.toString()}
          sub="Visible"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={Star}
          label="Premium"
          value={mockTemplates.filter((t) => t.premium).length.toString()}
          sub="Paid only"
          iconClass="bg-yellow-500"
        />
        <AdminStatCard
          icon={LayoutTemplate}
          label="Total Uses"
          value={mockTemplates.reduce((a, t) => a + t.uses, 0).toString()}
          sub="All time"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary text-sm"
          />
        </div>
        <select className="px-4 py-2 rounded-xl border border-border bg-card outline-none text-sm">
          <option>All Categories</option>
          <option>Portfolio</option>
          <option>Business</option>
          <option>E-commerce</option>
        </select>
        <select className="px-4 py-2 rounded-xl border border-border bg-card outline-none text-sm">
          <option>All Types</option>
          <option>Free</option>
          <option>Premium</option>
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {[
                "Template",
                "Category",
                "Uses",
                "Type",
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
            {mockTemplates.map((t, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-border flex items-center justify-center">
                      <LayoutTemplate className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {t.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {t.category}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-foreground">
                  {t.uses}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${t.premium ? "bg-yellow-500/10 text-yellow-600" : "bg-muted text-muted-foreground"}`}
                  >
                    {t.premium ? "Premium" : "Free"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${t.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                  >
                    {t.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
