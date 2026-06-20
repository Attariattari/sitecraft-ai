"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Layout,
  Sparkles,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Mail,
  ListRestart,
  Globe,
  Settings,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getAccountPurposeConfig,
  getDashboardCopy,
  getRecommendedThemesForPurpose,
} from "@/lib/accountPurposeResolver";

// Simplified Components
import { TemplateSelector } from "@/components/dashboard/generate/TemplateSelector";
import { ThemeSelector } from "@/components/dashboard/generate/ThemeSelector";
import { GenerateSummaryCard } from "@/components/dashboard/generate/GenerateSummaryCard";
import { GenerateLoadingState } from "@/components/dashboard/generate/GenerateLoadingState";

const formSchema = z.object({
  fullName: z.string().min(2, "Name or Brand Name is required."),
  profession: z.string().min(2, "Profession / Role is required."),
  bio: z
    .string()
    .min(10, "Your bio/description must be at least 10 chars.")
    .max(1000),
  contactEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  projectLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  templateId: z.string().default("modern"),
  themeKey: z.string().default("emerald"),
});

const STEPS = [
  { id: "profile", title: "Your Profile" },
  { id: "projects", title: "Projects" },
  { id: "design", title: "Design Choice" },
];

export function GenerateForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [usePersonalInfo, setUsePersonalInfo] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [dashboardCopy, setDashboardCopy] = useState({});
  const [recommendedTheme, setRecommendedTheme] = useState("emerald");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      profession: "",
      bio: "",
      contactEmail: "",
      projectTitle: "",
      projectDescription: "",
      projectLink: "",
      templateId: "modern",
      themeKey: "emerald",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = form;
  const watchedData = watch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const { user: userData } = await userRes.json();
          setUser(userData);
          const primary =
            userData.primaryPurpose || userData.accountPurpose || "portfolio";
          setSelectedPurpose(primary);

          const copy = getDashboardCopy(primary);
          setDashboardCopy(copy);

          const themes = getRecommendedThemesForPurpose(primary);
          setRecommendedTheme(themes[0] || "emerald");
          form.setValue("themeKey", themes[0] || "emerald");
        }

        const infoRes = await fetch("/api/user/personal-info");
        const infoData = await infoRes.json();
        if (infoData.success) {
          setPersonalInfo(infoData);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setInfoLoading(false);
      }
    };
    fetchData();
  }, [form]);

  // Handle purpose change
  const handlePurposeChange = (purpose) => {
    setSelectedPurpose(purpose);
    const copy = getDashboardCopy(purpose);
    setDashboardCopy(copy);
    const themes = getRecommendedThemesForPurpose(purpose);
    setRecommendedTheme(themes[0] || "emerald");
    setValue("themeKey", themes[0] || "emerald");
    setUsePersonalInfo(false); // Reset auto-fill if purpose changes
  };

  const handleUsePersonalInfo = () => {
    if (!personalInfo) return;
    setUsePersonalInfo(true);

    const shared = personalInfo.sharedInfo || {};
    const purposeSpecific = personalInfo.purposeInfo?.[selectedPurpose] || {};

    // Auto-fill form from combined data
    setValue(
      "fullName",
      shared.fullName || shared.displayName || watchedData.fullName,
    );
    setValue("contactEmail", shared.email || watchedData.contactEmail);
    setValue(
      "bio",
      shared.bio ||
        purposeSpecific.aboutMe ||
        purposeSpecific.careerObjective ||
        watchedData.bio,
    );

    // Purpose specific title/profession
    const professionFallback =
      purposeSpecific.professionalTitle ||
      purposeSpecific.businessType ||
      purposeSpecific.salonType;
    setValue("profession", professionFallback || watchedData.profession);

    // Grab first project if exists
    const projects = purposeSpecific.projects || purposeSpecific.services || [];
    if (projects.length > 0) {
      const p = projects[0];
      setValue(
        "projectTitle",
        p.projectTitle || p.serviceTitle || p.serviceName || "",
      );
      setValue(
        "projectDescription",
        p.projectDescription || p.serviceDescription || "",
      );
      setValue("projectLink", p.liveLink || "");
    }
  };

  const handleNext = async () => {
    let fields = [];
    if (currentStep === 0)
      fields = ["fullName", "profession", "bio", "contactEmail"];
    if (currentStep === 1) fields = ["projectTitle"];

    if (await trigger(fields)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data) => {
    setIsGenerating(true);
    const apiData = {
      ...data,
      category: selectedPurpose,
      accountPurpose: selectedPurpose,
      sharedInfo: personalInfo?.sharedInfo,
      purposeInfo: personalInfo?.purposeInfo?.[selectedPurpose],
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });
      const result = await res.json();
      if (res.ok && result.siteId) {
        window.location.href = `/result/${result.siteId}`;
      } else {
        throw new Error(result.error || "Failed to generate site.");
      }
    } catch (e) {
      alert(e.message);
      setIsGenerating(false);
    }
  };

  if (isGenerating) return <GenerateLoadingState />;

  const selectedPurposes = user?.selectedPurposes || [];

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-0 pb-20">
      <div className="mb-10 lg:mb-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-black text-foreground mb-4 leading-tight tracking-tight">
              {dashboardCopy.generateTitle || "Generate Your Website"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {dashboardCopy.generateSubtitle ||
                "Create a stunning website for your specific niche."}
            </p>
          </div>

          {selectedPurposes.length > 1 && (
            <div className="bg-muted/30 p-2 rounded-2xl border border-border flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground px-2">
                Generate for:
              </span>
              <div className="flex gap-1">
                {selectedPurposes.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePurposeChange(p)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      selectedPurpose === p
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {getAccountPurposeConfig(p).label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-black transition-all",
                  currentStep === idx
                    ? "bg-primary border-primary text-white"
                    : currentStep > idx
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : "bg-muted border-border text-muted-foreground/60",
                )}
              >
                {currentStep > idx ? "✓" : idx + 1}
              </div>
              <span
                className={cn(
                  "hidden lg:block text-[12px] font-black uppercase tracking-wider",
                  currentStep === idx
                    ? "text-foreground"
                    : "text-muted-foreground/60",
                )}
              >
                {step.title}
              </span>
              {idx < STEPS.length - 1 && (
                <div className="hidden sm:block w-8 h-[2px] bg-border mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Personal Info Banner */}
        {!infoLoading && personalInfo?.sharedInfo ? (
          <div className="mt-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-emerald-500 font-bold text-sm">
                  Pro Personal Info Sync Available
                </h3>
                <p className="text-emerald-500/70 text-xs mt-0.5 font-medium">
                  Inject your global shared info + {selectedPurpose} specific
                  details for high-fidelity generation.
                </p>
              </div>
            </div>
            <Button
              onClick={handleUsePersonalInfo}
              disabled={usePersonalInfo}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 rounded-xl"
            >
              {usePersonalInfo
                ? "Data Injected ✓"
                : "Auto-Fill with AI Context"}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <form className="space-y-10">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-black">1. Brand & Profile</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup
                      label="Name / Brand Name"
                      error={errors.fullName?.message}
                    >
                      <Input
                        {...register("fullName")}
                        placeholder="e.g. Creative Studio"
                        className="site-input"
                      />
                    </FormGroup>
                    <FormGroup
                      label="Profession / Role"
                      error={errors.profession?.message}
                    >
                      <Input
                        {...register("profession")}
                        placeholder="e.g. Design Agency"
                        className="site-input"
                      />
                    </FormGroup>
                  </div>
                  <FormGroup
                    label="Website Bio / Narrative"
                    error={errors.bio?.message}
                    helper="Write what you want your audience to know. AI builds your pages based on this."
                  >
                    <textarea
                      {...register("bio")}
                      className="site-textarea"
                      placeholder="Tell the world your story..."
                    />
                  </FormGroup>
                  <FormGroup
                    label="Contact Email"
                    error={errors.contactEmail?.message}
                  >
                    <div className="relative">
                      <Input
                        {...register("contactEmail")}
                        placeholder="hello@brand.com"
                        className="site-input pl-11"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </FormGroup>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-black">
                      2. Featured Work / Services
                    </h2>
                  </div>
                  <Card className="p-8 bg-muted/20 border-border rounded-3xl space-y-6">
                    <FormGroup label="Service / Project Title">
                      <Input
                        {...register("projectTitle")}
                        placeholder="e.g. AI Implementation"
                        className="site-input bg-background"
                      />
                    </FormGroup>
                    <FormGroup label="Description">
                      <textarea
                        {...register("projectDescription")}
                        placeholder="Brief details about this highlight..."
                        className="site-textarea bg-background h-32 min-h-0"
                      />
                    </FormGroup>
                    <FormGroup label="External Link (Optional)">
                      <Input
                        {...register("projectLink")}
                        placeholder="https://..."
                        className="site-input bg-background"
                      />
                    </FormGroup>
                  </Card>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-12"
                >
                  <div className="space-y-8">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Layout className="w-5 h-5 text-primary" /> Layout Choice
                    </h3>
                    <TemplateSelector
                      value={watchedData.templateId}
                      onChange={(id) => setValue("templateId", id)}
                      accountPurpose={selectedPurpose}
                    />
                  </div>
                  <div className="space-y-8">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-primary" /> Color &
                      Theme
                    </h3>
                    <ThemeSelector
                      value={watchedData.themeKey}
                      onChange={(key) => setValue("themeKey", key)}
                      accountPurpose={selectedPurpose}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-8 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="font-bold"
              >
                Back
              </Button>
              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="site-primary-button px-10 h-14 rounded-xl font-black"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="site-primary-button px-12 h-14 rounded-xl font-black shadow-xl shadow-primary/20 gap-3"
                >
                  Construct AI Website <Rocket className="w-5 h-5" />
                </Button>
              )}
            </div>
          </form>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <GenerateSummaryCard
            formData={{
              ...watchedData,
              websiteTitle: watchedData.profession,
              description: watchedData.bio,
            }}
            isPending={isGenerating}
            onGenerate={currentStep === 2 ? handleSubmit(onSubmit) : handleNext}
          />
        </aside>
      </div>

      <style jsx global>{`
        .site-input {
          height: 54px !important;
          font-size: 15px !important;
          border-radius: 12px !important;
          border-color: rgba(var(--border), 0.5);
        }
        .site-textarea {
          min-height: 140px !important;
          font-size: 15px !important;
          border-radius: 16px !important;
          padding: 16px !important;
          border: 1px solid rgba(var(--border), 0.5);
          width: 100%;
          transition: all 0.2s;
        }
        .site-textarea:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08) !important;
          outline: none;
        }
      `}</style>
    </div>
  );
}

function FormGroup({ label, error, helper, children }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label className="text-[13px] font-bold text-foreground">{label}</Label>
        {error && (
          <span className="text-[10px] font-black text-red-500 uppercase">
            {error}
          </span>
        )}
      </div>
      {children}
      {helper && (
        <p className="text-[12px] text-muted-foreground font-medium px-1">
          {helper}
        </p>
      )}
    </div>
  );
}
