"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Shield,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Mail,
  Calendar,
  Zap,
  ArrowUpDown,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useUser } from "@/context/UserContext";

const roleColors = {
  "super-admin": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  admin: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  user: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const planColors = {
  free: "bg-slate-500/10 text-slate-500",
  basic: "bg-blue-500/10 text-blue-500",
  pro: "bg-emerald-500/10 text-emerald-500",
  agency: "bg-purple-500/10 text-purple-500",
};

export default function AdminUsersPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all registered users on SiteCraft AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="super-admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <DashboardCard className="overflow-hidden p-0 border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center w-16">
                  User
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Contact
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Role & Plan
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Purpose
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Joined
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-muted mx-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-muted rounded mb-2" />
                      <div className="h-3 w-24 bg-muted rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-20 bg-muted rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-16 bg-muted rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 bg-muted rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-muted rounded" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 w-8 bg-muted rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      {u.profileImage && u.profileImage.url ? (
                        <img
                          src={u.profileImage.url}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-border mx-auto shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary flex items-center justify-center text-xs font-black border border-primary/10 mx-auto">
                          {u.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-foreground truncate max-w-[180px]">
                        {u.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 opacity-50" /> {u.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border self-start font-bold uppercase tracking-wider ${roleColors[u.role] || roleColors.user}`}
                        >
                          {u.role}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md self-start font-bold uppercase tracking-widest ${planColors[u.plan] || planColors.free}`}
                        >
                          {u.plan}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-medium text-muted-foreground capitalize">
                        {u.accountPurpose}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isEmailVerified ? (
                        <span className="flex items-center gap-1.5 text-emerald-500 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-orange-500 text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 opacity-50" />
                          {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                        {u.lastLoginAt && (
                          <div className="text-[9px] mt-1 opacity-60">
                            Last active:{" "}
                            {new Date(u.lastLoginAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
