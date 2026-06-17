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
        "rounded-xl border border-border p-5 transition-all duration-300",
        glass ? "site-glass-card" : "bg-card shadow-sm",
        hover &&
          !glass &&
          "hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20",
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
    <DashboardCard className={cn("group", cardClass)}>
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            iconClass ?? "bg-primary/10",
          )}
        >
          {Icon && (
            <Icon
              className={cn(
                "w-4.5 h-4.5",
                iconClass ? "text-white" : "text-primary",
              )}
            />
          )}
        </div>
        {trend != null && (
          <span
            className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full",
              trend >= 0
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 text-red-500",
            )}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">
        {value}
      </p>
      <p className="text-xs font-medium text-muted-foreground mt-0.5">
        {label}
      </p>
      {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
    </DashboardCard>
  );
}
