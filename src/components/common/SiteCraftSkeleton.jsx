import { cn } from "@/lib/utils";

export function SiteCraftSkeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/40 bg-muted/35",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SiteCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <SiteCraftSkeleton className="aspect-video w-full rounded-2xl" />
      <div className="mt-5 space-y-3">
        <SiteCraftSkeleton className="h-6 w-3/4 rounded-full" />
        <SiteCraftSkeleton className="h-4 w-1/2 rounded-full" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <SiteCraftSkeleton className="h-10 w-28 rounded-xl" />
        <SiteCraftSkeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}

export function SiteSectionSkeleton({ cards = 3 }) {
  return (
    <div className="w-full space-y-8 py-8" role="status" aria-live="polite" aria-label="Loading section">
      <div className="space-y-3">
        <SiteCraftSkeleton className="h-10 w-48 rounded-full" />
        <SiteCraftSkeleton className="h-4 w-96 max-w-full rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <SiteCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
