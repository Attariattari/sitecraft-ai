import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import * as Icons from "lucide-react";

export function CategoryCard({ category, isSelected, onClick }) {
  const Icon = Icons[category.icon] || Icons.User;

  const isPopular = category.badge === "Popular";
  const badgeClass = isPopular
    ? "bg-primary/10 text-primary border-primary/20"
    : "bg-accent/10 text-accent-foreground border-accent/20";

  const sectionCount = category.sections?.length || 0;

  return (
    <button
      type="button"
      onClick={() => onClick(category.id)}
      className={cn(
        "group relative text-left bg-card border rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 flex flex-col h-full min-h-[220px] p-[24px]",
        isSelected
          ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md shadow-primary/5"
          : "border-border hover:border-primary/30 hover:shadow-md hover:-translate-y-1",
      )}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <div className="absolute top-5 right-5 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10 animate-in fade-in zoom-in duration-200">
          <Check className="w-3.5 h-3.5" />
          Selected
        </div>
      )}

      <div className="flex items-start justify-between mb-5">
        <div
          className={cn(
            "w-[50px] h-[50px] rounded-xl border flex items-center justify-center transition-all duration-200 shrink-0",
            isSelected
              ? "bg-primary/20 border-primary/30 text-primary"
              : "bg-primary/10 border-primary/15 text-primary group-hover:bg-primary/15 group-hover:border-primary/30",
          )}
        >
          <Icon className="w-6 h-6" />
        </div>

        {!isSelected && category.badge && (
          <span
            className={cn(
              "text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border z-10",
              badgeClass,
            )}
          >
            {category.badge}
          </span>
        )}
      </div>

      <div className="flex-1">
        <h3
          className={cn(
            "text-lg md:text-xl font-bold mb-2 transition-colors duration-200",
            isSelected
              ? "text-primary"
              : "text-foreground group-hover:text-primary",
          )}
        >
          {category.label}
        </h3>

        <div className="mb-3">
          <span className="inline-block text-xs font-medium text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md">
            {category.purpose}
          </span>
        </div>

        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isSelected ? "bg-primary" : "bg-primary/40",
            )}
          />
          {sectionCount} sections
        </span>
      </div>
    </button>
  );
}
