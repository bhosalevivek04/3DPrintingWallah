import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider border transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-brand-subtle)] text-[var(--color-brand)] border-[var(--color-brand-subtle)]",
        brand:
          "bg-[var(--color-brand-subtle)] text-[var(--color-brand)] border-[var(--color-brand-light)]/40",
        sample:
          "bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
        "coming-soon":
          "bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]",
        new:
          "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]",
        bestseller:
          "bg-[var(--color-brand-subtle)] text-[var(--color-brand)] border-[var(--color-brand-light)]/40",
        success:
          "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]",
        warning:
          "bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]",
        danger:
          "bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger-border)]",
        info:
          "bg-[var(--color-info-bg)] text-[var(--color-info)] border-[var(--color-info-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
