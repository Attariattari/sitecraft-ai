"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Palette,
  Briefcase,
  ListRestart,
  Layout,
  Plus,
  Trash2,
  Rocket,
  Wand2,
  Save,
  Zap,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { WEBSITE_THEMES } from "@/lib/themes/presets";

// Import custom dashboard components
import { GeneratePageHeader } from "@/components/dashboard/generate/GeneratePageHeader";
import { GenerateStepIndicator } from "@/components/dashboard/generate/GenerateStepIndicator";
import { GenerateLivePreview } from "@/components/dashboard/generate/GenerateLivePreview";
import { GenerateSummaryPanel } from "@/components/dashboard/generate/GenerateSummaryPanel";
import { GenerateAITips } from "@/components/dashboard/generate/GenerateAITips";
import { GenerateProcessingState } from "@/components/dashboard/generate/GenerateProcessingState";
import { TemplateThemeSelector } from "@/components/dashboard/generate/TemplateThemeSelector";

// Expanded Form Schema
const formSchema = z.object({
  // Step 1: Basics
  fullName: z.string().min(2, "Full name required."),
  email: z.string().email("Invalid email."),
  location: z.string().optional(),
  bio: z.string().min(10, "Bio must be at least 10 chars.").max(600),

  // Step 2: Profession
  profession: z.string().min(2, "Profession required."),
  experienceLevel: z.string().optional(),
  websiteGoal: z.string().min(3, "Goal required."),
  targetAudience: z.string().optional(),

  // Step 3: Skills & Services
  skills: z.array(z.string()).min(1, "Add at least one skill."),
  services: z.array(z.string()).optional(),

  // Step 4: Projects
  projects: z
    .array(
      z.object({
        title: z.string().min(2, "Title required."),
        description: z.string().min(10, "Description required."),
        tech: z.string().optional(),
        link: z
          .string()
          .url("Valid URL required.")
          .optional()
          .or(z.literal("")),
      }),
    )
    .min(1, "Add at least one project."),

  // Step 5: Design Style
  templateId: z.string().default("modern"),
  themeKey: z.string().min(1, "Select a theme."),
  colorMode: z.enum(["light", "dark", "system"]),
  category: z.literal("portfolio"),
});

const STEPS = [
  { id: "basics", title: "Basics", icon: User },
  { id: "profession", title: "Profession", icon: Briefcase },
  { id: "skills", title: "Skills", icon: ListRestart },
  { id: "projects", title: "Projects", icon: Layout },
  { id: "design", title: "Design", icon: Palette },
  { id: "review", title: "Review", icon: Sparkles },
];

