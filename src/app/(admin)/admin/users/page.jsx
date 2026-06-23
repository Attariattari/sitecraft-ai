"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Mail,
  Calendar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
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

const statusColors = {
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  restricted: "bg-destructive/10 text-destructive border-destructive/20",
  suspended: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

export default function AdminUsersPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processing, setProcessing] = useState(null);

  // Modal State
  const [restrictionModal, setRestrictionModal] = useState({
    open: false,
    userId: null,
    reason: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
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

  const handleRoleChange = async (userId, newRole) => {
    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`,
      )
    )
      return;
    setProcessing(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Role change error:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleUnrestrict = async (userId) => {
    setProcessing(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/unrestrict`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, status: "active" } : u)),
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Unrestrict error:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleSuspend = async (userId) => {
    const reason = window.prompt("Reason for suspending this account:");
    if (!reason?.trim()) return;

    setProcessing(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, status: "suspended" } : u,
          ),
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Suspend error:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleRevokeSessions = async (userId) => {
    if (!window.confirm("End all active sessions for this user?")) return;

    setProcessing(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/revoke-sessions`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!data.success) alert(data.message);
    } catch (err) {
      console.error("Revoke sessions error:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleRestrict = async () => {
    const { userId, reason } = restrictionModal;
    if (!reason.trim()) return alert("Please provide a reason.");

    setProcessing(userId);
    setRestrictionModal({ open: false, userId: null, reason: "" });
    try {
      const res = await fetch(`/api/admin/users/${userId}/restrict`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, status: "restricted" } : u,
          ),
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Restrict error:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (userId) => {
    if (
      !window.confirm(
        "ARE YOU ABSOLUTELY SURE? This will permanently delete the user account.",
      )
    )
      return;
    setProcessing(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setProcessing(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="User Management"
        description="View and manage all registered users, roles, and account statuses."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Users}
          label="Total Users"
          value={String(users.length)}
          sub="Registered accounts"
        />
        <AdminStatCard
          icon={CheckCircle2}
          label="Verified"
          value={String(users.filter((u) => u.isEmailVerified).length)}
          sub="Email verified"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={Shield}
          label="Admins"
          value={String(users.filter((u) => u.role !== "user").length)}
          sub="Admin accounts"
          iconClass="bg-purple-500"
        />
        <AdminStatCard
          icon={ShieldAlert}
          label="Restricted"
          value={String(users.filter((u) => u.status === "restricted").length)}
          sub="Access limited"
          iconClass="bg-destructive"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="pl-3 pr-8 py-2.5 rounded-xl border border-border bg-card text-sm appearance-none cursor-pointer outline-none focus:border-primary"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="super-admin">Super Admins</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
          <select
            className="pl-3 pr-8 py-2.5 rounded-xl border border-border bg-card text-sm appearance-none cursor-pointer outline-none focus:border-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="restricted">Restricted</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center w-16">
                  Profile
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  User Details
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Role & Plan
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
                      <div className="h-5 w-20 bg-muted rounded mb-1.5" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 bg-muted rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-muted rounded" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 w-24 bg-muted rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    <td className="px-6 py-4 text-center">
                      {u.profileImage?.url ? (
                        <img
                          src={u.profileImage.url}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-border mx-auto"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black border border-primary/5 mx-auto">
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
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground truncate max-w-[150px]">
                          {u.name}
                        </p>
                        {u.isRootSuperAdmin && (
                          <span
                            className="p-1 rounded bg-amber-500/10 text-amber-500"
                            title="Root Super Admin"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
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
                      <div className="flex flex-col gap-2">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full border self-start font-bold uppercase tracking-wide flex items-center gap-1 ${statusColors[u.status] || statusColors.active}`}
                        >
                          {u.status === "active" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : u.status === "restricted" ? (
                            <ShieldAlert className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {u.status}
                        </span>
                        {u.isEmailVerified && (
                          <span className="text-[9px] text-emerald-500 font-black uppercase flex items-center gap-1 pl-1">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-medium text-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        {u.lastLoginAt
                          ? `Active: ${new Date(u.lastLoginAt).toLocaleDateString()}`
                          : "Never logged in"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.isRootSuperAdmin ? (
                          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase border border-amber-500/20">
                            Protected
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Role Actions */}
                            {currentUser?.isRootSuperAdmin && (
                              <>
                                {u.role === "user" ? (
                                  <button
                                    onClick={() =>
                                      handleRoleChange(u._id, "admin")
                                    }
                                    disabled={processing === u._id}
                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                                    title="Promote to Admin"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleRoleChange(u._id, "user")
                                    }
                                    disabled={processing === u._id}
                                    className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                                    title="Demote to User"
                                  >
                                    <UserMinus className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}

                            {/* Restrict Actions */}
                            {u.status === "active" ? (
                              <>
                                <button
                                  onClick={() =>
                                    setRestrictionModal({
                                      open: true,
                                      userId: u._id,
                                      reason: "",
                                    })
                                  }
                                  disabled={processing === u._id}
                                  className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                                  title="Restrict Access"
                                >
                                  <Lock className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleSuspend(u._id)}
                                  disabled={processing === u._id}
                                  className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                                  title="Suspend Account"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRevokeSessions(u._id)}
                                  disabled={processing === u._id}
                                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                                  title="Revoke Sessions"
                                >
                                  <ShieldAlert className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleUnrestrict(u._id)}
                                disabled={processing === u._id}
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                                title="Restore Access"
                              >
                                <Unlock className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(u._id)}
                              disabled={processing === u._id}
                              className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-destructive hover:text-white transition-all"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restriction Modal */}
      {restrictionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-destructive" />
              Restrict Access
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Provide a reason for restricting this user's access. An email will
              be sent to them.
            </p>

            <div className="space-y-4">
              <textarea
                value={restrictionModal.reason}
                onChange={(e) =>
                  setRestrictionModal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                placeholder="Violation of terms, suspicious activity, etc."
                className="w-full min-h-[120px] rounded-2xl border border-border bg-background p-4 text-sm focus:border-primary outline-none transition-all resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setRestrictionModal({
                      open: false,
                      userId: null,
                      reason: "",
                    })
                  }
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-all border border-border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestrict}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-destructive text-white hover:bg-destructive/90 transition-all"
                >
                  Restrict Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
