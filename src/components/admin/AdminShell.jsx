import { cn } from "@/lib/utils";

export function AdminShell({ children, className }) {
  return (
    <div className={cn("flex-1 min-h-0 p-6 lg:p-8 space-y-6", className)}>
      {children}
    </div>
  );
}
