import Link from "next/link";
import { AlertTriangle, ArrowLeft, Mail } from "lucide-react";

export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl text-center">
        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          Account Suspended
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          Your account has been suspended by the SiteCraft AI administration.
          Please contact support if you believe this needs review.
        </p>

        <div className="space-y-4">
          <a
            href="mailto:support@sitecraftai.com"
            className="w-full py-4 px-6 bg-primary text-primary-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>

          <Link
            href="/login"
            className="w-full py-4 px-6 bg-secondary text-secondary-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
