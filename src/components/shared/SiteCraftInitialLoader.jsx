"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function SiteCraftInitialLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show only once per session
    const hasLoaded = sessionStorage.getItem("sitecraft_app_loaded");
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    // Lock body scroll during initial load
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("sitecraft_app_loaded", "true");
      document.body.style.overflow = "auto";
    }, 2000); // 2s duration for high-end feel

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617] select-none pointer-events-auto"
          role="status"
          aria-label="Loading SiteCraft AI"
        >
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg">
            <div className="absolute top-0 right-0 size-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 size-64 bg-accent/20 rounded-full blur-[100px]" />
          </div>

          <div className="relative text-center">
            {/* Animated Ring Wrapper */}
            <div className="relative size-24 mx-auto mb-10">
              {/* Spinning gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-accent/40"
              />

              {/* Pulsing inner dot */}
              <div className="absolute inset-2 rounded-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                <motion.div
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="size-4 rounded-full bg-primary shadow-lg shadow-primary/50"
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2 mb-2">
                SiteCraft{" "}
                <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                  AI
                </span>
                <Sparkles className="size-6 text-primary" />
              </h2>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-slate-400">
                  Preparing your intelligent website builder...
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-6">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="size-1.5 rounded-full bg-primary"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scanning line animation */}
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
