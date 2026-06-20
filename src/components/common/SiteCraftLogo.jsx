"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: 30,
  md: 40,
  lg: 56,
};

/**
 * SiteCraftLogo Component
 * Reusable, responsive logo with proper sizing options
 * Uses the original Sparkles icon with gradient background + text
 * Supports light/dark backgrounds
 * 
 * @param {Object} props
 * @param {"sm" | "md" | "lg"} props.size - Logo size variant (default: "md")
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.href - Link destination (default: "/")
 * @param {string} props.alt - Alt text for image (default: "SiteCraft AI")
 * @param {boolean} props.showText - Show text label (default: true for md/lg, false for sm)
 */
export function SiteCraftLogo({
  size = "md",
  className,
  href = "/",
  alt = "SiteCraft AI",
  showText = size !== "sm",
}) {
  const height = SIZES[size];
  const iconSize = Math.round(height * 0.5);

  const logo = (
    <div className="flex items-center gap-2.5 group">
      <div className="relative flex-shrink-0" style={{ width: `${height}px`, height: `${height}px` }}>
        <div className="absolute inset-0 rounded-xl bg-primary/25 blur-md group-hover:blur-lg transition-all duration-300" />
        <div className="relative w-full h-full rounded-xl site-primary-button flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
        </div>
      </div>
      {showText && (
        <div className="hidden sm:block">
          <span className="text-[1.1rem] font-extrabold tracking-tight text-foreground">
            SiteCraft <span className="text-primary">AI</span>
          </span>
        </div>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="flex items-center hover:opacity-80 transition-opacity">
      {logo}
    </Link>
  ) : (
    <div className="flex items-center">{logo}</div>
  );
}
