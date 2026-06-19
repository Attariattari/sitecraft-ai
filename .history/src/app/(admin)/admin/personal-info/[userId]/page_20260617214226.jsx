import Link from "next/link";
import { ArrowLeft, AlertTriangle, FileUser } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

const categories = [
  "Basic Info",
  "Professional Info",
  "Business Details",
  "Portfolio Items",
  "Products/Services",
  "Contact Info",
  "Social Media",
  "Design Preferences",
];

export default function AdminPersonalInfoUserPage({ params }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/personal-info"
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <AdminPageHeader
          title="User Personal Info"
          description={`User ID: ${params.userId}`}
          route={`/admin/personal-info/${params.userId}`}
          badge="Sensitive"
        />
      </div>

      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="text-sm text-amber-700 dark:text-amber-400">
          This data is personal and confidential. Do not share or export without
          authorization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <FileUser className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-black text-foreground">{cat}</h3>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-3 rounded bg-muted animate-pulse"
                  style={{ width: `${70 + j * 7}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Backend integration required to load data
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
