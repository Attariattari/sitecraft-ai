"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Link2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { SiteCraftLoader } from "@/components/common/SiteCraftLoader";

function LinkGoogleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const id = window.setTimeout(() => {
      if (cancelled) return;

      if (!token) {
        setError("Linking token is missing.");
        setLoading(false);
        return;
      }

      try {
        // Decode JWT payload (base64) to show data
        // JWT is "header.payload.signature"
        const payloadBase64 = token.split(".")[1];
        const decoded = JSON.parse(atob(payloadBase64));

        if (decoded.expiresAt < Date.now()) {
          setError(
            "This linking request has expired. Please try logging in with Google again.",
          );
          setLoading(false);
          return;
        }

        setData(decoded);
        setLoading(false);
      } catch (err) {
        setError("Invalid linking token.");
        setLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [token]);

  const handleLink = async () => {
    if (!token) return;
    setLinking(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/google/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Failed to link account.");
        setLinking(false);
        return;
      }

      // Success -> Redirect to dashboard
      // Note: the API should have set the auth cookie
      router.push("/dashboard?linked=success");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLinking(false);
    }
  };

  if (loading) {
    return (
      <SiteCraftLoader
        variant="fullscreen"
        text="Preparing secure account linking..."
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Link Failed</h1>
          <p className="text-muted-foreground">{error}</p>
          <Link
            href="/login"
            className="block w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Link2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-3">
            Link your Google account?
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We found an existing SiteCraft AI account with this email. Link them
            to login with Google next time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Existing Account */}
          <div className="bg-background border border-border/50 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="text-[4rem] font-bold select-none">SC</span>
            </div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-primary/5 border-2 border-border mb-4 flex items-center justify-center overflow-hidden">
                {data?.existingUserImage ? (
                  <img
                    src={data.existingUserImage}
                    alt="Manual"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {data?.existingUserName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1 truncate w-full px-2">
                {data?.existingUserName}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {data?.existingUserEmail}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {data?.existingUserPlan}
                </span>
                <span className="px-2 py-1 bg-muted text-muted-foreground text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {data?.existingUserRole}
                </span>
              </div>
            </div>
          </div>

          {/* Google Account */}
          <div className="bg-background border border-border/50 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-400/30 transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-10 grayscale group-hover:grayscale-0 transition-all">
              <svg className="w-12 h-12" viewBox="0 0 533.5 544.3">
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
            </div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-border mb-4 flex items-center justify-center overflow-hidden">
                {data?.googlePicture ? (
                  <img
                    src={data.googlePicture}
                    alt="Google"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-blue-500">G</span>
                )}
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1 truncate w-full px-2">
                {data?.googleName}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {data?.googleEmail}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Google profile
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLink}
            disabled={linking}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 disabled:opacity-70"
          >
            {linking ? (
              <>
                <SiteCraftLoader variant="button" text="Linking accounts" />
                Linking accounts...
              </>
            ) : (
              "Link Google Account"
            )}
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-4 bg-background border border-border text-foreground font-semibold rounded-2xl hover:bg-muted/50 transition-all"
          >
            Cancel
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 flex items-start gap-3 bg-secondary/5 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Linking your accounts will not change your existing subscription,
            credits, or saved website data. It simply adds a new way to sign in
            securley. You can still use your email and password to log in.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LinkGooglePage() {
  return (
    <Suspense
      fallback={
        <SiteCraftLoader
          variant="fullscreen"
          text="Preparing secure account linking..."
        />
      }
    >
      <LinkGoogleContent />
    </Suspense>
  );
}
