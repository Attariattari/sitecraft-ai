"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function GenerateAITips({ currentStep }) {
  const tips = {
    0: "Keep your name professional. Your bio should focus on your unique selling points.",
    1: "Define your profession clearly. This helps the AI choose the right terminology for your copy.",
    2: "Add specific skills and services. The more detail you provide, the better the AI can structure your sections.",
    3: "Projects are the heart of your site. Mention the technologies used for a better technical profile.",
    4: "For creative roles, choose warmer themes. For corporate settings, minimal themes work best.",
    5: "Double check your details. Once generated, the content is set based on these inputs.",
  };

  const currentTip =
    tips[currentStep] || "Fill out all fields for the best results.";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            SiteCraft AI Tip
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-foreground font-medium pr-2">
          {currentTip}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
