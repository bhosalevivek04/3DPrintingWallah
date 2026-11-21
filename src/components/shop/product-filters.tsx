"use client";

import React from "react";
import { Filter, X, RotateCcw } from "lucide-react";
import { ProductCategory } from "@/types/product";

export type AvailabilityFilterOption =
  | "All"
  | "in_stock"
  | "low_stock"
  | "made_to_order"
  | "out_of_stock";

export interface ShopFilterState {
  category: ProductCategory;
  availability: AvailabilityFilterOption;
  priceRange: "all" | "under-300" | "300-600" | "above-600";
  material: string | "all";
}

interface ProductFiltersProps {
  filters: ShopFilterState;
  onFilterChange: <K extends keyof ShopFilterState>(key: K, value: ShopFilterState[K]) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const PRICE_OPTIONS = [
  { id: "all", label: "All Prices" },
  { id: "under-300", label: "Under ₹300" },
  { id: "300-600", label: "₹300 to ₹600" },
  { id: "above-600", label: "Above ₹600" },
] as const;

export const AVAILABILITY_OPTIONS: { id: AvailabilityFilterOption; label: string }[] = [
  { id: "All", label: "All Availability" },
  { id: "in_stock", label: "In Stock" },
  { id: "low_stock", label: "Low Stock (Limited)" },
  { id: "made_to_order", label: "Made to Order" },
  { id: "out_of_stock", label: "Out of Stock" },
];

const MATERIAL_OPTIONS = [
  { id: "all", label: "All Materials" },
  { id: "PLA", label: "PLA / PLA+ (Recyclable)" },
  { id: "PETG", label: "PETG (High Impact)" },
  { id: "Resin", label: "Resin (Fine Detail)" },
];

export function ProductFilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}: ProductFiltersProps) {
  return (
    <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0" aria-label="Filters">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[var(--foreground)]" />
          <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold bg-[var(--primary)] text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-medium text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Availability Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
          Availability
        </h3>
        <div className="flex flex-col gap-2">
          {AVAILABILITY_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2.5 text-sm text-[var(--foreground)] hover:text-[var(--primary)] cursor-pointer select-none"
            >
              <input
                type="radio"
                name="availability"
                checked={filters.availability === option.id}
                onChange={() => onFilterChange("availability", option.id)}
                className="h-4 w-4 rounded-full text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border)]">
        <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
          Price Range (INR)
        </h3>
        <div className="flex flex-col gap-2">
          {PRICE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2.5 text-sm text-[var(--foreground)] hover:text-[var(--primary)] cursor-pointer select-none"
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === option.id}
                onChange={() => onFilterChange("priceRange", option.id)}
                className="h-4 w-4 rounded-full text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Material Filter */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border)]">
        <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
          Material & Technology
        </h3>
        <div className="flex flex-col gap-2">
          {MATERIAL_OPTIONS.map((mat) => (
            <label
              key={mat.id}
              className="flex items-center gap-2.5 text-sm text-[var(--foreground)] hover:text-[var(--primary)] cursor-pointer select-none"
            >
              <input
                type="radio"
                name="material"
                checked={filters.material === mat.id}
                onChange={() => onFilterChange("material", mat.id)}
                className="h-4 w-4 rounded-full text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)]"
              />
              <span>{mat.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

interface MobileFilterDrawerProps extends ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
        className="relative z-10 w-full max-w-xs bg-white h-full shadow-xl flex flex-col p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[var(--foreground)]" />
            <span className="font-bold text-base text-[var(--foreground)]">Filters</span>
            {activeFilterCount > 0 && (
              <span className="h-5 w-5 rounded-full text-xs font-bold bg-[var(--primary)] text-white flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 py-6 flex-1">
          {/* Availability */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Availability
            </span>
            {AVAILABILITY_OPTIONS.map((option) => (
              <label key={option.id} className="flex items-center gap-2.5 text-sm cursor-pointer py-1">
                <input
                  type="radio"
                  name="mob-availability"
                  checked={filters.availability === option.id}
                  onChange={() => onFilterChange("availability", option.id)}
                  className="h-4 w-4 text-[var(--primary)]"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--border)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Price Range
            </span>
            {PRICE_OPTIONS.map((option) => (
              <label key={option.id} className="flex items-center gap-2.5 text-sm cursor-pointer py-1">
                <input
                  type="radio"
                  name="mob-priceRange"
                  checked={filters.priceRange === option.id}
                  onChange={() => onFilterChange("priceRange", option.id)}
                  className="h-4 w-4 text-[var(--primary)]"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {/* Material */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--border)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Material
            </span>
            {MATERIAL_OPTIONS.map((mat) => (
              <label key={mat.id} className="flex items-center gap-2.5 text-sm cursor-pointer py-1">
                <input
                  type="radio"
                  name="mob-material"
                  checked={filters.material === mat.id}
                  onChange={() => onFilterChange("material", mat.id)}
                  className="h-4 w-4 text-[var(--primary)]"
                />
                <span>{mat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--border)] flex items-center gap-3">
          <button
            type="button"
            onClick={onClearFilters}
            className="flex-1 py-3 text-sm font-semibold rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-sm font-semibold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
