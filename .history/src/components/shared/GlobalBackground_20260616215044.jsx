"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none bg-background">
      {/* 1. Base Layer: Subtle Mesh Gradients */}
      <div className="absolute inset-0 z-0">
        {/* Top-Left Emerald Glow (Primary) */}
        <motion.div
          animate={
            mounted
              ? {
                  x: [0, 40, 0],
                  y: [0, 20, 0],
                  scale: [1, 1.15, 1],
                }
              : {}
          }
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[15%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/[0.08] blur-[140px] dark:bg-primary/[0.05]"
        />

        {/* Bottom-Right Orange Glow (Accent) */}
        <motion.div
          animate={
            mounted
              ? {
                  x: [0, -50, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute -bottom-[20%] -right-[5%] w-[60vw] h-[60vw] rounded-full bg-accent/[0.06] blur-[120px] dark:bg-accent/[0.04]"
        />
      </div>

      {/* 2. Glassy Depth Layer: Large Subtle Blobs */}
      <div className="absolute inset-0 z-10 overflow-hidden opacity-50">
        <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[100px] dark:bg-primary/[0.04]" />
        <div className="absolute bottom-[25%] left-[10%] w-[350px] h-[350px] rounded-full bg-accent/[0.02] blur-[80px] dark:bg-accent/[0.03]" />
      </div>

      {/* 3. Texture Layer: Premium Dot Matrix */}
      <div
        className="absolute inset-0 z-20 opacity-[0.03] dark:opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* 4. Glossy Noise Grain Overlay */}
      <div className="absolute inset-0 z-30 opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 5. Edge vignette for focus */}
      <div className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_95%)] opacity-30 pointer-events-none" />
    </div>
  );
}
