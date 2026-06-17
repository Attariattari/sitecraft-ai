"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

const STEPS = [
  "Reading your details...",
  "Creating website content...",
  "Preparing SEO structure...",
  "Applying template and theme...",
  "Finalizing your preview...",
];

export function GenerateLoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto">
      <div className="relative mb-10 w-24 h-24">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-full h-full rounded-2xl bg-card border border-border shadow-xl flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>

      <h2 className="text-3xl font-black text-foreground mb-4">
        Generating Your Website
      </h2>
      <p className="text-muted-foreground mb-12">
        Our AI is crafting your professional digital presence. This should only
        take a few moments.
      </p>

      <div className="w-full space-y-4">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > idx;
          const isActive = currentStep === idx;

          return (
            <div
              key={idx}
              className={`flex items-center gap-4 transition-all duration-500 ${isCompleted || isActive ? "opacity-100" : "opacity-30"}`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : isActive ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted" />
                )}
              </div>
              <span
                className={`text-sm font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-12 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}
