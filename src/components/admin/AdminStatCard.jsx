import { cn } from "@/lib/utils";

export function AdminStatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  iconClass,
  className,
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/25",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
            iconClass ?? "bg-primary/10",
          )}
        >
          {Icon && (
            <Icon
              className={cn(
                "w-5 h-5",
                iconClass ? "text-white" : "text-primary",
              )}
            />
          )}
        </div>
        {trend != null && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-lg",
              trend >= 0
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/15 text-red-600 dark:text-red-400",
            )}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-foreground tracking-tight mb-1 leading-none relative">
        {value}
      </p>
      <p className="text-sm font-semibold text-foreground mb-1 relative">
        {label}
      </p>
      {sub && <p className="text-xs text-muted-foreground relative">{sub}</p>}
    </div>
  );
}
