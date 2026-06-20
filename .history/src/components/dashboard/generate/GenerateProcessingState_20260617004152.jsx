"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  CircleDashed,
  Rocket,
  Code,
  Layout,
  Globe,
} from "lucide-react";

const LOADING_STEPS = [
  { id: 1, label: "Analyzing your profile", icon: Sparkles },
  { id: 2, label: "Writing optimized copy", icon: Code },
  { id: 3, label: "Structuring site layout", icon: Layout },
  { id: 4, label: "Applying theme variables", icon: Globe },
  { id: 5, label: "Finalizing SEO structure", icon: Rocket },
];

export function GenerateProcessingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < LOADING_STEPS.length - 1 ? prev + 1 : prev,
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 lg:p-12 text-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
        <div className="relative w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center bg-background shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <motion.div
            className="w-16 h-16 text-primary"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 4, ease: "linear" },
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            }}
          >
            <Sparkles className="w-full h-full fill-primary/20" />
          </motion.div>
        </div>
      </div>

      <h2 className="text-2xl font-black text-foreground mb-3">
        SiteCraft AI is{" "}
        <span className="site-gradient-text">Building Your Vision</span>
      </h2>
      <p className="text-muted-foreground text-sm max-w-md mx-auto mb-10 leading-relaxed font-medium">
        Our language model is processing your details to craft a professional
        website experience. This usually takes around 15-30 seconds.
      </p>

      <div className="w-full max-w-xs space-y-4">
        {LOADING_STEPS.map((step, idx) => {
          const isActive = currentStep === idx;
          const isCompleted = currentStep > idx;

          return (
            <motion.div
              key={step.id}
              className={`flex items-center gap-3 transition-opacity duration-500 ${isActive || isCompleted ? "opacity-100" : "opacity-30"}`}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: isActive || isCompleted ? 1 : 0.3 }}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isActive ? (
                  <CircleDashed className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <div className="w-1 h-1 bg-muted rounded-full" />
                )}
              </div>
              <span
                className={`text-xs font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 w-full max-w-[200px] h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%`,
          }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}
