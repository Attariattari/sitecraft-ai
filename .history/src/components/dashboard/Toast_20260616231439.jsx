"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-primary/30 bg-primary/10 text-primary",
};

let toastQueue = [];
let setToastExternal = null;

export function toast(message, type = "success") {
  const id = Date.now();
  const newToast = { id, message, type };
  toastQueue = [...toastQueue, newToast];
  if (setToastExternal) setToastExternal([...toastQueue]);
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    if (setToastExternal) setToastExternal([...toastQueue]);
  }, 3500);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setToastExternal = setToasts;
    return () => {
      setToastExternal = null;
    };
  }, []);

  const remove = (id) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    setToasts([...toastQueue]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-3rem)]">
      <AnimatePresence>
        {toasts.map(({ id, message, type }) => {
          const Icon = ICONS[type] ?? CheckCircle2;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl",
                STYLES[type],
              )}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-sm font-medium flex-1 leading-snug">
                {message}
              </p>
              <button
                onClick={() => remove(id)}
                className="shrink-0 opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
