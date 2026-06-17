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

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <DashboardCard className="p-8">
            <form onSubmit={handleSave} className="space-y-10">
              {/* Avatar Section */}
              <div>
                <h3 className="text-base font-bold text-foreground mb-6 flex items-center gap-2.5">
                  <UserCircle className="w-5 h-5 text-primary" /> Profile Photo
                </h3>
                <div className="flex items-center gap-10">
                  <div className="relative group">
                    {user?.profileImage?.url ? (
                      <img
                        src={user.profileImage.url}
                        alt={user.name}
                        className="w-32 h-32 rounded-3xl object-cover border-4 border-primary/10 shadow-2xl"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-background/70 backdrop-blur-md rounded-3xl flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="site-primary-button flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer shadow-lg">
                        <Upload className="w-4 h-4" />
                        Upload New Photo
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
                          className="p-3 rounded-xl border-2 border-destructive/10 text-destructive hover:bg-destructive/10 transition-all shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      Allowed formats:{" "}
                      <span className="text-foreground font-bold">
                        JPG, PNG, WebP
                      </span>
                      . <br />
                      Max size:{" "}
                      <span className="text-foreground font-bold">5MB</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/60" />

              {/* Personal Info */}
              <div className="space-y-8">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-primary" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em]">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-2xl border-2 border-border bg-background/50 text-base font-semibold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full h-14 px-5 rounded-2xl border-2 border-border bg-muted/40 text-base font-bold text-muted-foreground cursor-not-allowed outline-none opacity-80"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em]">
                      Profession
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input
                        name="profile.profession"
                        type="text"
                        placeholder="Web Developer, Designer, etc."
                        value={formData.profile.profession}
                        onChange={handleChange}
                        className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-border bg-background/50 text-base font-semibold focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em]">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input
                        name="profile.company"
                        type="text"
                        placeholder="Microsoft, Freelance, etc."
                        value={formData.profile.company}
                        onChange={handleChange}
                        className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-border bg-background/50 text-base font-semibold focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <div className="space-y-2.5">
                    <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em]">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input
                        name="profile.phone"
                        type="text"
                        placeholder="+1 234 567 890"
                        value={formData.profile.phone}
                        onChange={handleChange}
                        className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-border bg-background/50 text-base font-semibold focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em]">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input
                        name="profile.whatsapp"
                        type="text"
                        placeholder="+1 234 567 890"
                        value={formData.profile.whatsapp}
                        onChange={handleChange}
                        className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-border bg-background/50 text-base font-semibold focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em] flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </label>
                  <input
                    name="profile.location"
                    type="text"
                    placeholder="San Francisco, CA"
                    value={formData.profile.location}
                    onChange={handleChange}
                    className="w-full h-14 px-5 rounded-2xl border-2 border-border bg-background/50 text-base font-semibold focus:border-primary outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2.5 mt-6">
                  <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.1em] flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Bio / Professional Summary
                  </label>
                  <textarea
                    name="profile.bio"
                    rows={5}
                    placeholder="Tell us a little about your professional journey..."
                    value={formData.profile.bio}
                    onChange={handleChange}
                    className="w-full p-5 rounded-2xl border-2 border-border bg-background/50 text-base font-semibold focus:border-primary outline-none transition-all shadow-sm resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-10 border-t-2 border-border/40">
                <button
                  type="submit"
                  disabled={loading}
                  className="site-primary-button flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-bold shadow-xl shadow-primary/20"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save All Changes
                </button>
              </div>
            </form>
          </DashboardCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <DashboardCard className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 p-6 shadow-lg">
            <h3 className="text-base font-black mb-6 uppercase tracking-widest text-primary">
              Account Status
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">
                  Current Plan
                </span>
                <span className="site-badge-emerald text-xs font-black tracking-widest shadow-sm">
                  {user?.plan}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">
                  Total Credits
                </span>
                <span className="text-sm font-black text-foreground">
                  {user?.credits} remaining
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">
                  User Role
                </span>
                <span className="text-sm font-black text-foreground capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">
                  Member Since
                </span>
                <span className="text-sm font-bold text-foreground">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="p-6">
            <h3 className="text-base font-black mb-6 uppercase tracking-widest text-foreground">
              Internal Security
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-medium">
              Registered email: <br />
              <span className="text-foreground font-bold underline decoration-primary/40 decoration-2 underline-offset-4">
                {user?.email}
              </span>
            </p>
            <button className="w-full py-3.5 rounded-2xl border-2 border-border text-sm font-black text-muted-foreground hover:bg-muted hover:text-foreground transition-all shadow-sm">
              Change Security Password
            </button>
          </DashboardCard>
        </div>
      </div>
    </DashboardShell>
  );
}
