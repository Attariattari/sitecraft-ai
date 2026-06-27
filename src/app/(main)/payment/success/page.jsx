"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-xl rounded-lg border border-border bg-card p-8 text-center">
        {paymentId ? <Clock className="mx-auto size-10 text-primary" /> : <CheckCircle2 className="mx-auto size-10 text-primary" />}
        <h1 className="mt-5 text-3xl font-black text-foreground">Payment status received</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          SiteCraft AI will show paid access only after server-side gateway verification or Super Admin manual verification. Manual transfers can remain pending.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard/billing" className="rounded-lg bg-primary px-5 py-3 text-sm font-black text-primary-foreground">
            View Billing
          </Link>
          <Link href="/pricing" className="rounded-lg border border-border px-5 py-3 text-sm font-black text-foreground">
            Back to Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
