"use client";

import { motion } from "framer-motion";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
      {/* Mesh Gradients - Top Right (Primary) */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5"
      />

      {/* Mesh Gradients - Bottom Left (Accent) */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-[15%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px] dark:bg-accent/5"
      />

      {/* Center ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50 dark:from-primary/10" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
