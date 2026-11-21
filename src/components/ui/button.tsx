import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand)] text-white shadow-2xs hover:bg-[var(--color-brand-hover)] active:scale-[0.98]",
        secondary:
          "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] shadow-2xs hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-border)] active:scale-[0.98]",
        outline:
          "border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand)] active:scale-[0.98]",
        tertiary:
          "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]",
        ghost:
          "text-[var(--color-text-primary)] hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand)]",
        danger:
          "bg-[var(--color-danger)] text-white shadow-2xs hover:bg-[var(--color-danger-hover)] active:scale-[0.98]",
        link:
          "text-[var(--color-brand)] underline-offset-4 hover:underline p-0 h-auto min-h-0",
      },
      size: {
        sm: "px-3.5 py-1.5 text-xs min-h-[36px]",
        md: "px-5 py-2.5",
        lg: "px-6 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
}
