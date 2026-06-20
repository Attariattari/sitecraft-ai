import { FileUser, Eye, AlertTriangle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTablePlaceholder } from "@/components/admin/AdminTablePlaceholder";

export default function AdminPersonalInfoPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Personal Info Data"
        description="View user-saved personal info records used for AI website generation. Sensitive data — handle with care."
        route="/admin/personal-info"
        badge="Sensitive"
      />

      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
            Sensitive Personal Data
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
            This section contains personal information submitted by users for AI
            profile generation. Access is restricted to super-admins only.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={FileUser}
          label="Total Records"
          value="—"
          sub="All user profiles"
        />
        <AdminStatCard
          icon={FileUser}
          label="Complete Profiles"
          value="—"
          sub="≥80% completion"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={FileUser}
          label="Partial Profiles"
          value="—"
          sub="Incomplete"
          iconClass="bg-yellow-500"
        />
        <AdminStatCard
          icon={FileUser}
          label="No Profile"
          value="—"
          sub="Not started"
        />
      </div>

      <AdminTablePlaceholder
        columns={[
          "User",
          "Email",
          "Account Purpose",
          "Completion",
          "Last Updated",
          "Actions",
        ]}
        rows={7}
      />

      <p className="text-xs text-muted-foreground text-center">
        Connect{" "}
        <code className="font-mono text-primary">
          GET /api/admin/personal-info
        </code>{" "}
        to load real records.
      </p>
    </div>
  );
}
