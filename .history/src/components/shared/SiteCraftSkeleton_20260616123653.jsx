import { cn } from "@/lib/utils";

export function SiteCraftSkeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/40 relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export function SiteCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 flex flex-col gap-4">
      <SiteCraftSkeleton className="aspect-video w-full rounded-2xl" />
      <div className="space-y-3">
        <SiteCraftSkeleton className="h-6 w-3/4 rounded-full" />
        <SiteCraftSkeleton className="h-4 w-1/2 rounded-full" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <SiteCraftSkeleton className="h-10 w-24 rounded-xl" />
        <SiteCraftSkeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}

export function SiteSectionSkeleton() {
  return (
    <div className="space-y-8 py-8 w-full">
      <div className="space-y-3">
        <SiteCraftSkeleton className="h-10 w-48 rounded-full" />
        <SiteCraftSkeleton className="h-4 w-96 rounded-full max-w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SiteCardSkeleton />
        <SiteCardSkeleton />
        <SiteCardSkeleton />
      </div>
    </div>
  );
}
