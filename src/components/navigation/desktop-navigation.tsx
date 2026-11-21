import React from "react";
import Link from "next/link";
import { navigationConfig } from "@/config/navigation";

export function DesktopNavigation() {
  return (
    <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
      {navigationConfig.mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex min-h-[44px] items-center px-3 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--accent)] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
