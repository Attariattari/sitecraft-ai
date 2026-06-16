"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Monitor,
  Palette,
  Sparkles,
  User,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { WEBSITE_THEMES } from "@/lib/themes/presets";

// Define Form Schema using Zod
const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  headline: z.string().min(5, "Headline must be at least 5 characters."),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters.")
    .max(500, "Bio is too long."),
  email: z.string().email("Invalid email address."),
  githubUrl: z
    .string()
    .url("Must be a valid URL.")
    .optional()
    .or(z.literal("")),
  themeKey: z.string().min(1, "Please select a theme."),
  colorMode: z.enum(["light", "dark", "system"]),
  category: z.literal("portfolio"),
});

// Stepper configuration
const STEPS = [
  { id: "personal", title: "Personal Details", icon: User },
  { id: "appearance", title: "Theme & Look", icon: Palette },
  { id: "review", title: "Review & Generate", icon: Sparkles },
];

export function GenerateForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      headline: "",
      bio: "",
      email: "",
      githubUrl: "",
      themeKey: "emerald",
      colorMode: "system",
      category: "portfolio",
    },
    mode: "onChange",
  });

  const {
    formState: { errors, isValid },
    trigger,
    watch,
    handleSubmit,
  } = form;
  const currentThemeKey = watch("themeKey");
  const currentColorMode = watch("colorMode");

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 0) {
      fieldsToValidate = ["fullName", "headline", "bio", "email"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["themeKey", "colorMode"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data) => {
    if (isGenerating) return;
    setIsGenerating(true);

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setIsDone(true);
      console.log("Generated Portfolio Data:", data);
    }, 3000);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = currentStep === idx;
        const isCompleted = currentStep > idx;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-primary/20"
                    : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`absolute -bottom-7 text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="w-24 sm:w-32 h-[2px] mx-2 -translate-y-[14px]">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  if (isDone) {
    return (
      <Card className="w-full border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden p-8 sm:p-12 shadow-2xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="flex flex-col items-center justify-center space-y-6"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Portfolio Generated!
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your brand new portfolio has been successfully generated based on
            your selections.
          </p>
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Create Another
            </Button>
            <Button>
              View Dashboard <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card className="w-full border-border/50 bg-background/50 backdrop-blur-sm shadow-xl p-6 sm:p-8 md:p-10">
      {renderStepIndicator()}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: Personal Info */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Jane Doe"
                    {...form.register("fullName")}
                    className={
                      errors.fullName
                        ? "border-red-500 focus-visible:ring-red-500/50"
                        : ""
                    }
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    {...form.register("email")}
                    className={
                      errors.email
                        ? "border-red-500 focus-visible:ring-red-500/50"
                        : ""
                    }
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">
                  Professional Headline <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="headline"
                  placeholder="Full Stack Developer & UI/UX Enthusiast"
                  {...form.register("headline")}
                  className={
                    errors.headline
                      ? "border-red-500 focus-visible:ring-red-500/50"
                      : ""
                  }
                />
                {errors.headline && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.headline.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">
                  GitHub / Portfolio Link (Optional)
                </Label>
                <Input
                  id="githubUrl"
                  placeholder="https://github.com/janedoe"
                  {...form.register("githubUrl")}
                  className={
                    errors.githubUrl
                      ? "border-red-500 focus-visible:ring-red-500/50"
                      : ""
                  }
                />
                {errors.githubUrl && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.githubUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  Short Bio <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="bio"
                  placeholder="Tell us a little bit about yourself, your skills, and what you do."
                  className={`flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-y ${errors.bio ? "border-red-500 focus-visible:ring-red-500/50" : "border-input"}`}
                  {...form.register("bio")}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  {errors.bio ? (
                    <span className="text-red-500 font-medium">
                      {errors.bio.message}
                    </span>
                  ) : (
                    <span>Keep it concise and impactful.</span>
                  )}
                  <span>{watch("bio")?.length || 0}/500</span>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="button"
                  onClick={nextStep}
                  size="lg"
                  className="w-full sm:w-auto group"
                >
                  Continue to Display Options
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Theme Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Color Mode Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    Appearance Mode
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Choose Light, Dark, or System mode.
                  </span>
                </div>

                <RadioGroup
                  onValueChange={(val) => form.setValue("colorMode", val)}
                  defaultValue={currentColorMode}
                  className="grid grid-cols-3 gap-4"
                >
                  {[
                    { id: "light", icon: Sun, label: "Light" },
                    { id: "dark", icon: Moon, label: "Dark" },
                    { id: "system", icon: Monitor, label: "System" },
                  ].map((mode) => (
                    <div key={mode.id}>
                      <RadioGroupItem
                        value={mode.id}
                        id={`mode-${mode.id}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`mode-${mode.id}`}
                        className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                          currentColorMode === mode.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/50 text-muted-foreground"
                        }`}
                      >
                        <mode.icon className="mb-2 h-6 w-6" />
                        <span className="font-semibold text-sm">
                          {mode.label}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Theme Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">
                      Brand Theme
                    </Label>
                    <p className="text-sm text-muted-foreground font-normal">
                      Select a premium color scheme for your portfolio.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto px-1 py-1 custom-scrollbar">
                  {Object.values(WEBSITE_THEMES).map((theme) => {
                    const isSelected = currentThemeKey === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => {
                          form.setValue("themeKey", theme.id);
                          form.trigger("themeKey");
                        }}
                        className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all hover:-translate-y-1 ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                            : "border-border/50 bg-background hover:shadow-sm"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm z-10">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="flex gap-1 items-center justify-center h-12 rounded-lg bg-muted/50 border border-border/50 overflow-hidden">
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundColor: theme.modes.light.primary,
                              }}
                            />
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundColor: theme.modes.light.secondary,
                              }}
                            />
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundColor: theme.modes.light.accent,
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <h4
                              className="font-medium text-xs truncate"
                              title={theme.name}
                            >
                              {theme.name}
                            </h4>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {theme.categoryFit}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.themeKey && (
                  <p className="text-xs text-red-500 font-medium mt-2">
                    {errors.themeKey.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between pt-6 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  size="lg"
                  className="w-full sm:w-auto group"
                >
                  Review Details
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Review */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-muted/30 border border-border/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Portfolio Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Full Name
                      </span>
                      <p className="font-medium">{watch("fullName")}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Headline
                      </span>
                      <p className="font-medium">{watch("headline")}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Email
                      </span>
                      <p className="font-medium text-muted-foreground">
                        {watch("email")}
                      </p>
                    </div>
                    {watch("githubUrl") && (
                      <div>
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                          Link
                        </span>
                        <p className="font-medium text-primary line-clamp-1">
                          {watch("githubUrl")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Bio Preview
                      </span>
                      <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed bg-background/50 p-3 rounded-lg border border-border/30">
                        {watch("bio")}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 bg-background/50 border border-border/30 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                          Theme
                        </span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-border/50 shadow-sm"
                            style={{
                              backgroundColor:
                                WEBSITE_THEMES[currentThemeKey]?.modes.light
                                  .primary,
                            }}
                          />
                          <span className="text-sm font-medium">
                            {WEBSITE_THEMES[currentThemeKey]?.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 bg-background/50 border border-border/30 rounded-lg p-3 flex flex-col justify-center">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                          Mode
                        </span>
                        <p className="text-sm font-medium capitalize flex items-center gap-1">
                          {currentColorMode === "light" && (
                            <Sun className="w-3.5 h-3.5" />
                          )}
                          {currentColorMode === "dark" && (
                            <Moon className="w-3.5 h-3.5" />
                          )}
                          {currentColorMode === "system" && (
                            <Monitor className="w-3.5 h-3.5" />
                          )}
                          {currentColorMode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between pt-6 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={isGenerating}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Make Changes
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className={`w-full sm:w-auto relative overflow-hidden ${isGenerating ? "opacity-90 pointer-events-none" : ""}`}
                >
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div
                        key="generating"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center"
                      >
                        <Sparkles className="w-4 h-4 mr-2 animate-pulse text-zinc-100" />
                        Generating Magic...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center"
                      >
                        Generate Portfolio
                        <Sparkles className="w-4 h-4 ml-2" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isGenerating && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-white/20 w-full"
                      initial={{ scaleX: 0, transformOrigin: "0% 50%" }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 3, ease: "linear" }}
                    />
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--border));
          border-radius: 20px;
        }
      `}</style>
    </Card>
  );
}
