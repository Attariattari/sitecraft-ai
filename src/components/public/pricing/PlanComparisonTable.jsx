import { CheckCircle2, XCircle } from "lucide-react";
import { formatLimitValue } from "@/lib/plans/planEntitlements";

function formatValue(row, value) {
  if (row.type === "feature") return value ? "Included" : "Not included";
  return formatLimitValue(value, "High limit");
}

export function PlanComparisonTable({ comparison, compact = false }) {
  const plans = comparison?.plans || [];
  const rows = comparison?.rows || [];

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="p-4 text-left font-black text-foreground">Plan access</th>
            {plans.map((plan) => (
              <th key={plan.slug} className="p-4 text-center font-black text-foreground">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, compact ? 8 : rows.length).map((row) => (
            <tr key={row.key} className="border-b border-border last:border-b-0">
              <td className="p-4 font-bold text-foreground">{row.label}</td>
              {plans.map((plan) => {
                const value = row.values?.[plan.slug];
                const included = Boolean(value);
                return (
                  <td key={plan.slug} className="p-4 text-center text-muted-foreground">
                    {row.type === "feature" ? (
                      <span className="inline-flex items-center justify-center">
                        {included ? (
                          <CheckCircle2 className="size-5 text-primary" />
                        ) : (
                          <XCircle className="size-5 text-muted-foreground/60" />
                        )}
                        <span className="sr-only">{formatValue(row, value)}</span>
                      </span>
                    ) : (
                      <span className="font-black text-foreground">{formatValue(row, value)}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
