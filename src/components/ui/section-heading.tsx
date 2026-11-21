import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base text-[var(--muted-foreground)] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
