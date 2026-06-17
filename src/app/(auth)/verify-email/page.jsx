"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (e) => {
    e?.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setError("");
    setResendMessage("");
    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Invalid code");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      router.push("/dashboard/personal-info");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    if (cooldown > 0) return;

    setError("");
    setResendMessage("");
    setIsResending(true);

    try {
      const res = await fetch("/api/auth/resend-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to resend code.");
        if (res.status === 429) setCooldown(60);
        return;
      }

      setResendMessage("A new code has been sent!");
      setCooldown(60);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5 relative z-10 text-center">
        <Link
          href="/signup"
          className="absolute top-8 left-8 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
          <Mail className="w-8 h-8" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Check your email
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          We sent a 6-digit verification code to{" "}
          <span className="font-semibold text-foreground">{email}</span>.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}

        {resendMessage && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-medium border border-emerald-500/20">
            {resendMessage}
          </div>
        )}

        <form onSubmit={verifyCode}>
          <div className="flex justify-center gap-2 md:gap-3 mb-8">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying || code.join("").length !== 6}
            className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed mb-6"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        <div className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          {cooldown > 0 ? (
            <span className="font-medium text-foreground">
              Resend in {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={resendCode}
              disabled={isResending}
              className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
