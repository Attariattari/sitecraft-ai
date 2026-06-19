import { Globe, ArrowLeft, User, BarChart3, Settings, Eye } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminSiteDetailPage({ params }) {
  const { id } = params;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/sites"
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <AdminPageHeader
          title="Website Details"
          description={`Viewing site ID: ${id}`}
          route={`/admin/sites/${id}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-sm font-black text-foreground border-b border-border pb-3">
              Site Information
            </h2>
            {[
              ["Site Title", "—"],
              ["Slug / URL", "—"],
              ["Owner", "—"],
              ["Category", "—"],
              ["Template Used", "—"],
              ["Theme", "—"],
              ["Status", "—"],
              ["Publish State", "—"],
              ["Created At", "—"],
              ["Last Updated", "—"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground font-medium">
                  {label}
                </span>
                <span className="font-bold text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-black text-foreground mb-4">
              Analytics Snapshot
            </h2>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Analytics data will appear here after backend integration
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <h2 className="text-sm font-black text-foreground mb-3">
              Admin Actions
            </h2>
            {[
              { label: "Preview Site", icon: Eye, variant: "primary" },
              { label: "Change Status", icon: Settings, variant: "outline" },
              { label: "View Owner Profile", icon: User, variant: "outline" },
            ].map((a) => (
              <button
                key={a.label}
                className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  a.variant === "primary"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-card hover:bg-muted"
                }`}
              >
                <a.icon className="w-4 h-4" />
                {a.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 space-y-2">
            <h2 className="text-sm font-black text-destructive mb-3">
              Danger Zone
            </h2>
            <button className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-destructive border border-destructive/30 hover:bg-destructive/10 transition-all">
              Archive Site
            </button>
            <button className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-destructive border border-destructive/30 hover:bg-destructive/10 transition-all">
              Delete Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
