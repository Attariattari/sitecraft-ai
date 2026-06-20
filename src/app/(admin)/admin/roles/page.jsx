import { KeyRound, Plus, CheckCircle2, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const roles = [
  {
    name: "super-admin",
    color:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20",
    count: 1,
    permissions: [
      "All permissions",
      "Manage admins",
      "Delete platform data",
      "Access all settings",
    ],
  },
  {
    name: "admin",
    color:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
    count: 2,
    permissions: [
      "Manage users",
      "View analytics",
      "Manage sites",
      "Respond to support",
    ],
  },
  {
    name: "user",
    color:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20",
    count: 0,
    permissions: [
      "Access dashboard",
      "Generate websites",
      "Manage own sites",
      "View own analytics",
    ],
  },
];

const permissionMatrix = [
  { permission: "Manage Users", superAdmin: true, admin: true, user: false },
  { permission: "Delete Users", superAdmin: true, admin: false, user: false },
  { permission: "Manage Admins", superAdmin: true, admin: false, user: false },
  { permission: "View All Sites", superAdmin: true, admin: true, user: false },
  {
    permission: "Manage Templates",
    superAdmin: true,
    admin: true,
    user: false,
  },
  { permission: "View Analytics", superAdmin: true, admin: true, user: false },
  { permission: "Manage Billing", superAdmin: true, admin: false, user: false },
  {
    permission: "System Settings",
    superAdmin: true,
    admin: false,
    user: false,
  },
  { permission: "Generate Website", superAdmin: true, admin: true, user: true },
  { permission: "Manage Own Sites", superAdmin: true, admin: true, user: true },
];

export default function RolesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Roles & Permissions"
        description="Manage role definitions and permission matrix for all platform access levels."
        route="/admin/roles"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((r) => (
          <div
            key={r.name}
            className="rounded-2xl border border-border bg-card p-5 hover:border-primary/25 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${r.color}`}
              >
                {r.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {r.count} assigned
              </span>
            </div>
            <ul className="space-y-2">
              {r.permissions.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-black text-foreground">
            Permission Matrix
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Overview of which roles can perform each action
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-1/2">
                  Permission
                </th>
                {["Super Admin", "Admin", "User"].map((r) => (
                  <th
                    key={r}
                    className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center"
                  >
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {permissionMatrix.map((row, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-foreground">
                    {row.permission}
                  </td>
                  {[row.superAdmin, row.admin, row.user].map((allowed, j) => (
                    <td key={j} className="px-5 py-3 text-center">
                      {allowed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
