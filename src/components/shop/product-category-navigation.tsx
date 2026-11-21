"use client";

import React, { useRef } from "react";
import { ProductCategory } from "@/types/product";
import { SHOP_CATEGORIES } from "@/data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCategoryNavigationProps {
  activeCategory: ProductCategory;
  categoryCounts: Record<ProductCategory, number>;
  onSelectCategory: (category: ProductCategory) => void;
}

export function ProductCategoryNavigation({
  activeCategory,
  categoryCounts,
  onSelectCategory,
}: ProductCategoryNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex items-center py-3 border-b border-[var(--border)]/70">
      {/* Scroll Left Button */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll categories left"
        className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all shadow-xs mr-2 cursor-pointer active:scale-90"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Categories Horizontal Scroll with Apple-style Segmented Pills */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth w-full"
        style={{ WebkitOverflowScrolling: "touch" }}
        role="tablist"
        aria-label="Product categories"
      >
        {SHOP_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          const count = categoryCounts[category] ?? 0;

          return (
            <button
              key={category}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(category)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] active:scale-95 ${
                isActive
                  ? "bg-[var(--brand-inverse)] text-white shadow-xs font-bold"
                  : "bg-white text-[var(--foreground)] border border-[var(--border)]/80 hover:bg-stone-50 hover:border-stone-400"
              }`}
            >
              <span>{category}</span>
              {count > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll categories right"
        className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all shadow-xs ml-2 cursor-pointer active:scale-90"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
