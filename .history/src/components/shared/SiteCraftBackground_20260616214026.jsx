"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function SiteCraftBackground({ children }) {
  const pathname = usePathname();

  // Optional: Disable or simplify on specific routes if needed
  const isDashboard =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <div className="relative min-h-screen">
      {/* Global Background Layer */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none bg-background">
        {/* Glow - Top Left (Emerald) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5"
        />

        {/* Glow - Bottom Right (Orange) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-[15%] -right-[10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[100px] dark:bg-accent/5"
        />

        {/* Dynamic Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-primary/[0.03] to-transparent pointer-events-none" />

        {/* Professional Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* CSS-only Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full min-h-screen">{children}</div>

      {/* Subtle Glassy Vignette (Optional, adds depth) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-tr from-background/10 via-transparent to-background/5" />
    </div>
  );
}
