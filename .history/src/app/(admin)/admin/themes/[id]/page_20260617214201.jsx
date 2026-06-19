import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminThemeDetailPage({ params }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/themes"
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <AdminPageHeader
          title="Theme Details"
          description={`Theme ID: ${params.id}`}
          route={`/admin/themes/${params.id}`}
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-black text-foreground border-b border-border pb-3">
          Theme Configuration
        </h2>
        {[
          ["Name", "—"],
          ["Type", "—"],
          ["Primary Color", "—"],
          ["Accent Color", "—"],
          ["Total Uses", "—"],
          ["Status", "—"],
          ["Premium", "—"],
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
    </div>
  );
}
