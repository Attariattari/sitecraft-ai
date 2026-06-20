import { cn } from "@/lib/utils";

export function DashboardShell({ children, className }) {
  return (
    <div
      className={cn("flex-1 min-h-0 p-4 lg:p-6 xl:p-8 space-y-6", className)}
    >
      {children}
    </div>
  );
}

export function DashboardPageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      )}
    </div>
  );
}
