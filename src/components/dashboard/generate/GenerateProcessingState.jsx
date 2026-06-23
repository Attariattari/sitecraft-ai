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
    <div className="relative flex flex-col items-center justify-center overflow-hidden p-8 text-center lg:p-12">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-soft via-transparent to-accent-soft opacity-70" />
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-6 rounded-full border border-primary/15"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-3 rounded-full border-2 border-transparent border-t-primary border-r-accent/70"
        />
        <div className="absolute inset-0 bg-primary-soft rounded-full blur-[60px]" />
        <div className="relative w-32 h-32 rounded-full border border-primary/20 flex items-center justify-center bg-background/80 backdrop-blur-xl shadow-2xl">
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
        {[0, 1, 2, 3].map((item) => (
          <motion.span
            key={item}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.25, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: item * 0.18 }}
            className="absolute size-2 rounded-full bg-primary shadow-lg shadow-primary/30"
            style={{
              left: item % 2 === 0 ? "2%" : "92%",
              top: item < 2 ? "12%" : "86%",
            }}
          />
        ))}
      </div>

      <h2 className="relative text-2xl font-black text-foreground mb-3">
        SiteCraft AI is{" "}
        <span className="site-gradient-text">Building Your Vision</span>
      </h2>
      <p className="relative text-muted-foreground text-sm max-w-md mx-auto mb-10 leading-relaxed font-medium">
        Our language model is processing your details to craft a professional
        website experience. This usually takes around 15-30 seconds.
      </p>

      <div className="relative w-full max-w-sm space-y-3 rounded-3xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-xl">
        {LOADING_STEPS.map((step, idx) => {
          const isActive = currentStep === idx;
          const isCompleted = currentStep > idx;
          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.id}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-500 ${
                isActive ? "bg-primary-soft text-primary" : "text-muted-foreground"
              } ${isActive || isCompleted ? "opacity-100" : "opacity-45"}`}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: isActive || isCompleted ? 1 : 0.3 }}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : isActive ? (
                  <CircleDashed className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <StepIcon className="w-4 h-4" />
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

      <div className="relative mt-8 w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
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
