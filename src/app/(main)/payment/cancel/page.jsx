import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = {
  title: "Payment Status | SiteCraft AI",
};

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-xl rounded-lg border border-border bg-card p-8 text-center">
        <XCircle className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-5 text-3xl font-black text-foreground">Payment cancelled</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          No plan access was changed. You can return to checkout or compare plans again.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/pricing" className="rounded-lg bg-primary px-5 py-3 text-sm font-black text-primary-foreground">
            Compare Plans
          </Link>
          <Link href="/dashboard/billing" className="rounded-lg border border-border px-5 py-3 text-sm font-black text-foreground">
            Billing
          </Link>
        </div>
      </section>
    </main>
  );
}
