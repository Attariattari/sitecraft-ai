"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { resetPasswordSchema } from "@/lib/validations/authValidation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
    },
  });

  useEffect(() => {
    if (token) {
      setValue("token", token);
    }
  }, [token, setValue]);

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setServerError(result.message || "Failed to reset password");
        return;
      }

      setSuccessMessage(result.message);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setServerError("An error occurred. Please try again later.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 text-center shadow-xl shadow-primary/5">
          <h1 className="text-xl font-bold text-destructive mb-3">
            Invalid Link
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            The password reset link is invalid or missing the token.
          </p>
          <Link
            href="/forgot-password"
            className="text-primary font-semibold hover:underline"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5 relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Create new password
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
            {serverError}
          </div>
        )}

        {successMessage ? (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-medium border border-emerald-500/20 text-center">
            {successMessage}
            <div className="mt-4 text-sm text-muted-foreground">
              Redirecting to login...
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 text-left flex flex-col"
          >
            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-foreground">
                New Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-foreground">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-xs">
                  {errors.confirmPassword.message}
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
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
