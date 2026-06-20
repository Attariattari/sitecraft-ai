"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Info, Trash2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ConfirmDialog — custom SweetAlert-style modal.
 *
 * Usage:
 *   const { confirm, ConfirmDialog } = useConfirm();
 *   ...
 *   const ok = await confirm({ ... });
 *   if (ok) { ... }
 *
 * Render <ConfirmDialog /> once in your component tree.
 */

const VARIANTS = {
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    confirmClass: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  danger: {
    icon: Trash2,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    confirmClass: "bg-red-500 hover:bg-red-600 text-white",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    confirmClass: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    confirmClass: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
};

export function useConfirm() {
  const [dialog, setDialog] = useState(null);

  // Returns a promise that resolves true/false
  const confirm = useCallback(
    ({
      title = "Are you sure?",
      description = "",
      confirmText = "Confirm",
      cancelText = "Cancel",
      variant = "warning", // warning | danger | info | success
    } = {}) => {
      return new Promise((resolve) => {
        setDialog({
          title,
          description,
          confirmText,
          cancelText,
          variant,
          resolve,
        });
      });
    },
    [],
  );

  const handleClose = (result) => {
    if (dialog) dialog.resolve(result);
    setDialog(null);
  };

  const ConfirmDialog = () => {
    if (!dialog || typeof window === "undefined") return null;

    const v = VARIANTS[dialog.variant] || VARIANTS.warning;
    const Icon = v.icon;

    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={() => handleClose(false)}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

        {/* Card */}
        <div
          className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent bar */}
          <div
            className={cn(
              "h-1 w-full",
              dialog.variant === "danger"
                ? "bg-red-500"
                : dialog.variant === "success"
                  ? "bg-emerald-500"
                  : dialog.variant === "info"
                    ? "bg-blue-500"
                    : "bg-amber-500",
            )}
          />

          <div className="p-6 space-y-5">
            {/* Header row */}
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  v.iconBg,
                )}
              >
                <Icon className={cn("w-6 h-6", v.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-foreground leading-tight">
                  {dialog.title}
                </h3>
                {dialog.description && (
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {dialog.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Separator */}
            <div className="border-t border-border" />

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="px-4 py-2 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-all"
              >
                {dialog.cancelText}
              </button>
              <button
                type="button"
                onClick={() => handleClose(true)}
                className={cn(
                  "px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md",
                  v.confirmClass,
                )}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  return { confirm, ConfirmDialog };
}
