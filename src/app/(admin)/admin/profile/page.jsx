"use client";

import React, { useState, useEffect } from "react";
import {
  UserCircle,
  Upload,
  Save,
  Loader2,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  Building,
  MapPin,
  FileText,
  CheckCircle2,
  Key,
  Lock,
  X,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
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
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
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
                      className="w-full h-16 text-center text-3xl font-black tracking-[0.5em] rounded-2xl border border-border bg-muted/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30"
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
                        className="w-full h-14 pl-12 pr-5 rounded-2xl border border-border bg-muted/20 font-bold focus:border-primary outline-none transition-all"
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

export default function AdminProfilePage() {
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

  if (userLoading) {
    return (
      <AdminShell>
        <AdminPageHeader
          title="Profile Settings"
          description="Loading..."
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Profile Settings"
        description="Manage your personal information and profile picture."
      />

      <div className="max-w-4xl space-y-6">
        {/* Profile Picture Card */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2.5">
            <UserCircle className="w-5 h-5 text-primary" /> Profile Picture
          </h3>
          <div className="flex items-center gap-8 flex-col sm:flex-row">
            <div className="relative group">
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.name}
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-primary/20 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-4xl font-black shadow-lg">
                  {user?.name?.[0]?.toUpperCase() || "S"}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-sm text-muted-foreground">
                Upload a profile picture to personalize your admin account.
              </p>
              <div className="flex gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors font-semibold text-sm">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {user?.profileImage?.url && (
                  <button
                    onClick={handleRemoveImage}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-semibold text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Max file size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-lg font-bold text-foreground mb-6">
            Personal Information
          </h3>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-primary" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Phone
                </label>
                <input
                  type="tel"
                  name="profile.phone"
                  value={formData.profile.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Profession
                </label>
                <input
                  type="text"
                  name="profile.profession"
                  value={formData.profile.profession}
                  onChange={handleChange}
                  placeholder="Your profession"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" /> Company
                </label>
                <input
                  type="text"
                  name="profile.company"
                  value={formData.profile.company}
                  onChange={handleChange}
                  placeholder="Your company"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Location
                </label>
                <input
                  type="text"
                  name="profile.location"
                  value={formData.profile.location}
                  onChange={handleChange}
                  placeholder="Your location"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Bio
              </label>
              <textarea
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" /> WhatsApp
              </label>
              <input
                type="tel"
                name="profile.whatsapp"
                value={formData.profile.whatsapp}
                onChange={handleChange}
                placeholder="Your WhatsApp number"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </form>
        </div>

        {/* Security Card */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-primary" /> Security
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Manage your account security and password settings.
          </p>
          <button
            onClick={() => setIsSecurityModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-sm transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => {
          setIsSecurityModalOpen(false);
        }}
      />
    </AdminShell>
  );
}
