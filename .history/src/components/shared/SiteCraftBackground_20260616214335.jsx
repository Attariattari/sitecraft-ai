"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function SiteCraftBackground({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* 1. Ambient Decoration Layer (Z-index behind content) */}
      <div className="fixed inset-0 pointer-events-none select-none z-0">
        {/* Top-Right Emerald Orb */}
        <motion.div
          animate={
            mounted
              ? {
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5"
        />

        {/* Bottom-Left Orange Orb */}
        <motion.div
          animate={
            mounted
              ? {
                  x: [0, -40, 0],
                  y: [0, 40, 0],
                  scale: [1, 1.2, 1],
                }
              : {}
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-[10%] -left-[5%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[100px] dark:bg-accent/5 opacity-60"
        />

        {/* Center Subtler Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-40 dark:from-primary/10 pointer-events-none" />

        {/* 2. Grid/Dot Pattern Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* 3. Glossy Glass Layer (Noise/Texture) */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* 4. Content Layer */}
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
}
