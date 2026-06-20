"use client";

import {
  UserCircle,
  Mail,
  Briefcase,
  Building,
  Upload,
  Save,
} from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useState } from "react";
import { toast } from "@/components/dashboard/Toast";

export default function DashboardProfilePage() {
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast("Profile updated successfully!");
  };

  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Profile Settings"
        description="Manage your personal information and public profile details."
      />

      <div className="max-w-3xl">
        <DashboardCard>
          <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar Section */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Profile Photo</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  U
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    className="site-secondary-button flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border my-6" />

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-muted-foreground" />{" "}
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="User"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" /> Email
                    Address
                  </label>
                  <input
                    type="email"
                    defaultValue="user@example.com"
                    disabled
                    className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm text-muted-foreground cursor-not-allowed outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />{" "}
                    Profession
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />{" "}
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 mt-4">
                <label className="text-sm font-medium text-foreground">
                  Bio
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us a little about yourself..."
                  className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:border-primary outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="submit"
                disabled={loading}
                className="site-primary-button flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </DashboardCard>
      </div>
    </DashboardShell>
  );
}
