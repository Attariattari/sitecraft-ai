import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  route,
  children,
  badge,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-black text-foreground tracking-tight leading-none m-0 p-0">
            {title}
          </h1>
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
          {route && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-muted text-muted-foreground border border-border">
              {route}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed m-0">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      )}
    </div>
  );
}
