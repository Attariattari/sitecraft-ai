import { cn } from "@/lib/utils";

export function AdminEmptyState({
  icon: Icon,
  title = "No data yet",
  description = "This section will be populated once data is available.",
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      )}
      <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
        {description}
      </p>
      {action}
    </div>
  );
}
