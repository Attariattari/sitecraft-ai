import Link from "next/link";
import { Sparkles } from "lucide-react";

export function DashboardEmptyState({
  icon: Icon = Sparkles,
  title = "Nothing here yet",
  description = "Get started by creating your first item.",
  actionLabel = "Get Started",
  actionHref = "/dashboard/generate",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 border border-primary/20">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
        {description}
      </p>
      <Link
        href={actionHref}
        className="site-primary-button inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
      >
        <Sparkles className="w-4 h-4" />
        {actionLabel}
      </Link>
    </div>
  );
}
