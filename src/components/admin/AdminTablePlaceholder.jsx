import { cn } from "@/lib/utils";

export function AdminTablePlaceholder({ columns = [], rows = 6, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {Array.from({ length: rows }).map((_, ri) => (
              <tr key={ri} className="animate-pulse">
                {columns.map((_, ci) => (
                  <td key={ci} className="px-5 py-4">
                    <div
                      className={cn(
                        "h-3.5 rounded bg-muted",
                        ci === 0 ? "w-32" : ci === 1 ? "w-24" : "w-16",
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/10">
        <p className="text-xs text-muted-foreground">
          Showing placeholder data — backend not connected
        </p>
        <div className="flex items-center gap-2">
          <div className="h-7 w-16 rounded-lg bg-muted animate-pulse" />
          <div className="h-7 w-16 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
