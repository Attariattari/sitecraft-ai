import Link from "next/link";
import { Globe, Search, Filter, Plus, Eye, MoreHorizontal } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

export default function AdminSitesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="All Websites"
        description="Monitor and manage all websites generated across the SiteCraft AI platform."
        route="/admin/sites"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-bold hover:bg-muted transition-all">
          <Filter className="w-4 h-4" />
          Export
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Globe}
          label="Total Sites"
          value="—"
          sub="All generated"
        />
        <AdminStatCard
          icon={Globe}
          label="Published"
          value="—"
          sub="Live sites"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={Globe}
          label="Drafts"
          value="—"
          sub="In progress"
          iconClass="bg-blue-500"
        />
        <AdminStatCard
          icon={Globe}
          label="Archived"
          value="—"
          sub="Inactive"
          iconClass="bg-muted-foreground"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, slug, or user..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm"
          />
        </div>
        <select className="px-4 py-2 rounded-xl border border-border bg-card outline-none text-sm">
          <option>All Categories</option>
          <option>Portfolio</option>
          <option>Business</option>
          <option>E-commerce</option>
          <option>Blog</option>
        </select>
        <select className="px-4 py-2 rounded-xl border border-border bg-card outline-none text-sm">
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>

      <AdminTablePlaceholder
        columns={[
          "Website",
          "Owner",
          "Category",
          "Template",
          "Status",
          "Created",
          "Actions",
        ]}
        rows={8}
      />

      <div className="p-4 rounded-2xl border border-border bg-muted/20 text-center">
        <p className="text-sm text-muted-foreground">
          Connect{" "}
          <code className="font-mono text-primary">GET /api/admin/sites</code>{" "}
          to populate this table with real data.
        </p>
      </div>
    </div>
  );
}
