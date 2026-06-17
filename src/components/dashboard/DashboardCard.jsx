import { cn } from "@/lib/utils";

export function DashboardCard({
  className,
  children,
  hover = true,
  glass = false,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border p-6 transition-all duration-300",
        glass
          ? "site-glass-card"
          : "bg-card shadow-sm hover:shadow-lg dark:shadow-sm dark:hover:shadow-xl",
        hover &&
          !glass &&
          "hover:border-primary/25 hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DashboardStatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  iconClass,
  cardClass,
}) {
  return (
    <DashboardCard className={cn("group relative overflow-hidden", cardClass)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative flex items-start justify-between mb-6">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md",
            iconClass ?? "bg-primary/10",
          )}
        >
          {Icon && (
            <Icon
              className={cn(
                "w-6 h-6",
                iconClass ? "text-white" : "text-primary",
              )}
            />
          )}
        </div>
        {trend != null && (
          <span
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
              trend >= 0
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/15 text-red-600 dark:text-red-400",
            )}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-4xl font-black text-foreground tracking-tight mb-2 leading-none">
        {value}
      </p>
      <p className="text-lg font-semibold text-foreground mb-2.5">
        {label}
      </p>
      {sub && <p className="text-base text-muted-foreground leading-relaxed font-medium">{sub}</p>}
    </DashboardCard>
  );
}
