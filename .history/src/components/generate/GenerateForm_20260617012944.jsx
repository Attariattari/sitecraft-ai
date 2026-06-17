"use client";

import React, { useState } from "react";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Simplified Components
import { TemplateSelector } from "@/components/dashboard/generate/TemplateSelector";
import { ThemeSelector } from "@/components/dashboard/generate/ThemeSelector";
import { GenerateSummaryCard } from "@/components/dashboard/generate/GenerateSummaryCard";
import { GenerateLoadingState } from "@/components/dashboard/generate/GenerateLoadingState";

const formSchema = z.object({
  // Basic Detail
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

  // Work/Projects
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  projectLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),

  // Design
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

  React.useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch("/api/dashboard/personal-info");
        const json = await res.json();
        if (json.success && json.data) {
          setPersonalInfo(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInfoLoading(false);
      }
    }
    fetchInfo();
  }, []);

  const handleUsePersonalInfo = () => {
    if (!personalInfo) return;
    setUsePersonalInfo(true);

    const p = personalInfo;
    setValue(
      "fullName",
      p.basicInfo?.fullName || p.basicInfo?.displayName || watchedData.fullName,
    );
    setValue(
      "profession",
      p.professionalDetails?.profession ||
        p.professionalDetails?.title ||
        watchedData.profession,
    );

    const bioFallback =
      p.professionalDetails?.professionalSummary ||
      p.professionalDetails?.whatIDo ||
      p.basicInfo?.shortBio ||
      watchedData.bio;
    setValue("bio", bioFallback || "");

    setValue(
      "contactEmail",
      p.contactInfo?.primaryEmail ||
        p.contactInfo?.businessEmail ||
        watchedData.contactEmail,
    );

    if (p.projects && p.projects.length > 0) {
      setValue("projectTitle", p.projects[0].title || watchedData.projectTitle);
      setValue(
        "projectDescription",
        p.projects[0].description || watchedData.projectDescription,
      );
      setValue(
        "projectLink",
        p.projects[0].liveLink ||
          p.projects[0].githubLink ||
          watchedData.projectLink,
      );
    }

    if (p.websitePreferences) {
      if (p.websitePreferences.defaultTemplate)
        setValue("templateId", p.websitePreferences.defaultTemplate);
      if (p.websitePreferences.defaultTheme)
        setValue("themeKey", p.websitePreferences.defaultTheme);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (currentStep === 0)
      fieldsToValidate = ["fullName", "profession", "bio", "contactEmail"];
    if (currentStep === 1) fieldsToValidate = ["projectTitle"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
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
      fullName: data.fullName,
      email: data.contactEmail || "user@sitecraft.ai",
      bio: data.bio,
      profession: data.profession,
      websiteGoal: data.profession,
      skills:
        usePersonalInfo && personalInfo?.skills?.length > 0
          ? personalInfo.skills.map((s) => s.name)
          : ["Core Skills"],
      services:
        usePersonalInfo && personalInfo?.services?.length > 0
          ? personalInfo.services.map((s) => s.title)
          : ["High-End Services"],
      projects: data.projectTitle
        ? [
            {
              title: data.projectTitle,
              description: data.projectDescription || "",
              tech: "Various Tech",
              link: data.projectLink || "",
            },
          ]
        : usePersonalInfo && personalInfo?.projects?.length > 0
          ? personalInfo.projects.map((p) => ({
              title: p.title,
              description: p.description,
              tech: p.technologies?.join(", ") || "Various Tech",
              link: p.liveLink || "",
            }))
          : [],
      templateId: data.templateId,
      themeKey: data.themeKey,
      colorMode: "dark",
      category: "portfolio",
      personalInfoContext: usePersonalInfo ? personalInfo : null,
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
      console.error(e);
      alert(e.message);
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return <GenerateLoadingState />;
  }

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-0 pb-20">
      {/* Header Section */}
      <div className="mb-10 lg:mb-14">
        <h1 className="text-[32px] md:text-[40px] font-black text-foreground mb-4 leading-tight tracking-tight">
          Redefine Your{" "}
          <span className="site-gradient-text">Personal Brand</span>
        </h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mt-8">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-black transition-all duration-300",
                  currentStep === idx
                    ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-110"
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
        {!infoLoading && personalInfo && personalInfo.completionScore > 0 ? (
          <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-emerald-500 font-bold text-sm">
                Saved Personal Info Available
              </h3>
              <p className="text-emerald-500/80 text-xs mt-1 font-medium">
                Use your saved info to pre-fill details and give AI complete
                context.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleUsePersonalInfo}
              disabled={usePersonalInfo}
              className="bg-emerald-600 shrink-0 hover:bg-emerald-700 text-white h-9 px-4 rounded-lg text-[13px] font-bold"
            >
              {usePersonalInfo ? "Applied ✓" : "Use Saved Info"}
            </Button>
          </div>
        ) : !infoLoading &&
          (!personalInfo || personalInfo.completionScore === 0) ? (
          <div className="mt-8 p-4 bg-muted/50 border border-border rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-foreground font-bold text-[13px]">
                Add your Personal Info for faster website generation
              </h3>
              <p className="text-muted-foreground text-[12px] mt-1 font-medium">
                Setup your profile once to get perfectly detailed AI websites
                continuously.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                (window.location.href = "/dashboard/personal-info")
              }
              className="h-9 shrink-0 px-4 rounded-lg text-[13px] font-bold border-border bg-background hover:bg-muted"
            >
              Add Personal Info
            </Button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8">
          <form className="space-y-12">
            <AnimatePresence mode="wait">
              {/* STEP 1: PERSONAL PROFILE (Everything used on web) */}
              {currentStep === 0 && (
                <motion.div
                  key="stepProfile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                      1. Personal Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormGroup
                      label="Full Name / Brand Name"
                      error={errors.fullName?.message}
                    >
                      <Input
                        {...register("fullName")}
                        placeholder="e.g. Johnathan Doe"
                        className="site-input"
                      />
                    </FormGroup>
                    <FormGroup
                      label="Profession / Role"
                      error={errors.profession?.message}
                    >
                      <Input
                        {...register("profession")}
                        placeholder="e.g. Senior Full Stack Developer"
                        className="site-input"
                      />
                    </FormGroup>
                  </div>

                  <FormGroup
                    label="Professional Bio (Long Description)"
                    error={errors.bio?.message}
                    helper="Write a detailed bio. Our AI will use this to generate all your website content and headlines."
                  >
                    <textarea
                      {...register("bio")}
                      className="site-textarea"
                      placeholder="I have 10 years of experience in..."
                    />
                  </FormGroup>

                  <FormGroup
                    label="Contact Email"
                    error={errors.contactEmail?.message}
                  >
                    <div className="relative">
                      <Input
                        {...register("contactEmail")}
                        placeholder="you@example.com"
                        className="site-input pl-10"
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </FormGroup>
                </motion.div>
              )}

              {/* STEP 2: PROJECTS */}
              {currentStep === 1 && (
                <motion.div
                  key="stepProjects"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                      2. Key Project Details
                    </h2>
                  </div>

                  <Card className="p-8 bg-muted/20 border-border/40 rounded-3xl">
                    <div className="space-y-8">
                      <FormGroup label="Featured Project Title">
                        <Input
                          {...register("projectTitle")}
                          placeholder="e.g. SiteCraft AI SaaS"
                          className="site-input bg-background"
                        />
                      </FormGroup>
                      <FormGroup label="Project Description">
                        <textarea
                          {...register("projectDescription")}
                          placeholder="What did you solve in this project?"
                          className="site-textarea bg-background"
                        />
                      </FormGroup>
                      <FormGroup label="Live Project Link (Optional)">
                        <Input
                          {...register("projectLink")}
                          placeholder="https://..."
                          className="site-input bg-background"
                        />
                      </FormGroup>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* STEP 3: DESIGN Choice */}
              {currentStep === 2 && (
                <motion.div
                  key="stepDesign"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-8">
                    <h2 className="text-2xl md:text-[26px] font-black tracking-tight flex items-center gap-3">
                      <Layout className="w-6 h-6 text-primary" /> Visual Layout
                    </h2>
                    <TemplateSelector
                      value={watchedData.templateId}
                      onChange={(id) => setValue("templateId", id)}
                    />
                  </div>

                  <div className="space-y-8">
                    <h2 className="text-2xl md:text-[26px] font-black tracking-tight flex items-center gap-3">
                      <Palette className="w-6 h-6 text-primary" /> Color &
                      Aesthetics
                    </h2>
                    <ThemeSelector
                      value={watchedData.themeKey}
                      onChange={(key) => setValue("themeKey", key)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-10 border-t border-border/30">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="h-12 px-6 rounded-xl font-bold border-border"
              >
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-12 px-8 rounded-xl font-bold site-primary-button gap-2"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <div className="lg:hidden w-full">
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="w-full h-14 rounded-xl font-black site-primary-button shadow-xl shadow-primary/20 gap-2"
                  >
                    Build My Website <Rocket className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* SIDEBAR SUMMARY */}
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

          <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase">Pro Tip</span>
            </div>
            <p className="text-[12px] text-foreground font-semibold leading-relaxed">
              {currentStep === 0
                ? "Your profession and bio are the most important fields for AI generation."
                : currentStep === 1
                  ? "Featured projects build trust with your future website visitors."
                  : "All templates are mobile-responsive by default."}
            </p>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .site-input {
          height: 52px !important;
          font-size: 16px !important;
          border-radius: 12px !important;
          background-color: transparent !important;
          border-color: rgba(var(--border), 0.5);
          transition: all 0.2s ease !important;
        }
        .site-input:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08) !important;
        }
        .site-textarea {
          min-height: 140px !important;
          font-size: 16px !important;
          border-radius: 16px !important;
          padding: 16px !important;
          line-height: 1.6 !important;
          background-color: transparent !important;
          border-width: 1px !important;
          border-color: rgba(var(--border), 0.5);
          transition: all 0.2s ease !important;
          width: 100%;
        }
        .site-textarea:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08) !important;
          outline: none !important;
        }
      `}</style>
    </div>
  );
}

function FormGroup({ label, error, helper, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-[14px] font-black text-foreground">
          {label}
        </Label>
        {error && (
          <span className="text-xs font-bold text-red-500 uppercase">
            {error}
          </span>
        )}
      </div>
      {children}
      {helper && (
        <p className="text-[13px] text-muted-foreground font-medium leading-relaxed px-1">
          {helper}
        </p>
      )}
    </div>
  );
}
