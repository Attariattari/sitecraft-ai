import Link from "next/link";
import { Shield, UserPlus, MoreHorizontal, Mail, Calendar } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

const mockAdmins = [
  {
    name: "Sarah Mitchell",
    email: "sarah@sitecraft.ai",
    role: "super-admin",
    status: "Active",
    since: "Jan 2025",
  },
  {
    name: "James Carter",
    email: "james@sitecraft.ai",
    role: "admin",
    status: "Active",
    since: "Mar 2025",
  },
  {
    name: "Priya Sharma",
    email: "priya@sitecraft.ai",
    role: "admin",
    status: "Inactive",
    since: "May 2025",
  },
];

const roleColors = {
  "super-admin": "bg-purple-500/10 text-purple-600 border border-purple-500/20",
  admin: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
};

export default function AdminsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Admin Team"
        description="Manage all admin and super-admin accounts on SiteCraft AI."
        route="/admin/admins"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <UserPlus className="w-4 h-4" />
          Add Admin
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Shield}
          label="Total Admins"
          value="3"
          sub="All admin accounts"
        />
        <AdminStatCard
          icon={Shield}
          label="Super Admins"
          value="1"
          sub="Full access"
        />
        <AdminStatCard
          icon={Shield}
          label="Regular Admins"
          value="2"
          sub="Limited access"
        />
        <AdminStatCard
          icon={Shield}
          label="Inactive"
          value="1"
          sub="Suspended accounts"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-black text-foreground">All Admins</h2>
          <span className="text-xs text-muted-foreground">
            {mockAdmins.length} total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {[
                  "Admin",
                  "Email",
                  "Role",
                  "Status",
                  "Member Since",
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
              {mockAdmins.map((a, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center text-xs font-black text-primary border border-primary/10">
                        {a.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {a.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 opacity-50" /> {a.email}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${roleColors[a.role]}`}
                    >
                      {a.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${a.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {a.since}
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

      <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10">
        <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
          <strong>Protected Action:</strong> Adding or modifying admins requires
          super-admin access. All changes are logged in the activity log.
        </p>
      </div>
    </div>
  );
}
