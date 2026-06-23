import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";

export function UpgradeCard({
  title = "Upgrade required",
  message = "Your current plan does not include this feature.",
  upgradeTo = "pro",
  ctaLabel,
  compact = false,
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LockKeyhole className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-foreground">{title}</h3>
          <p className={`mt-1 text-sm text-muted-foreground ${compact ? "line-clamp-2" : ""}`}>
            {message}
          </p>
          <Link
            href="/pricing"
            className="mt-3 inline-flex items-center gap-2 text-sm font-black text-primary hover:opacity-80"
          >
            {ctaLabel || `Upgrade to ${upgradeTo}`}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
