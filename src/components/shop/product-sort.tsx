"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

export type SortOption =
  | "recommended"
  | "price-low"
  | "price-high"
  | "newest"
  | "rating";

interface ProductSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export function ProductSortBar({
  currentSort,
  onSortChange,
  resultCount,
  onOpenMobileFilters,
  activeFilterCount,
}: ProductSortProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[var(--border)]">
      {/* Mobile Filter Toggle */}
      <button
        type="button"
        onClick={onOpenMobileFilters}
        className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)]"
      >
        <ArrowUpDown className="h-4 w-4 text-[var(--primary)]" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="h-4 w-4 rounded-full text-[10px] font-bold bg-[var(--primary)] text-white flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Product count */}
      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
        Showing <strong className="text-[var(--foreground)]">{resultCount}</strong> items
      </p>

      {/* Sort Select */}
      <div className="flex items-center gap-2">
        <label htmlFor="product-sort" className="hidden sm:inline text-xs font-medium text-[var(--muted-foreground)]">
          Sort by:
        </label>
        <select
          id="product-sort"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="h-9 px-3 pr-8 rounded-xl border border-[var(--border)] bg-white text-xs sm:text-sm font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
        >
          <option value="recommended">Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
}
