import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  draft: "bg-muted text-muted-foreground border-border",
  generated:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  published:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  archived:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

export function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize",
        style,
        className,
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "published"
            ? "bg-emerald-500"
            : status === "generated"
              ? "bg-blue-500"
              : status === "archived"
                ? "bg-orange-500"
                : "bg-muted-foreground",
        )}
      />
      {status}
    </span>
  );
}
