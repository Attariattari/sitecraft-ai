"use client";

import React, { useState, useEffect } from "react";
import {
  UserCircle,
  Mail,
  Briefcase,
  Building,
  Upload,
  Save,
  Phone,
  MessageCircle,
  MapPin,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { toast } from "@/components/dashboard/Toast";
import { useUser } from "@/context/UserContext";

export default function DashboardProfilePage() {
  const { user, refreshUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    profile: {
      phone: "",
      whatsapp: "",
      profession: "",
      company: "",
      bio: "",
      location: "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        profile: {
          phone: user.profile?.phone || "",
          whatsapp: user.profile?.whatsapp || "",
          profession: user.profile?.profession || "",
          company: user.profile?.company || "",
          bio: user.profile?.bio || "",
          location: user.profile?.location || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast("Profile updated successfully!");
        refreshUser();
      } else {
        toast(data.message || "Failed to update profile", "error");
      }
    } catch (err) {
      toast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = React.useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Image size exceeds 5MB", "error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const base64data = reader.result;
          const res = await fetch("/api/user/profile-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64data }),
          });
          const data = await res.json();
          if (data.success) {
            toast("Profile photo updated!");
            refreshUser();
          } else {
            toast(data.message || "Upload failed", "error");
          }
        } catch (err) {
          toast("Upload failed", "error");
        } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
    } catch (err) {
      toast("Upload failed", "error");
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("Remove profile photo?")) return;

    setUploading(true);
    try {
      const res = await fetch("/api/user/profile-image", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast("Profile photo removed");
        refreshUser();
      }
    } catch (err) {
      toast("Action failed", "error");
    } finally {
      setUploading(false);
    }
  };

  if (userLoading) return null;

  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Profile Settings"
        description="Manage your personal information and public profile details."
      />

      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardCard>
            <form onSubmit={handleSave} className="space-y-8">
              {/* Avatar Section */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-primary" /> Profile Photo
                </h3>
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    {user?.profileImage?.url ? (
                      <img
                        src={user.profileImage.url}
                        alt={user.name}
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/20 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="site-primary-button flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        Upload New
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                      {user?.profileImage?.url && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={uploading}
                          className="p-2 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Allowed formats:{" "}
                      <span className="text-foreground font-medium">
                        JPG, PNG, WebP
                      </span>
                      . <br />
                      Max size:{" "}
                      <span className="text-foreground font-medium">5MB</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/50" />

              {/* Personal Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full h-11 px-4 rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground cursor-not-allowed outline-none opacity-80"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Profession
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input
                        name="profile.profession"
                        type="text"
                        placeholder="Web Developer, Designer, etc."
                        value={formData.profile.profession}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background/50 text-sm focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input
                        name="profile.company"
                        type="text"
                        placeholder="Microsoft, Freelance, etc."
                        value={formData.profile.company}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background/50 text-sm focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input
                        name="profile.phone"
                        type="text"
                        placeholder="+1 234 567 890"
                        value={formData.profile.phone}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background/50 text-sm focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input
                        name="profile.whatsapp"
                        type="text"
                        placeholder="+1 234 567 890"
                        value={formData.profile.whatsapp}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background/50 text-sm focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </label>
                  <input
                    name="profile.location"
                    type="text"
                    placeholder="San Francisco, CA"
                    value={formData.profile.location}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background/50 text-sm focus:border-primary outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5 mt-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Bio / Description
                  </label>
                  <textarea
                    name="profile.bio"
                    rows={4}
                    placeholder="Tell us a little about yourself..."
                    value={formData.profile.bio}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-border bg-background/50 text-sm focus:border-primary outline-none transition-all shadow-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border/50">
                <button
                  type="submit"
                  disabled={loading}
                  className="site-primary-button flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </DashboardCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <DashboardCard className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
            <h3 className="text-sm font-bold mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Plan</span>
                <span className="text-xs font-bold uppercase tracking-wider site-badge-emerald px-2 py-0.5">
                  {user?.plan}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Credits</span>
                <span className="text-xs font-bold text-foreground">
                  {user?.credits} remaining
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Role</span>
                <span className="text-xs font-bold text-foreground capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Joined</span>
                <span className="text-xs font-medium text-foreground">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <h3 className="text-sm font-bold mb-4">Security</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Your email address is{" "}
              <span className="text-foreground font-medium underline decoration-primary/30 decoration-2 underline-offset-2">
                {user?.email}
              </span>
              . You can update your password in the settings tab.
            </p>
            <button className="w-full py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-all">
              Change Password
            </button>
          </DashboardCard>
        </div>
      </div>
    </DashboardShell>
  );
}
