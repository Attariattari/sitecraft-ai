import { cn } from "@/lib/utils";

export function DashboardShell({ children, className }) {
  return (
    <div
      className={cn("flex-1 min-h-0 p-6 lg:p-8 xl:p-10 space-y-8", className)}
    >
      {children}
    </div>
  );
}

export function DashboardPageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <div className="flex-1">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-3">
          {title}
        </h1>
        {description && (
          <p className="text-base text-muted-foreground leading-relaxed font-medium">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">{children}</div>
      )}
    </div>
  );
}
