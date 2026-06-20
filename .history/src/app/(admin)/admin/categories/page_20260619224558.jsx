"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Home,
  UserPlus,
  LayoutDashboard,
  Save,
  RefreshCcw,
  AlertCircle,
  Scissors,
  Briefcase,
  ShoppingBag,
  Utensils,
  GraduationCap,
  Building2,
  Stethoscope,
  PenTool,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const iconMap = {
  User: Briefcase,
  Briefcase: Briefcase,
  Scissors: Scissors,
  ShoppingBag: ShoppingBag,
  Utensils: Utensils,
  GraduationCap: GraduationCap,
  Building2: Building2,
  Stethoscope: Stethoscope,
  Layout: Layout,
  Zap: Zap,
  Home: Home,
  Users: UserPlus,
  Globe: Eye,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message || "Failed to fetch categories");
      }
    } catch (err) {
      toast.error("Network error fetching categories");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const handleSeed = async () => {
    if (
      !confirm(
        "Are you sure you want to seed categories? This will create missing default categories.",
      )
    )
      return;

    try {
      const res = await fetch("/api/admin/categories/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to seed categories");
    }
  };

  const toggleStatus = async (id, field, currentValue) => {
    if (!id) {
      toast.error(
        "Please click 'Import Categories' before editing default data.",
      );
      return;
    }
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((cats) =>
          cats.map((c) => (c._id === id ? data.category : c)),
        );
        toast.success(`Category updated`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (category) => {
    if (!category._id) {
      toast.error(
        "Please click 'Import Categories' before editing default data.",
      );
      return;
    }
    setEditingId(category._id);
    setEditForm({ ...category });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/admin/categories/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((cats) =>
          cats.map((c) => (c._id === editingId ? data.category : c)),
        );
        setEditingId(null);
        setEditForm(null);
        toast.success("Category updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {categories.length > 0 && !categories[0]._id && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-500">
              Using Fallback Data
            </h4>
            <p className="text-xs text-amber-600/80">
              The database is currently empty. Showing default categories from
              configuration. Click "Import Categories" above to start managing
              them.
            </p>
          </div>
          <button
            onClick={handleSeed}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
          >
            Import Now
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Category Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Control platform categories, availability, and visibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCcw
              className={cn("w-5 h-5", refreshing && "animate-spin")}
            />
          </button>
          <button
            onClick={handleSeed}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Import Categories
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats/Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Active
            </p>
            <h3 className="text-2xl font-black text-foreground">
              {categories.filter((c) => c.isActive).length}
            </h3>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Available
            </p>
            <h3 className="text-2xl font-black text-foreground">
              {categories.filter((c) => c.isAvailable).length}
            </h3>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Locked
            </p>
            <h3 className="text-2xl font-black text-foreground">
              {categories.filter((c) => c.isLocked).length}
            </h3>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Layout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total
            </p>
            <h3 className="text-2xl font-black text-foreground">
              {categories.length}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-black text-muted-foreground uppercase tracking-widest">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Home</th>
                <th className="px-4 py-3 text-center">Signup</th>
                <th className="px-4 py-3 text-center">Dash</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-5">
                      <div className="h-10 w-40 bg-muted rounded-lg" />
                    </td>
                    <td className="px-4 py-5">
                      <div className="h-6 w-20 bg-muted rounded-full" />
                    </td>
                    <td colSpan={3} className="px-4 py-5 font-center">
                      <div className="h-6 w-full max-w-[200px] bg-muted rounded-full mx-auto" />
                    </td>
                    <td className="px-4 py-5 text-right">
                      <div className="h-8 w-8 bg-muted rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-20 text-center text-muted-foreground"
                  >
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No categories found.</p>
                    <p className="text-sm">
                      Try adjusting your search or seed default categories.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const Icon = iconMap[cat.icon] || Layout;
                  const isEditing = editingId === cat._id;

                  return (
                    <tr
                      key={cat._id || cat.slug}
                      className={cn(
                        "group hover:bg-muted/30 transition-colors",
                        isEditing && "bg-primary/5",
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                              cat.isActive
                                ? "bg-primary/10 border-primary/20 text-primary"
                                : "bg-muted border-border text-muted-foreground",
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground truncate">
                              {cat.label}
                            </p>
                            <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">
                              /{cat.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {/* Active Toggle */}
                          <button
                            onClick={() =>
                              toggleStatus(cat._id, "isActive", cat.isActive)
                            }
                            className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all",
                              cat.isActive
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"
                                : "bg-muted border-border text-muted-foreground hover:bg-muted-foreground/10",
                            )}
                          >
                            {cat.isActive ? "Active" : "Inactive"}
                          </button>

                          {/* Available Toggle */}
                          <button
                            onClick={() =>
                              toggleStatus(
                                cat._id,
                                "isAvailable",
                                cat.isAvailable,
                              )
                            }
                            className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all",
                              cat.isAvailable
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500/20"
                                : "bg-muted border-border text-muted-foreground hover:bg-muted-foreground/10",
                            )}
                          >
                            {cat.isAvailable ? "Available" : "Restricted"}
                          </button>

                          {/* Lock Toggle */}
                          <button
                            onClick={() =>
                              toggleStatus(cat._id, "isLocked", cat.isLocked)
                            }
                            className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all flex items-center gap-1",
                              cat.isLocked
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20"
                                : "bg-muted border-border text-muted-foreground hover:bg-muted-foreground/10",
                            )}
                          >
                            {cat.isLocked ? (
                              <Lock className="w-2.5 h-2.5" />
                            ) : (
                              <Unlock className="w-2.5 h-2.5" />
                            )}
                            {cat.isLocked ? "Locked" : "Unlocked"}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() =>
                            toggleStatus(cat._id, "showOnHome", cat.showOnHome)
                          }
                          className={cn(
                            "mx-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                            cat.showOnHome
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground/30 hover:bg-muted",
                          )}
                          title={
                            cat.showOnHome
                              ? "Shown on Home"
                              : "Hidden from Home"
                          }
                        >
                          <Home className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() =>
                            toggleStatus(
                              cat._id,
                              "showInSignup",
                              cat.showInSignup,
                            )
                          }
                          className={cn(
                            "mx-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                            cat.showInSignup
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground/30 hover:bg-muted",
                          )}
                          title={
                            cat.showInSignup
                              ? "Shown in Signup"
                              : "Hidden from Signup"
                          }
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() =>
                            toggleStatus(
                              cat._id,
                              "showInDashboard",
                              cat.showInDashboard,
                            )
                          }
                          className={cn(
                            "mx-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                            cat.showInDashboard
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground/30 hover:bg-muted",
                          )}
                          title={
                            cat.showInDashboard
                              ? "Shown in Dashboard"
                              : "Hidden from Dashboard"
                          }
                        >
                          <LayoutDashboard className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.sortOrder}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                sortOrder: parseInt(e.target.value),
                              })
                            }
                            className="w-16 px-2 py-1 rounded border border-border bg-background text-sm font-bold"
                          />
                        ) : (
                          <span className="text-sm font-black text-muted-foreground">
                            {cat.sortOrder}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditForm(null);
                              }}
                              className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <PenTool className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editingId && editForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-8 right-8 lg:left-80 p-6 bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col md:flex-row gap-6"
          >
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-primary" />
                  Quick Edit: {editForm.label}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  ID: {editForm._id}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Text Fields */}
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Label
                    </label>
                    <input
                      type="text"
                      value={editForm.label}
                      onChange={(e) =>
                        setEditForm({ ...editForm, label: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all h-20 resize-none"
                    />
                  </div>
                </div>

                {/* Status Toggles */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-1">
                    Core Status
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Is Active
                      </span>
                      <button
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            isActive: !editForm.isActive,
                          })
                        }
                        className={cn(
                          "w-10 h-5 rounded-full transition-all relative",
                          editForm.isActive ? "bg-emerald-500" : "bg-muted",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                            editForm.isActive ? "left-6" : "left-1",
                          )}
                        />
                      </button>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Is Available
                      </span>
                      <button
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            isAvailable: !editForm.isAvailable,
                          })
                        }
                        className={cn(
                          "w-10 h-5 rounded-full transition-all relative",
                          editForm.isAvailable ? "bg-blue-500" : "bg-muted",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                            editForm.isAvailable ? "left-6" : "left-1",
                          )}
                        />
                      </button>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Is Locked
                      </span>
                      <button
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            isLocked: !editForm.isLocked,
                          })
                        }
                        className={cn(
                          "w-10 h-5 rounded-full transition-all relative",
                          editForm.isLocked ? "bg-amber-500" : "bg-muted",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                            editForm.isLocked ? "left-6" : "left-1",
                          )}
                        />
                      </button>
                    </label>
                  </div>
                  {editForm.isLocked && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Locked Reason
                      </label>
                      <input
                        type="text"
                        value={editForm.lockedReason || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            lockedReason: e.target.value,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs font-semibold outline-none"
                        placeholder="e.g. Coming soon"
                      />
                    </div>
                  )}
                </div>

                {/* Visibility Settings */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-1">
                    Visibility
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Show on Home
                      </span>
                      <button
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            showOnHome: !editForm.showOnHome,
                          })
                        }
                        className={cn(
                          "w-10 h-5 rounded-full transition-all relative",
                          editForm.showOnHome ? "bg-primary" : "bg-muted",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                            editForm.showOnHome ? "left-6" : "left-1",
                          )}
                        />
                      </button>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Show in Signup
                      </span>
                      <button
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            showInSignup: !editForm.showInSignup,
                          })
                        }
                        className={cn(
                          "w-10 h-5 rounded-full transition-all relative",
                          editForm.showInSignup ? "bg-primary" : "bg-muted",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                            editForm.showInSignup ? "left-6" : "left-1",
                          )}
                        />
                      </button>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Show in Dashboard
                      </span>
                      <button
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            showInDashboard: !editForm.showInDashboard,
                          })
                        }
                        className={cn(
                          "w-10 h-5 rounded-full transition-all relative",
                          editForm.showInDashboard ? "bg-primary" : "bg-muted",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                            editForm.showInDashboard ? "left-6" : "left-1",
                          )}
                        />
                      </button>
                    </label>
                  </div>

                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Badge
                      </label>
                      <input
                        type="text"
                        value={editForm.badge || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, badge: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg border border-border bg-muted/30 text-xs font-semibold"
                        placeholder="New"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Icon
                      </label>
                      <select
                        value={editForm.icon}
                        onChange={(e) =>
                          setEditForm({ ...editForm, icon: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg border border-border bg-muted/30 text-xs font-semibold outline-none"
                      >
                        {Object.keys(iconMap).map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-2 shrink-0 md:min-w-[160px]">
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditForm(null);
                }}
                className="px-6 py-2.5 rounded-xl border border-border font-bold text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
