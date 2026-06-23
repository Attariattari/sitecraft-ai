"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function HomeMouseSpotlight() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 95, damping: 26, mass: 0.22 });
  const smoothY = useSpring(cursorY, { stiffness: 95, damping: 26, mass: 0.22 });

  useEffect(() => {
    cursorX.set(window.innerWidth / 2);
    cursorY.set(window.innerHeight / 2);

    function handlePointerMove(event) {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [cursorX, cursorY]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden"
    >
      <motion.div
        className="absolute h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          left: smoothX,
          top: smoothY,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 24%, transparent) 0%, color-mix(in srgb, var(--accent) 14%, transparent) 42%, transparent 72%)",
        }}
      />
      <motion.div
        className="absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 opacity-50"
        style={{ left: smoothX, top: smoothY }}
      />
    </div>
  );
}
