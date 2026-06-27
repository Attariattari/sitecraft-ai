"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const variantClasses = {
  fullscreen: "fixed inset-0 z-[9999] min-h-screen bg-transparent",
  section: "min-h-[320px] bg-transparent",
  inline: "min-h-0 bg-transparent",
  button: "min-h-0 bg-transparent",
};

const textByVariant = {
  fullscreen: "Crafting your SiteCraft AI experience...",
  section: "Loading SiteCraft AI...",
  inline: "Loading...",
  button: "Loading",
};

function LoaderMark({ compact = false }) {
  const sizeClass = compact ? "size-11" : "size-20 sm:size-24";
  const iconClass = compact ? "size-5" : "size-9 sm:size-10";
  const nodeClass = compact ? "size-1.5" : "size-2";

  return (
    <div className={cn("relative mx-auto", sizeClass)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-4 rounded-full border border-primary/15"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-2 rounded-full border-2 border-transparent border-t-primary border-r-accent/70"
      />
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.78, 1, 0.78] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-soft to-accent-soft blur-xl"
      />
      <div className="relative flex h-full w-full items-center justify-center rounded-full text-primary">
        <Sparkles className={iconClass} strokeWidth={2.4} />
      </div>
      {[0, 1, 2, 3].map((item) => (
        <motion.span
          key={item}
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.25, 0.85] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: item * 0.18, ease: "easeInOut" }}
          className={cn("absolute rounded-full bg-primary shadow-lg shadow-primary/30", nodeClass)}
          style={{
            left: item % 2 === 0 ? "8%" : "82%",
            top: item < 2 ? "16%" : "78%",
          }}
        />
      ))}
    </div>
  );
}

export function SiteCraftLoader({
  variant = "section",
  text,
  showLogo = true,
  className,
}) {
  const isButton = variant === "button";
  const isInline = variant === "inline" || isButton;
  const label = text || textByVariant[variant] || textByVariant.section;

  if (isButton) {
    return (
      <span className={cn("inline-flex items-center justify-center gap-2", className)} role="status" aria-live="polite">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
          className="size-4 rounded-full border-2 border-current/30 border-t-current"
        />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden px-6 py-10 text-foreground",
        variantClasses[variant] || variantClasses.section,
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn("relative w-full text-center", isInline ? "max-w-fit" : "max-w-md")}
      >
        {showLogo ? <LoaderMark compact={isInline} /> : null}

        {!isInline && (
          <div className="mt-8">
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              SiteCraft <span className="site-gradient-text">AI</span>
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-muted-foreground">
              {label}
            </p>
            <div className="mx-auto mt-7 h-1.5 max-w-64 overflow-hidden rounded-full bg-muted">
              <motion.div
                animate={{ x: ["-100%", "120%"] }}
                transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <div className="mt-5 flex justify-center gap-2">
              {[0, 1, 2].map((item) => (
                <motion.span
                  key={item}
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: item * 0.16 }}
                  className="size-1.5 rounded-full bg-primary"
                />
              ))}
            </div>
          </div>
        )}

        {isInline && <span className="sr-only">{label}</span>}
      </motion.div>
    </div>
  );
}
