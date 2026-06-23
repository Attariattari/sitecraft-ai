"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPurposeLimitByPlan } from "@/lib/purposeLimits";
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
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Lock,
} from "lucide-react";
import { SiteCraftLoader } from "@/components/common/SiteCraftLoader";

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

function AccountPurposeContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [primaryPurpose, setPrimaryPurpose] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories/available?context=signup");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch signup categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.authenticated) {
          setUser(data.user);
          // Pre-populate if they already have some
          if (data.user.selectedPurposes?.length > 0) {
            setSelectedPurposes(data.user.selectedPurposes);
            setPrimaryPurpose(
              data.user.primaryPurpose || data.user.selectedPurposes[0],
            );
          } else if (data.user.accountPurpose) {
            setSelectedPurposes([data.user.accountPurpose]);
            setPrimaryPurpose(data.user.accountPurpose);
          }
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

  const limit = user ? getPurposeLimitByPlan(user.plan) : 1;

  const togglePurpose = (id) => {
    setError("");
    if (selectedPurposes.includes(id)) {
      const filtered = selectedPurposes.filter((p) => p !== id);
      setSelectedPurposes(filtered);
      if (primaryPurpose === id) {
        setPrimaryPurpose(filtered[0] || "");
      }
    } else {
      if (selectedPurposes.length >= limit) {
        setError(
          `Your current plan (${user.plan}) allows only ${limit} website purpose${limit > 1 ? "s" : ""}. Upgrade to select more.`,
        );
        return;
      }
      const updated = [...selectedPurposes, id];
      setSelectedPurposes(updated);
      if (!primaryPurpose) {
        setPrimaryPurpose(id);
      }
    }
  };

  const handleContinue = async () => {
    if (selectedPurposes.length === 0) {
      setError("Please select at least one purpose to continue.");
      return;
    }

    if (!primaryPurpose && selectedPurposes.length > 0) {
      setPrimaryPurpose(selectedPurposes[0]);
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/user/purposes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPurposes,
          primaryPurpose: primaryPurpose || selectedPurposes[0],
        }),
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
      <SiteCraftLoader
        variant="fullscreen"
        text="Loading your profile and website purpose options..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 py-12 md:p-8">
      <div className="w-full max-w-5xl bg-[#141414] border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full -ml-32 -mb-32" />

        <div className="relative p-6 md:p-12">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 uppercase tracking-wider"
              id="step-indicator"
            >
              Step 1: Website Purpose
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              What kind of websites do you want to build?
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
              Based on your{" "}
              <span className="text-emerald-400 font-bold uppercase">
                {user?.plan}
              </span>{" "}
              plan, you can select up to{" "}
              <span className="text-white font-bold" id="limit-display">
                {limit === Infinity ? "all" : limit}
              </span>{" "}
              purpose{limit !== 1 ? "s" : ""}.
            </p>

            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/80">
                {selectedPurposes.length} of {limit === Infinity ? "∞" : limit}{" "}
                selected
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
              {selectedPurposes.length >= limit && limit !== Infinity && (
                <button
                  onClick={() => router.push("/dashboard/billing")}
                  className="ml-auto text-emerald-400 hover:underline font-bold"
                >
                  Upgrade Plan
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {categoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-2xl bg-white/5 animate-pulse border border-white/5"
                />
              ))
            ) : categories.length === 0 ? (
              <div className="col-span-full py-10 text-center text-white/40">
                No industries currently available.
              </div>
            ) : (
              categories.map((cat) => {
                const IconComp = iconMap[cat.icon] || Layout;
                const isSelected = selectedPurposes.includes(cat.slug);
                const isPrimary = primaryPurpose === cat.slug;
                const isDisabled = !cat.isSelectable;

                return (
                  <button
                    key={cat._id}
                    id={`purpose-${cat.slug}`}
                    disabled={isDisabled}
                    title={
                      isDisabled
                        ? cat.lockedReason ||
                          "This category is currently unavailable."
                        : ""
                    }
                    onClick={() => !isDisabled && togglePurpose(cat.slug)}
                    className={`group relative text-left p-5 rounded-2xl border transition-all duration-300 transform flex flex-col ${
                      isDisabled
                        ? "opacity-60 grayscale bg-[#1c1c1c] border-white/5 cursor-not-allowed"
                        : isSelected
                          ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/5 hover:scale-[1.02]"
                          : "bg-[#1c1c1c] border-white/5 hover:border-white/20 hover:bg-[#222222] hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                      {isDisabled && (
                        <div className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border border-orange-500/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          {cat.displayStatus || "Coming Soon"}
                        </div>
                      )}
                      {isSelected && (
                        <div className="text-emerald-500 animate-in fade-in zoom-in duration-300">
                          <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-[#0a0a0a]" />
                        </div>
                      )}
                    </div>

                    <div
                      className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                        isDisabled
                          ? "bg-white/5 text-white/20"
                          : isSelected
                            ? "bg-emerald-500 text-[#0a0a0a]"
                            : "bg-[#252525] group-hover:bg-[#2a2a2a] text-white/70"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    <h3
                      className={`text-[17px] font-bold mb-2 transition-colors ${isDisabled ? "text-white/40" : "text-white group-hover:text-emerald-400"}`}
                    >
                      {cat.label}
                    </h3>
                    <p
                      className={`text-[13px] leading-tight flex-1 ${isDisabled ? "text-white/20" : "text-white/40"}`}
                    >
                      {cat.description}
                    </p>

                    {isDisabled && cat.lockedReason && (
                      <p className="mt-2 text-[10px] text-orange-400/60 font-medium italic">
                        {cat.lockedReason}
                      </p>
                    )}

                    {isSelected &&
                      selectedPurposes.length > 1 &&
                      !isDisabled && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrimaryPurpose(cat.slug);
                          }}
                          className={`mt-4 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                            isPrimary
                              ? "bg-emerald-500 text-[#0a0a0a]"
                              : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white"
                          }`}
                        >
                          {isPrimary ? "Primary" : "Set as Primary"}
                        </div>
                      )}
                  </button>
                );
              })
            )}
          </div>

          <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="max-w-md text-center md:text-left">
                <h4 className="text-lg font-bold text-white mb-1">
                  Why pick multiple?
                </h4>
                <p className="text-white/40 text-sm italic">
                  SiteCraft AI lets you manage different business identities. By
                  picking multiple, we open up specialized templates and AI
                  models for each brand you run.
                </p>
              </div>
            </div>

            <button
              onClick={handleContinue}
              id="continue-button"
              disabled={saving || selectedPurposes.length === 0}
              className="w-full md:w-auto px-10 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0a0a] font-black text-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 group"
            >
              {saving ? (
                <>
                  <SiteCraftLoader variant="button" text="Saving configuration" />
                  Saving Configuration...
                </>
              ) : (
                <>
                  Continue to Personal Info
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-white/20 text-xs italic">
              * Website generation counts toward your monthly credit limit.{" "}
              <br />
              Selection limits apply to active profiles, not generated sites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPurposePage() {
  return (
    <React.Suspense
      fallback={
        <SiteCraftLoader
          variant="fullscreen"
          text="Loading your profile and website purpose options..."
        />
      }
    >
      <AccountPurposeContent />
    </React.Suspense>
  );
}
