"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface ShopHeaderProps {
  totalCount: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

export function ShopHeader({
  totalCount,
  filteredCount,
  searchQuery,
  onSearchChange,
  onClearSearch,
}: ShopHeaderProps) {
  return (
    <div className="flex flex-col gap-6 pb-6 border-b border-[var(--border)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)] bg-[var(--muted)] px-2.5 py-1 rounded-md">
              Store Catalogue
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {filteredCount === totalCount
                ? `${totalCount} products available`
                : `Showing ${filteredCount} of ${totalCount} products`}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)] mt-2">
            Explore Our 3D Creations
          </h1>
          <p className="text-base text-[var(--muted-foreground)] mt-1.5 max-w-2xl leading-relaxed">
            From precision desk organisers to collectible miniatures and bespoke homeware, every object is custom sliced and 3D printed in our workshop.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <div className="relative flex items-center">
            <Search
              className="absolute left-3.5 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search figurines, miniatures, decor..."
              className="w-full h-11 pl-10 pr-9 rounded-xl border border-[var(--border)] bg-white text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all shadow-xs"
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onClearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
