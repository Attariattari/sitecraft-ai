import { formatLimitValue } from "@/lib/plans/planEntitlements";

export function LimitProgress({
  label,
  used = 0,
  limit = 0,
  helper,
}) {
  const openEnded = limit === -1;
  const percent = openEnded || !limit ? 0 : Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-foreground">{label}</span>
        <span className="shrink-0 text-xs font-black text-muted-foreground">
          {used} / {formatLimitValue(limit)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: openEnded ? "100%" : `${percent}%` }}
        />
      </div>
      {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}
