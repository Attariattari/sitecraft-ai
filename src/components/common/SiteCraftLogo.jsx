"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_URL = "https://res.cloudinary.com/dg5gwixf1/image/upload/v1781974506/SiteCraft-AI/Web%20Logo/ChatGPT_Image_Jun_20_2026_09_50_48_AM_sanrrw.png";

const SIZES = {
  sm: 30,
  md: 40,
  lg: 56,
};

/**
 * SiteCraftLogo Component
 * Reusable, responsive logo with proper sizing options
 * Supports light/dark backgrounds
 * 
 * @param {Object} props
 * @param {"sm" | "md" | "lg"} props.size - Logo size variant (default: "md")
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.href - Link destination (default: "/")
 * @param {string} props.alt - Alt text for image (default: "SiteCraft AI")
 */
export function SiteCraftLogo({
  size = "md",
  className,
  href = "/",
  alt = "SiteCraft AI",
}) {
  const height = SIZES[size];

  const logo = (
    <img
      src={LOGO_URL}
      alt={alt}
      height={height}
      style={{
        height: `${height}px`,
        width: "auto",
        objectFit: "contain",
      }}
      className={cn("block", className)}
    />
  );

  return href ? (
    <Link href={href} className="flex items-center">
      {logo}
    </Link>
  ) : (
    <div className="flex items-center">{logo}</div>
  );
}
