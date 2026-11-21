import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
}

export function Breadcrumbs({
  items,
  showHomeIcon = true,
  className = "mb-6",
}: BreadcrumbsProps) {
  // Ensure "Home" is the first element if not explicitly present
  const allItems: BreadcrumbItem[] =
    items.length > 0 && items[0].href === "/"
      ? items
      : [{ label: "Home", href: "/" }, ...items];

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs font-medium text-[var(--muted-foreground)] ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5 sm:gap-2">
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 text-stone-300 shrink-0 select-none"
                  aria-hidden="true"
                />
              )}

              {isLast || !item.href ? (
                <span
                  className="font-bold text-[var(--foreground)] tracking-tight truncate max-w-[200px] sm:max-w-md select-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded px-1 py-0.5 active:scale-95"
                >
                  {isFirst && showHomeIcon && (
                    <Home className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
