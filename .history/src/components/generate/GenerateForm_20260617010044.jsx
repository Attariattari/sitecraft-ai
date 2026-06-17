"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Layout,
  Palette,
  Sparkles,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Plus,
  Mail,
  Link as LinkIcon,
  HelpCircle,
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
  fullName: z.string().min(2, "Name or Brand Name is required."),
  websiteTitle: z.string().min(2, "Website Title is required."),
  description: z
    .string()
    .min(10, "Tell us a bit more (at least 10 chars).")
    .max(1000),
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  projectLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  contactEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  templateId: z.string().default("modern"),
  themeKey: z.string().default("emerald"),
});

const STEPS = [
  { id: "user", title: "Your Info" },
  { id: "content", title: "Website Content" },
  { id: "design", title: "Design Choice" },
];

export function GenerateForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      websiteTitle: "",
      description: "",
      projectTitle: "",
      projectDescription: "",
      projectLink: "",
      contactEmail: "",
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

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (currentStep === 0) fieldsToValidate = ["fullName", "contactEmail"];
    if (currentStep === 1) fieldsToValidate = ["websiteTitle", "description"];

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

    // Map simplified form to existing API format
    const apiData = {
      fullName: data.fullName,
      email: data.contactEmail || "user@sitecraft.ai",
      bio: data.description,
      profession: data.websiteTitle,
      websiteGoal: data.websiteTitle,
      skills: ["General Profile"],
      services: ["Professional Development"],
      projects: data.projectTitle
        ? [
            {
              title: data.projectTitle,
              description: data.projectDescription || "",
              tech: "Various",
              link: data.projectLink || "",
            },
          ]
        : [],
      templateId: data.templateId,
      themeKey: data.themeKey,
      colorMode: "dark",
      category: "portfolio",
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
          Create Your{" "}
          <span className="site-gradient-text">AI Powered Website</span>
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
                  "hidden sm:block text-[12px] font-black uppercase tracking-wider",
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8">
          <form className="space-y-12">
            <AnimatePresence mode="wait">
              {/* STEP 1: USER DETAILS */}
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                      1. Your Personality Info
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormGroup
                      label="Your Name / Brand Name"
                      error={errors.fullName?.message}
                    >
                      <Input
                        {...register("fullName")}
                        placeholder="Full Name"
                        className="site-input"
                      />
                    </FormGroup>
                    <FormGroup
                      label="Contact Email"
                      error={errors.contactEmail?.message}
                    >
                      <Input
                        {...register("contactEmail")}
                        placeholder="you@example.com"
                        className="site-input"
                      />
                    </FormGroup>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: WEBSITE CONTENT */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                      2. Website Content
                    </h2>
                  </div>

                  <FormGroup
                    label="Website Primary Header"
                    error={errors.websiteTitle?.message}
                    helper="Example: John Doe — SaaS Product Designer"
                  >
                    <Input
                      {...register("websiteTitle")}
                      placeholder="Website Title"
                      className="site-input"
                    />
                  </FormGroup>

                  <FormGroup
                    label="Website Core Description"
                    error={errors.description?.message}
                    helper="Tell us about yourself, your work, services, or business..."
                  >
                    <textarea
                      {...register("description")}
                      className="site-textarea"
                      placeholder="Detailed description for the AI to process..."
                    />
                  </FormGroup>

                  <Card className="p-6 bg-muted/20 border-border/40 rounded-2xl">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">
                      Add a Key Project (Optional)
                    </h3>
                    <div className="space-y-6">
                      <FormGroup label="Project Title">
                        <Input
                          {...register("projectTitle")}
                          placeholder="Project Name"
                          className="site-input bg-background"
                        />
                      </FormGroup>
                      <FormGroup label="Project Description">
                        <textarea
                          {...register("projectDescription")}
                          placeholder="What was this project about?"
                          className="site-textarea bg-background min-h-[80px]"
                        />
                      </FormGroup>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* STEP 3: DESIGN Choice */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-8">
                    <h2 className="text-2xl md:text-[26px] font-black tracking-tight flex items-center gap-3">
                      <Layout className="w-6 h-6 text-primary" /> Choose
                      Template
                    </h2>
                    <TemplateSelector
                      value={watchedData.templateId}
                      onChange={(id) => setValue("templateId", id)}
                    />
                  </div>

                  <div className="space-y-8">
                    <h2 className="text-2xl md:text-[26px] font-black tracking-tight flex items-center gap-3">
                      <Palette className="w-6 h-6 text-primary" /> Select Theme
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
                className="h-12 px-6 rounded-xl font-bold border-border shadow-sm"
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
                    Generate Website <Rocket className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* SIDEBAR SUMMARY */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <GenerateSummaryCard
            formData={watchedData}
            isPending={isGenerating}
            onGenerate={currentStep === 2 ? handleSubmit(onSubmit) : handleNext}
          />

          <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase">
                AI Assistant
              </span>
            </div>
            <p className="text-[12px] text-foreground font-semibold leading-relaxed">
              {currentStep === 0
                ? "Make sure your name is spelled correctly as it's used for SEO."
                : currentStep === 1
                  ? "Detailed descriptions result in much better AI-generated copywriting."
                  : "You can change the theme later from your dashboard after generation."}
            </p>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .site-input {
          height: 50px !important;
          font-size: 16px !important;
          border-radius: 12px !important;
          background-color: transparent !important;
          transition: all 0.2s ease !important;
        }
        .site-input:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08) !important;
        }
        .site-textarea {
          min-height: 120px !important;
          font-size: 16px !important;
          border-radius: 16px !important;
          padding: 16px !important;
          line-height: 1.6 !important;
          background-color: transparent !important;
          border-width: 1px !important;
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
        <Label className="text-[14px] font-bold text-foreground">{label}</Label>
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
