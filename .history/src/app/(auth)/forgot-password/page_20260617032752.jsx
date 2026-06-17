"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validations/authValidation";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setMessage("");
    setServerError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setServerError(result.message || "An error occurred.");
        return;
      }

      setMessage(result.message);
    } catch (err) {
      setServerError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5 relative z-10 text-center">
        <Link
          href="/login"
          className="absolute top-8 left-8 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="mt-6 mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
            {serverError}
          </div>
        )}

        {message ? (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-medium border border-emerald-500/20 text-center">
            {message}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 text-left flex flex-col"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 mt-6 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