export function GenerateForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      location: "",
      bio: "",
      profession: "",
      experienceLevel: "Intermediate",
      websiteGoal: "Get more clients",
      targetAudience: "",
      skills: [],
      services: [],
      projects: [{ title: "", description: "", tech: "", link: "" }],
      templateId: "modern",
      themeKey: "emerald",
      colorMode: "dark",
      category: "portfolio",
    },
    mode: "onChange",
  });

  const {
    formState: { errors },
    trigger,
    watch,
    setValue,
    control,
    handleSubmit,
  } = form;

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const watchedData = watch();

  const handleNext = async () => {
    let fields = [];
    if (currentStep === 0) fields = ["fullName", "email", "bio"];
    if (currentStep === 1) fields = ["profession", "websiteGoal"];
    if (currentStep === 2) fields = ["skills"];
    if (currentStep === 3) fields = ["projects"];
    if (currentStep === 4) fields = ["themeKey", "colorMode"];

    const isValid = await trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = watchedData.skills || [];
      if (!currentSkills.includes(skillInput.trim())) {
        setValue("skills", [...currentSkills, skillInput.trim()], {
          shouldValidate: true,
        });
      }
      setSkillInput("");
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GenerateProcessingState />
      </div>
    );
  }

  return (
    <div className="w-full">
      <GeneratePageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <GenerateStepIndicator currentStep={currentStep} steps={STEPS} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: BASICS */}
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormGroup
                      label="Full Name / Brand Name"
                      id="fullName"
                      error={errors.fullName?.message}
                    >
                      <Input
                        id="fullName"
                        placeholder="Jane Doe"
                        {...form.register("fullName")}
                        className="rounded-xl border-border/60 bg-background"
                      />
                    </FormGroup>
                    <FormGroup
                      label="Email Address"
                      id="email"
                      error={errors.email?.message}
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@example.com"
                        {...form.register("email")}
                        className="rounded-xl border-border/60 bg-background"
                      />
                    </FormGroup>
                  </div>
                  <FormGroup
                    label="Professional Bio"
                    id="bio"
                    error={errors.bio?.message}
                    helper="Briefly tell us who you are and what makes you unique."
                  >
                    <textarea
                      id="bio"
                      className="flex w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm min-h-[120px] focus-visible:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="I am a visionary developer specializing in..."
                      {...form.register("bio")}
                    />
                  </FormGroup>
                  <FormGroup label="Location (Optional)" id="location">
                    <Input
                      id="location"
                      placeholder="San Francisco, CA"
                      {...form.register("location")}
                      className="rounded-xl border-border/60 bg-background"
                    />
                  </FormGroup>
                </motion.div>
              )}

              {/* STEP 2: PROFESSION */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormGroup
                      label="Your Profession / Role"
                      id="profession"
                      error={errors.profession?.message}
                    >
                      <Input
                        id="profession"
                        placeholder="SaaS Product Designer"
                        {...form.register("profession")}
                        className="rounded-xl border-border/60 bg-background"
                      />
                    </FormGroup>
                    <FormGroup label="Experience Level" id="experienceLevel">
                      <Input
                        id="experienceLevel"
                        placeholder="e.g. Senior, Founder, 5+ Years"
                        {...form.register("experienceLevel")}
                        className="rounded-xl border-border/60 bg-background"
                      />
                    </FormGroup>
                  </div>
                  <FormGroup
                    label="Website Goal"
                    id="websiteGoal"
                    error={errors.websiteGoal?.message}
                  >
                    <Input
                      id="websiteGoal"
                      placeholder="e.g. Portfolio for agencies, Sell digital services"
                      {...form.register("websiteGoal")}
                      className="rounded-xl border-border/60 bg-background"
                    />
                  </FormGroup>
                  <FormGroup
                    label="Target Audience (Optional)"
                    id="targetAudience"
                  >
                    <Input
                      id="targetAudience"
                      placeholder="e.g. Tech Founders, Small Businesses"
                      {...form.register("targetAudience")}
                      className="rounded-xl border-border/60 bg-background"
                    />
                  </FormGroup>
                </motion.div>
              )}

              {/* STEP 3: SKILLS & SERVICES */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Your Skills
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. Next.js, Figma, AI Strategy"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addSkill())
                        }
                        className="rounded-xl border-border/60 bg-background flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addSkill}
                        className="rounded-xl shadow-lg shadow-primary/10"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {watchedData.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              setValue(
                                "skills",
                                watchedData.skills.filter((_, i) => i !== idx),
                              )
                            }
                          >
                            <Trash2 className="w-3 h-3 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      ))}
                      {watchedData.skills.length === 0 && (
                        <p className="text-[11px] text-muted-foreground italic">
                          No skills added yet.
                        </p>
                      )}
                    </div>
                    {errors.skills && (
                      <p className="text-xs text-red-500 font-bold">
                        {errors.skills.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: PROJECTS */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                      Portfolio Items
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendProject({
                          title: "",
                          description: "",
                          tech: "",
                          link: "",
                        })
                      }
                      className="rounded-lg h-8 gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {projectFields.map((field, index) => (
                      <Card
                        key={field.id}
                        className="relative overflow-visible border-border/40 bg-muted/20 rounded-2xl p-6"
                      >
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <FormGroup
                            label="Project Title"
                            id={`p-title-${index}`}
                            error={errors.projects?.[index]?.title?.message}
                          >
                            <Input
                              {...form.register(`projects.${index}.title`)}
                              placeholder="SiteCraft AI"
                              className="rounded-lg border-border bg-background h-9"
                            />
                          </FormGroup>
                          <FormGroup label="Tech Used" id={`p-tech-${index}`}>
                            <Input
                              {...form.register(`projects.${index}.tech`)}
                              placeholder="Next.js, Tailwind, MongoDB"
                              className="rounded-lg border-border bg-background h-9"
                            />
                          </FormGroup>
                        </div>
                        <FormGroup
                          label="Brief Description"
                          id={`p-desc-${index}`}
                          error={errors.projects?.[index]?.description?.message}
                        >
                          <textarea
                            {...form.register(`projects.${index}.description`)}
                            className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[80px]"
                            placeholder="Tell us what this project does..."
                          />
                        </FormGroup>
                      </Card>
                    ))}
                  </div>
                  {errors.projects && (
                    <p className="text-xs text-red-500 font-bold">
                      {errors.projects.message}
                    </p>
                  )}
                </motion.div>
              )}

              {/* STEP 5: DESIGN STYLE */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <TemplateThemeSelector
                    selectedTemplate={watchedData.templateId}
                    onTemplateSelect={(id) =>
                      setValue("templateId", id, { shouldValidate: true })
                    }
                    selectedTheme={watchedData.themeKey}
                    onThemeSelect={(key) =>
                      setValue("themeKey", key, { shouldValidate: true })
                    }
                    colorMode={watchedData.colorMode}
                    onColorModeSelect={(mode) =>
                      setValue("colorMode", mode, { shouldValidate: true })
                    }
                  />
                  {errors.themeKey && (
                    <p className="text-xs text-red-500 font-bold mt-4">
                      {errors.themeKey.message}
                    </p>
                  )}
                </motion.div>
              )}

              {/* STEP 6: REVIEW */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Rocket className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black mb-3">
                      Launch Your Vision
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8 font-medium">
                      Your profile is complete! SiteCraft AI will use your input
                      to build a professional website in seconds.
                    </p>

                    <div className="flex flex-col gap-2 max-w-xs mx-auto text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-left">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> SEO
                        Optimization
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                        Responsive Layout
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> AI
                        Content Generation
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center py-4 border-t border-border/30">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Zap className="w-4 h-4 text-primary" /> Edit after
                      generation
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Zap className="w-4 h-4 text-primary" /> Change theme
                      anytime
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-10 border-t border-border/30">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="rounded-xl px-6 h-11 border-border/60 gap-2 font-bold"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="site-primary-button rounded-xl px-8 h-11 gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="site-primary-button rounded-xl px-10 h-11 gap-2 animate-pulse group"
                >
                  Generate My Website{" "}
                  <Rocket className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Desktop Sidebar Column */}
        <aside className="lg:col-span-4 space-y-6">
          <GenerateAITips currentStep={currentStep} />
          <GenerateLivePreview formData={watchedData} />
          <GenerateSummaryPanel formData={watchedData} steps={STEPS} />
        </aside>
      </div>
    </div>
  );
}

function FormGroup({ label, id, error, helper, children }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between pr-1">
        <Label
          htmlFor={id}
          className="text-xs font-black uppercase tracking-widest text-muted-foreground/80"
        >
          {label}
        </Label>
        {error && (
          <span className="text-[10px] font-bold text-red-500 uppercase">
            {error}
          </span>
        )}
      </div>
      {children}
      {helper && (
        <p className="text-[10px] font-semibold text-muted-foreground/60 italic px-1">
          {helper}
        </p>
      )}
    </div>
  );
}
