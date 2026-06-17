"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export function GenerateStepIndicator({ currentStep, steps }) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 no-scrollbar">
        {steps.map((step, idx) => {
          const isActive = currentStep === idx;
          const isCompleted = currentStep > idx;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-3 min-w-[80px] relative"
            >
              {/* Connector Line for background */}
              {idx < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-[2px] bg-muted -z-10" />
              )}

              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                  isActive
                    ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110"
                    : isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : "bg-muted/50 border-border text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 font-black" />
                ) : (
                  <span className="text-xs font-black">{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest text-center transition-colors duration-300 ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-emerald-500/70"
                      : "text-muted-foreground/60"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        <span>Progress</span>
        <span>
          Step {currentStep + 1} of {steps.length} — {Math.round(progress)}%
          Complete
        </span>
      </div>
    </div>
  );
}
