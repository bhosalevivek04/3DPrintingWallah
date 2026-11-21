"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Product pagination"
      className="flex items-center justify-between pt-8 border-t border-[var(--border)] mt-8"
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-[var(--muted-foreground)]">
        <span>Page</span>
        <strong className="text-[var(--foreground)]">{currentPage}</strong>
        <span>of</span>
        <strong className="text-[var(--foreground)]">{totalPages}</strong>
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
