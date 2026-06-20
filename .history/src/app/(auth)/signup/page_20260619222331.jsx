"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signupSchema } from "@/lib/validations/authValidation";
export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories/available?context=signup");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch signup categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      accountPurpose: "portfolio",
    },
  });

  // Automatically set default purpose when categories load if needed
  useEffect(() => {
    if (
      categories.length > 0 &&
      categories.some((c) => c.slug === "portfolio")
    ) {
      setValue("accountPurpose", "portfolio");
    } else if (categories.length > 0) {
      setValue("accountPurpose", categories[0].slug);
    }
  }, [categories, setValue]);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          accountPurpose: data.accountPurpose,
          terms: data.terms,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setServerError(result.message || "Failed to sign up");
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setServerError("An error occurred. Please try again later.");
    }
  };

  const handleGoogle = async () => {
    setServerError("");
    setIsGoogleLoading(true);
    try {
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
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </span>
            <span className="text-2xl font-black text-foreground tracking-tight">
              SiteCraft AI
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Start building AI-powered websites today.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
            {serverError}
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
                Signing up with Google...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 533.5 544.3"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M533.5 278.4c0-18.5-1.5-36.2-4.4-53.4H272v100.9h146.9c-6.4 34.5-25.3 63.7-54 83.3v68h87.2c51-46.9 80.4-116.3 80.4-198.8z"
                    fill="#4285F4"
                  />
                  <path
                    d="M272 544.3c73.6 0 135.4-24.4 180.6-66.2l-87.2-68c-24.2 16.2-55.2 25.8-93.4 25.8-71.7 0-132.5-48.4-154.2-113.3H26.4v71.1C71.7 486.4 165.6 544.3 272 544.3z"
                    fill="#34A853"
                  />
                  <path
                    d="M117.8 323.6c-10.8-32.4-10.8-67.1 0-99.5V153h-91.4C8.9 204.3 0 243.8 0 272s8.9 67.7 26.4 119l91.4-67.4z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M272 107.9c39.9 0 75.8 13.7 104.1 40.7l78.1-78.1C403.6 24.6 341.8 0 272 0 165.6 0 71.7 57.9 26.4 153l91.4 71.1C139.5 156.3 200.3 107.9 272 107.9z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px bg-border flex-1" />
            <div className="text-sm text-muted-foreground">
              or continue with email
            </div>
            <div className="h-px bg-border flex-1" />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 flex flex-col"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              {errors.name && (
                <p className="text-destructive text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-foreground">
                Password
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
                Confirm Password
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

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                What are you building?
              </label>
              <select
                {...register("accountPurpose")}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select your goal
                </option>
                {siteCraftPersonalInfoCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.accountPurpose && (
                <p className="text-destructive text-xs">
                  {errors.accountPurpose.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center pt-1">
                  <input
                    type="checkbox"
                    {...register("terms")}
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
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-destructive text-xs mt-1.5 pl-8">
                  {errors.terms.message}
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
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
