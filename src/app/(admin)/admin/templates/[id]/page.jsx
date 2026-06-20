import Link from "next/link";
import { ArrowLeft, LayoutTemplate } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminTemplateDetailPage({ params }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/templates"
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <AdminPageHeader
          title="Template Details"
          description={`Template ID: ${params.id}`}
          route={`/admin/templates/${params.id}`}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-black text-foreground border-b border-border pb-3">
            Template Info
          </h2>
          {[
            ["Name", "—"],
            ["Category", "—"],
            ["Description", "—"],
            ["Total Uses", "—"],
            ["Type", "—"],
            ["Status", "—"],
            ["Created At", "—"],
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
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-black text-foreground mb-4">Preview</h2>
          <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border">
            <LayoutTemplate className="w-12 h-12 text-muted-foreground/40" />
          </div>
          <div className="mt-4 space-y-2">
            {["Edit Template", "Toggle Status", "Duplicate", "Delete"].map(
              (a) => (
                <button
                  key={a}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold border border-border bg-card hover:bg-muted transition-all"
                >
                  {a}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
