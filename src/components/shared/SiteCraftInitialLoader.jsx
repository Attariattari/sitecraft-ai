"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SiteCraftLoader } from "@/components/common/SiteCraftLoader";

export function SiteCraftInitialLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    // Lock body scroll during initial load
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "auto";
    }, 2000); // 2s duration for high-end feel

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="select-none pointer-events-auto"
        >
          <SiteCraftLoader
            variant="fullscreen"
            text="Crafting your SiteCraft AI experience..."
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
