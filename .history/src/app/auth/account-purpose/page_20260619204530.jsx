"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { siteCraftPersonalInfoCategories } from "@/lib/data";
import {
  User,
  Briefcase,
  Scissors,
  ShoppingBag,
  Utensils,
  Stethoscope,
  Home,
  Megaphone,
  GraduationCap,
  Layout,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const iconMap = {
  User,
  Briefcase,
  Scissors,
  ShoppingBag,
  Utensils,
  Stethoscope,
  Home,
  Megaphone,
  GraduationCap,
  Layout,
};

export default function AccountPurposePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromGoogle = searchParams.get("from") === "google";

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.authenticated) {
          if (data.user.accountPurpose) {
            router.replace("/dashboard");
            return;
          }
          setUser(data.user);
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleContinue = async () => {
    if (!selectedPurpose) {
      setError("Please select a purpose to continue.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/user/account-purpose", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountPurpose: selectedPurpose }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/personal-info");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="mt-4 text-emerald-100 font-medium">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 py-12 md:p-8">
      <div className="w-full max-w-4xl bg-[#141414] border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full -ml-32 -mb-32" />

        <div className="relative p-8 md:p-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 uppercase tracking-wider">
            Onboarding
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            What do you want to build with SiteCraft AI?
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            Choose your website purpose so we can personalize your dashboard,
            Personal Info form, templates, themes, and AI generation.
          </p>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {siteCraftPersonalInfoCategories.map((cat) => {
              const IconComp = iconMap[cat.icon] || Layout;
              const isSelected = selectedPurpose === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedPurpose(cat.id)}
                  className={`group relative text-left p-6 rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/5"
                      : "bg-[#1c1c1c] border-white/5 hover:border-white/20 hover:bg-[#222222]"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-emerald-500 text-white"
                        : "bg-[#252525] group-hover:bg-[#2a2a2a] text-white/70"
                    }`}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-white/40 text-sm leading-snug">
                    {cat.description}
                  </p>

                  {isSelected && (
                    <div className="absolute top-4 right-4 text-emerald-500 animate-in fade-in zoom-in duration-300">
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-[#0a0a0a]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleContinue}
              disabled={saving}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0a0a] font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </>
              )}
            </button>
          </div>

          <p className="mt-8 text-white/30 text-xs italic">
            You can change your purpose later in the account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
