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

export function GenerateForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchedData = watch();

  const onSubmit = async (data) => {
    setIsGenerating(true);

    // Map simplified form to existing API format
    const apiData = {
      fullName: data.fullName,
      email: data.contactEmail || "user@sitecraft.ai",
      bio: data.description,
      profession: data.websiteTitle, // Map title to profession for the AI
      websiteGoal: data.websiteTitle,
      skills: ["General"], // Defaults
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
      colorMode: "dark", // Defaulting to dark for premium feel
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
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-0">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-[32px] md:text-[40px] font-black text-foreground mb-4 leading-tight tracking-tight">
          Let's Build Your{" "}
          <span className="site-gradient-text">AI Website</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed">
          Answer a few questions and pick your design. SiteCraft AI will handle
          the rest—from copywriting to SEO.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        <div className="lg:col-span-8 space-y-16">
          {/* SECTION 1: WEBSITE DETAILS */}
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                1. Website Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <FormGroup
                label="Name / Brand Name"
                error={errors.fullName?.message}
              >
                <Input
                  {...register("fullName")}
                  placeholder="Enter your name or brand name"
                  className="site-input"
                />
              </FormGroup>

              <FormGroup
                label="Website Title"
                error={errors.websiteTitle?.message}
              >
                <Input
                  {...register("websiteTitle")}
                  placeholder="Example: John Doe — Full Stack Developer"
                  className="site-input"
                />
              </FormGroup>
            </div>

            <FormGroup
              label="Website Description"
              error={errors.description?.message}
              helper="Tell us about yourself, your work, services, skills, or business..."
            >
              <textarea
                {...register("description")}
                className="site-textarea"
                placeholder="I am a visionary developer specializing in building premium SaaS applications with a focus on UI/UX..."
              />
            </FormGroup>

            {/* Optional Fields Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm font-bold text-primary flex items-center gap-2 hover:underline transition-all"
              >
                {showAdvanced
                  ? "Hide Optional Details"
                  : "Add Project & Contact Details (Optional)"}
              </button>
            </div>

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pt-4 pb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormGroup
                    label="Project Title"
                    error={errors.projectTitle?.message}
                  >
                    <Input
                      {...register("projectTitle")}
                      placeholder="Example: E-commerce Dashboard"
                      className="site-input"
                    />
                  </FormGroup>
                  <FormGroup
                    label="Project Link"
                    error={errors.projectLink?.message}
                  >
                    <div className="relative">
                      <Input
                        {...register("projectLink")}
                        placeholder="https://example.com"
                        className="site-input pl-10"
                      />
                      <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </FormGroup>
                </div>
                <FormGroup
                  label="Project Description"
                  error={errors.projectDescription?.message}
                >
                  <textarea
                    {...register("projectDescription")}
                    placeholder="Describe your project, what you built, and what makes it valuable..."
                    className="site-textarea min-h-[100px]"
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
          </section>

          {/* SECTION 2: CHOOSE TEMPLATE */}
          <section className="space-y-8 pt-4 animate-in fade-in slide-in-from-bottom-4 delay-150 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Layout className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                2. Choose Template
              </h2>
            </div>
            <TemplateSelector
              value={watchedData.templateId}
              onChange={(id) => setValue("templateId", id)}
            />
          </section>

          {/* SECTION 3: CHOOSE THEME */}
          <section className="space-y-8 pt-4 animate-in fade-in slide-in-from-bottom-4 delay-300 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                3. Choose Theme
              </h2>
            </div>
            <ThemeSelector
              value={watchedData.themeKey}
              onChange={(key) => setValue("themeKey", key)}
            />
          </section>

          {/* Bottom CTA for Mobile */}
          <div className="lg:hidden pt-8">
            <Button
              type="submit"
              className="w-full h-14 rounded-xl text-lg font-bold site-primary-button shadow-xl shadow-primary/20 gap-2"
            >
              Generate My Website <Rocket className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Sidebar Summary Panel */}
        <aside className="hidden lg:block lg:col-span-4">
          <GenerateSummaryCard
            formData={watchedData}
            isPending={isGenerating}
            onGenerate={handleSubmit(onSubmit)}
          />
        </aside>
      </form>

      {/* Global CSS for sizing - ensured no unknown Tailwind utilities */}
      <style jsx global>{`
        .site-input {
          height: 48px !important;
          font-size: 16px !important;
          border-radius: 12px !important;
          background-color: transparent !important;
          transition: all 0.2s ease !important;
        }
        .site-input:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
        }
        .site-textarea {
          min-height: 120px !important;
          font-size: 16px !important;
          border-radius: 16px !important;
          padding: 12px 16px !important;
          line-height: 1.6 !important;
          background-color: transparent !important;
          border-width: 1px !important;
          transition: all 0.2s ease !important;
          width: 100%;
        }
        .site-textarea:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
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
        <Label className="text-[14px] md:text-[15px] font-bold text-foreground">
          {label}
        </Label>
        {error && (
          <span className="text-xs font-bold text-red-500 animate-in fade-in slide-in-from-right-2">
            {error}
          </span>
        )}
      </div>
      {children}
      {helper && (
        <p className="text-[13px] md:text-[14px] text-muted-foreground font-medium leading-relaxed px-1">
          {helper}
        </p>
      )}
    </div>
  );
}
