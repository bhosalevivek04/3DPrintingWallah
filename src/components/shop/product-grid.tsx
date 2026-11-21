"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/shop/product-card";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onResetFilters: () => void;
}

export function ProductGrid({ products, onResetFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-[var(--border)] bg-stone-50/50">
        <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-xs text-[var(--muted-foreground)] mb-3">
          <PackageSearch className="h-7 w-7 text-[var(--primary)]" />
        </div>
        <h3 className="text-base font-bold text-[var(--foreground)]">
          No matching 3D products found
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-sm">
          We couldn&apos;t find any objects matching your active search and filter criteria. Try adjusting or resetting your filters.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
