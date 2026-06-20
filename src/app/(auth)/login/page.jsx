"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema } from "@/lib/validations/authValidation";
import { SiteCraftLogo } from "@/components/common/SiteCraftLogo";

export default function LoginPage() {
  const { setUser } = useUser();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isUnverified, setIsUnverified] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const currentEmail = watch("email");

  const onSubmit = async (data) => {
    setServerError("");
    setIsUnverified(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // Root Super Admin OTP flow
      if (result.isSuperAdmin) {
        if (res.status === 429) {
          setServerError(result.message || "Please wait before requesting a new code.");
          return;
        }
        router.push("/verify-super-admin?email=" + encodeURIComponent(data.email));
        return;
      }

      if (!res.ok) {
        setServerError(result.message || "Failed to log in.");
        if (result.isUnverified) {
          setIsUnverified(true);
        }
        return;
      }

      // Set user in context and broadcast login to other tabs
      try {
        if (result.user && setUser) setUser(result.user);
      } catch (e) {
        // ignore
      }

      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        try {
          const bc = new BroadcastChannel("sitecraft-auth");
          bc.postMessage({ type: "login", payload: result.user || null });
          bc.close();
        } catch (e) {
          console.warn("BroadcastChannel broadcast failed:", e);
        }
      }

      router.push("/dashboard");
    } catch (err) {
      setServerError("An error occurred. Please try again later.");
    }
  };

  const handleGoogle = async () => {
    setServerError("");
    setIsGoogleLoading(true);
    try {
      // Navigate to server start route which redirects to Google consent
      window.location.href = "/api/auth/google/start";
    } catch (err) {
      setIsGoogleLoading(false);
      setServerError("Failed to start Google sign-in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5 relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <SiteCraftLogo size="lg" href="/" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in to your account to continue.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center flex flex-col items-center gap-3">
            {serverError}
            {isUnverified && (
              <button
                onClick={() => router.push("/verify-email?email=" + encodeURIComponent(currentEmail))}
                className="text-primary hover:underline font-bold"
              >
                Go to Verification Page
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogle}
            disabled={isGoogleLoading}
            className="w-full py-3.5 px-4 bg-background border border-border rounded-xl flex items-center justify-center gap-3 hover:shadow-sm transition disabled:opacity-70"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in with Google...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                  <path d="M533.5 278.4c0-18.5-1.5-36.2-4.4-53.4H272v100.9h146.9c-6.4 34.5-25.3 63.7-54 83.3v68h87.2c51-46.9 80.4-116.3 80.4-198.8z" fill="#4285F4"/>
                  <path d="M272 544.3c73.6 0 135.4-24.4 180.6-66.2l-87.2-68c-24.2 16.2-55.2 25.8-93.4 25.8-71.7 0-132.5-48.4-154.2-113.3H26.4v71.1C71.7 486.4 165.6 544.3 272 544.3z" fill="#34A853"/>
                  <path d="M117.8 323.6c-10.8-32.4-10.8-67.1 0-99.5V153h-91.4C8.9 204.3 0 243.8 0 272s8.9 67.7 26.4 119l91.4-67.4z" fill="#FBBC05"/>
                  <path d="M272 107.9c39.9 0 75.8 13.7 104.1 40.7l78.1-78.1C403.6 24.6 341.8 0 272 0 165.6 0 71.7 57.9 26.4 153l91.4 71.1C139.5 156.3 200.3 107.9 272 107.9z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px bg-border flex-1" />
            <div className="text-sm text-muted-foreground">or continue with email</div>
            <div className="h-px bg-border flex-1" />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 flex flex-col"
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
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
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

          <div className="mt-4">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-md border-2 border-border peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-foreground font-medium">
                Remember me
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 mt-6 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
