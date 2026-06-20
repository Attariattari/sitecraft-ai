import { cn } from "@/lib/utils";

export function DashboardSkeleton({ className }) {
  return (
    <div
      className={cn("shimmer h-4 rounded-md bg-muted animate-pulse", className)}
    />
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="rounded-xl border border-border p-5 bg-card">
      <div className="flex items-start gap-3 mb-4">
        <DashboardSkeleton className="w-9 h-9 rounded-lg" />
      </div>
      <DashboardSkeleton className="w-16 h-7 mb-2 rounded" />
      <DashboardSkeleton className="w-24 h-3" />
    </div>
  );
}

export function DashboardRowSkeleton() {
  return (
    <div className="rounded-xl border border-border p-5 bg-card space-y-3">
      <div className="flex items-center justify-between">
        <DashboardSkeleton className="w-48 h-5" />
        <DashboardSkeleton className="w-20 h-5 rounded-full" />
      </div>
      <DashboardSkeleton className="w-full h-3" />
      <DashboardSkeleton className="w-3/4 h-3" />
    </div>
  );
}

export function DashboardGridSkeleton({ count = 6, variant = "card" }) {
  const Comp = variant === "row" ? DashboardRowSkeleton : DashboardCardSkeleton;
  return (
    <div
      className={cn(
        "gap-4",
        variant === "row"
          ? "space-y-3"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Comp key={i} />
      ))}
    </div>
  );
}
