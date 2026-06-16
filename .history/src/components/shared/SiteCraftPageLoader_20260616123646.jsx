"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function SiteCraftPageLoader({ text = "Loading workspace..." }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[300px] w-full p-8"
      role="status"
    >
      <div className="relative size-16 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="size-6 text-primary/40 animate-pulse" />
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium text-muted-foreground tracking-medium"
      >
        {text}
      </motion.p>
    </div>
  );
}
