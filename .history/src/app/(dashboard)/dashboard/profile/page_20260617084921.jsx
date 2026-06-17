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
  ShieldCheck,
  Key,
  Lock,
  X,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { toast } from "@/components/dashboard/Toast";
import { useUser } from "@/context/UserContext";

function SecurityModal({ isOpen, onClose }) {
  const { user } = useUser();
  const [step, setStep] = useState(1); // 1: Initial, 2: Code Sent, 3: Success
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/security/send-code", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        toast("Verification code sent to your email!");
        setStep(2);
      } else {
        toast(data.message || "Failed to send code", "error");
      }
    } catch (err) {
      toast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/security/verify-and-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast("Password changed successfully!");
        setStep(3);
      } else {
        toast(data.message || "Invalid code or error", "error");
      }
    } catch (err) {
      toast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-card border-2 border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="w-6 h-6" />
            </button>

            {step === 1 && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tighter">
                  Verify Identity
                </h2>
                <p className="text-base text-muted-foreground font-medium mb-10 leading-relaxed">
                  To change your password, we need to verify it's really you. A
                  6-digit code will be sent to{" "}
                  <span className="text-foreground font-bold">
                    {user?.email}
                  </span>
                  .
                </p>
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="site-primary-button w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                  Send Verification Code
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyAndChange}>
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tighter text-center">
                  Change Password
                </h2>
                <p className="text-sm text-center text-muted-foreground font-bold uppercase tracking-widest mb-10">
                  Step 2 of 2
                </p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-16 text-center text-3xl font-black tracking-[0.5em] rounded-2xl border-2 border-border bg-muted/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                      New Secure Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-border bg-muted/20 font-bold focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="site-primary-button w-full py-4 rounded-2xl text-base font-bold mt-4 flex items-center justify-center gap-3 transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Update Password"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Didn't get code? Send again
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-6">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter">
                  Security Updated!
                </h2>
                <p className="text-lg text-muted-foreground font-semibold mb-10">
                  Your password has been changed successfully. Your account is
                  now even more secure.
                </p>
                <button
                  onClick={onClose}
                  className="site-primary-button w-full py-4 rounded-2xl text-base font-bold"
                >
                  Back to Profile
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function DashboardProfilePage() {
  const { user, refreshUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

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
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="w-full py-4 rounded-2xl border-2 border-border text-sm font-black text-muted-foreground hover:bg-muted hover:text-foreground transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Change Security Password
            </button>
          </DashboardCard>
        </div>
      </div>

      {/* Security Modal */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </DashboardShell>
  );
}
