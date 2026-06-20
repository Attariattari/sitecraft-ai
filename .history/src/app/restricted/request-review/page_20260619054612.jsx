"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";

function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please provide a message for the review request.");
      return;
    }
    if (!token) {
      setError("Invalid or missing review token. Please check your email.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/restriction/request-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, message }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError("Failed to submit request. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Request Sent
        </h1>
        <p className="text-muted-foreground mb-8">
          Your review request has been sent to the Super Admin. You will receive
          an email once we have reviewed your account.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        Request Review
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Explain why you believe your access should be restored.
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Message to Admin
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us why we should reconsider the restriction..."
            className="w-full min-h-[150px] rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="w-full py-4 px-6 bg-primary text-primary-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Request
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function RequestReviewPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5 relative z-10">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">
                Loading request form...
              </p>
            </div>
          }
        >
          <ReviewForm />
        </Suspense>
      </div>
    </div>
  );
}
