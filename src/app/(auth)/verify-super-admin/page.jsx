"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

function maskEmail(email) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 3);
  return `${visible}${"*".repeat(Math.max(user.length - 3, 2))}@${domain}`;
}

function VerifySuperAdminForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) router.push("/login");
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...code];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setCode(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const verify = async (e) => {
    e?.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) { setError("Please enter the 6-digit code."); return; }

    setError(""); setInfo("");
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/super-admin/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Invalid code.");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }
      router.push("/admin");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setError(""); setInfo("");
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/super-admin/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (result.cooldown) setCooldown(result.cooldown);
        setError(result.message || "Failed to resend.");
        return;
      }
      setInfo("A new code has been sent to your email.");
      setCooldown(60);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5 relative z-10 text-center">
      <Link
        href="/login"
        className="absolute top-8 left-8 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
        <ShieldCheck className="w-8 h-8" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        Admin Verification
      </h1>
      <p className="text-sm text-muted-foreground mb-1">
        A 6-digit code was sent to
      </p>
      <p className="text-sm font-semibold text-foreground mb-8">
        {maskEmail(email)}
      </p>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
          {error}
        </div>
      )}
      {info && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-medium border border-emerald-500/20">
          {info}
        </div>
      )}

      <form onSubmit={verify}>
        <div className="flex justify-center gap-2 md:gap-3 mb-8" onPaste={handlePaste}>
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
            "Verify & Access Admin"
          )}
        </button>
      </form>

      <div className="text-sm text-muted-foreground">
        Didn&apos;t receive the code?{" "}
        {cooldown > 0 ? (
          <span className="font-medium text-foreground">Resend in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={isResending}
            className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VerifySuperAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-12 flex flex-col items-center justify-center shadow-xl shadow-primary/5 relative z-10">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Loading...</p>
          </div>
        }
      >
        <VerifySuperAdminForm />
      </Suspense>
    </div>
  );
}
