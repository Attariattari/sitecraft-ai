import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: relative + overflow-hidden for the shimmer overlay + transition-all for all effects
  "group/button relative overflow-hidden inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:-translate-y-[1px] active:translate-y-[1px]",
  {
    variants: {
      variant: {
        // Primary: lift + glow shadow from primary colour + subtle brightness boost
        default:
          "bg-[var(--template-primary,var(--primary))] text-[var(--template-primary-foreground,var(--primary-foreground))] " +
          "shadow-sm hover:shadow-[0_6px_20px_-4px_var(--template-primary,var(--primary))] " +
          "hover:brightness-110 active:brightness-95 " +
          // Shimmer overlay pseudo-element via a child span trick using before:
          "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent " +
          "hover:before:translate-x-full before:transition-transform before:duration-500 before:ease-in-out",

        // Outline: border glows on hover with the primary colour + background tint
        outline:
          "border-[var(--template-border,var(--border))] bg-[var(--template-background,var(--background))] " +
          "text-[var(--template-foreground,var(--foreground))] " +
          "hover:border-[var(--template-primary,var(--primary))] hover:text-[var(--template-primary,var(--primary))] " +
          "hover:bg-[var(--template-soft-background,var(--muted))] " +
          "hover:shadow-[0_0_0_1px_var(--template-primary,var(--primary)),0_4px_12px_-4px_var(--template-primary,var(--primary))] " +
          "aria-expanded:bg-[var(--template-soft-background,var(--muted))] aria-expanded:text-[var(--template-foreground,var(--foreground))] " +
          "dark:border-[var(--template-border,var(--border))] dark:bg-transparent dark:hover:bg-[var(--template-primary,var(--primary))]/10",

        // Secondary: subtle lift + soft inner glow
        secondary:
          "bg-[var(--template-soft-background,var(--secondary))] text-[var(--template-secondary-foreground,var(--secondary-foreground))] " +
          "hover:bg-[var(--template-soft-background,var(--secondary))] hover:brightness-95 " +
          "hover:shadow-[0_4px_12px_-4px_var(--template-secondary,var(--secondary))] " +
          "aria-expanded:bg-[var(--template-soft-background,var(--secondary))]",

        // Ghost: background fills in theme colour with a faint tint
        ghost:
          "hover:bg-[var(--template-primary,var(--primary))]/10 hover:text-[var(--template-primary,var(--primary))] " +
          "aria-expanded:bg-[var(--template-soft-background,var(--muted))] aria-expanded:text-[var(--template-foreground,var(--foreground))]",

        destructive:
          "bg-destructive/10 text-destructive " +
          "hover:bg-destructive/20 hover:shadow-[0_4px_14px_-4px_theme(colors.red.500)] " +
          "focus-visible:border-destructive/40 focus-visible:ring-destructive/20 " +
          "dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",

        link: "text-[var(--template-primary,var(--primary))] underline-offset-4 hover:underline hover:-translate-y-0 hover:shadow-none",

        // Accent: shimmer + strong glow from accent colour
        accent:
          "bg-[var(--template-accent,var(--accent))] text-[var(--template-accent-foreground,var(--accent-foreground))] " +
          "shadow-sm hover:shadow-[0_6px_24px_-4px_var(--template-accent,var(--accent))] " +
          "hover:brightness-110 active:brightness-95 " +
          "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent " +
          "hover:before:translate-x-full before:transition-transform before:duration-500 before:ease-in-out",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
