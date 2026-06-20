import Link from "next/link";
import { ArrowLeft, Tags, Settings } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminCategoryDetailPage({ params }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/categories"
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <AdminPageHeader
          title="Category Details"
          description={`Category ID: ${params.id}`}
          route={`/admin/categories/${params.id}`}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-black text-foreground border-b border-border pb-3">
            Category Info
          </h2>
          {[
            ["Name", "—"],
            ["Slug", "—"],
            ["Description", "—"],
            ["Total Sites", "—"],
            ["Status", "—"],
            ["Display Order", "—"],
          ].map(([label, val]) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-bold text-foreground">{val}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-black text-foreground mb-3">Actions</h2>
          {["Edit Category", "Toggle Status", "Reorder", "Delete Category"].map(
            (a) => (
              <button
                key={a}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold border border-border bg-card hover:bg-muted transition-all"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                {a}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
