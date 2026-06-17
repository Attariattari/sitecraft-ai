"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FileText,
  Layout,
  Palette,
  Rocket,
  Plus,
  Mail,
  Link as LinkIcon,
  ChevronRight,
  Sparkles,
  Zap,
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
  // Section 1: Website Details
  fullName: z.string().min(2, "Name or Brand Name is required."),
  websiteTitle: z.string().min(2, "Website Title is required."),
  description: z
    .string()
    .min(10, "Description must be at least 10 chars.")
    .max(1500),
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  projectLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),

  // Section 2 & 3
  templateId: z.string().default("modern"),
  themeKey: z.string().default("emerald"),
});

export function GenerateForm() {
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

    // API Mapping for compatibility
    const apiData = {
      fullName: data.fullName,
      email: data.contactEmail || "user@sitecraft.ai",
      bio: data.description,
      profession: data.websiteTitle,
      websiteGoal: data.websiteTitle,
      skills: ["Premium Content"],
      services: ["Expert Solutions"],
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
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-0">
      {/* Header */}
      <header className="mb-14">
        <h1 className="text-[32px] md:text-[40px] font-black text-foreground mb-4 tracking-tight leading-tight">
          Generate Your <span className="site-gradient-text">AI Website</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
          Provide your basic details, select a template and theme, and let
          SiteCraft AI build your professional online presence in seconds.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Form Content */}
        <div className="lg:col-span-8 space-y-24">
          {/* SECTION 1: WEBSITE DETAILS */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                1. Website Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                placeholder="Briefly describe what you do and what you want to highlight on your website..."
              />
            </FormGroup>

            {/* Project Details (Clean Normal Form) */}
            <hr className="border-border/30" />

            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-black tracking-tight">
                  Featured Project (Optional)
                </h3>
              </div>

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
                  <Input
                    {...register("projectLink")}
                    placeholder="https://example.com"
                    className="site-input"
                  />
                </FormGroup>
              </div>

              <FormGroup
                label="Project Description"
                error={errors.projectDescription?.message}
              >
                <textarea
                  {...register("projectDescription")}
                  className="site-textarea min-h-[100px]"
                  placeholder="Describe your project, what you built, and what makes it valuable..."
                />
              </FormGroup>
            </div>

            <FormGroup
              label="Contact Email (Optional)"
              error={errors.contactEmail?.message}
            >
              <Input
                {...register("contactEmail")}
                placeholder="you@example.com"
                className="site-input"
              />
            </FormGroup>
          </section>

          {/* SECTION 2: CHOOSE TEMPLATE */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Layout className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                2. Choose Template
              </h2>
            </div>
            <TemplateSelector
              value={watchedData.templateId}
              onChange={(id) =>
                setValue("templateId", id, { shouldValidate: true })
              }
            />
          </section>

          {/* SECTION 3: CHOOSE THEME & GENERATE */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 delay-400 duration-700">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-[26px] font-black tracking-tight">
                3. Choose Theme & Generate
              </h2>
            </div>
            <ThemeSelector
              value={watchedData.themeKey}
              onChange={(key) =>
                setValue("themeKey", key, { shouldValidate: true })
              }
            />
          </section>

          {/* Mobile Generate Button */}
          <div className="lg:hidden">
            <Button
              onClick={handleSubmit(onSubmit)}
              className="w-full h-14 rounded-2xl text-lg font-black site-primary-button shadow-xl shadow-primary/20 gap-2"
            >
              Generate My Website <Rocket className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Sidebar Summary Card */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <GenerateSummaryCard
            formData={watchedData}
            isPending={isGenerating}
            onGenerate={handleSubmit(onSubmit)}
          />

          <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <Zap className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                AI Insight
              </span>
            </div>
            <p className="text-[13px] text-foreground font-bold leading-relaxed">
              AI will create your website content, SEO structure, template
              layout, and preview.
            </p>
          </div>
        </aside>
      </div>

      {/* Modern High-End Input Styles */}
      <style jsx global>{`
        .site-input {
          height: 48px !important;
          font-size: 16px !important;
          border-radius: 12px !important;
          background-color: transparent !important;
          border: 1.5px solid rgba(var(--border), 0.5) !important;
          transition: all 0.2s ease !important;
          padding: 0 16px !important;
        }
        .site-input:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
          outline: none !important;
        }
        .site-textarea {
          min-height: 120px !important;
          font-size: 16px !important;
          border-radius: 16px !important;
          padding: 16px !important;
          line-height: 1.6 !important;
          background-color: transparent !important;
          border: 1.5px solid rgba(var(--border), 0.5) !important;
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
      <div className="flex items-center justify-between px-1">
        <Label className="text-[14px] md:text-[15px] font-bold text-foreground">
          {label}
        </Label>
        {error && (
          <span className="text-[11px] font-black text-red-500 uppercase tracking-wide">
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
