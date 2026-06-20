import { Tags, Plus, Search, MoreHorizontal } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";

const mockCategories = [
  { name: "Portfolio", slug: "portfolio", sites: 24, active: true, order: 1 },
  { name: "Business", slug: "business", sites: 31, active: true, order: 2 },
  { name: "E-commerce", slug: "ecommerce", sites: 18, active: true, order: 3 },
  { name: "Blog", slug: "blog", sites: 12, active: true, order: 4 },
  { name: "Restaurant", slug: "restaurant", sites: 9, active: true, order: 5 },
  {
    name: "Photography",
    slug: "photography",
    sites: 7,
    active: false,
    order: 6,
  },
];

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Website Categories"
        description="Manage website categories and industry classifications used for AI generation."
        route="/admin/categories"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Tags}
          label="Total Categories"
          value={mockCategories.length.toString()}
          sub="All categories"
        />
        <AdminStatCard
          icon={Tags}
          label="Active"
          value={mockCategories.filter((c) => c.active).length.toString()}
          sub="Visible to users"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={Tags}
          label="Inactive"
          value={mockCategories.filter((c) => !c.active).length.toString()}
          sub="Hidden"
        />
        <AdminStatCard
          icon={Tags}
          label="Total Sites"
          value={mockCategories.reduce((a, c) => a + c.sites, 0).toString()}
          sub="Across all categories"
        />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {["Order", "Category", "Slug", "Sites", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {mockCategories.map((c, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4 text-sm text-muted-foreground font-mono">
                  {c.order}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-foreground">
                  {c.name}
                </td>
                <td className="px-5 py-4 text-xs font-mono text-muted-foreground">
                  /{c.slug}
                </td>
                <td className="px-5 py-4 text-sm text-foreground">{c.sites}</td>
                <td className="px-5 py-4">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${c.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                  >
                    {c.active ? "Active" : "Inactive"}
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
