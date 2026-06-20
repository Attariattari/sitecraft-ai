import Link from "next/link";
import { ShieldAlert, ArrowLeft, Mail } from "lucide-react";

export default function RestrictedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-destructive/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-destructive/5 relative z-10 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          Access Restricted
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          Your SiteCraft AI account access is currently restricted. If you
          believe this was a mistake, you can request a review and we will look
          into it.
        </p>

        <div className="space-y-4">
          <Link
            href="/restricted/request-review"
            className="w-full py-4 px-6 bg-primary text-primary-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Mail className="w-5 h-5" />
            Request Access Review
          </Link>

          <Link
            href="/login"
            className="w-full py-4 px-6 bg-secondary text-secondary-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Still having trouble? Contact support@sitecraftai.com
        </p>
      </div>
    </div>
  );
}
