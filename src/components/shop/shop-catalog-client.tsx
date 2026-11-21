"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product, ProductCategory } from "@/types/product";
import { computeStockAvailability } from "@/lib/inventory/inventory-service";
import { ShopHeader } from "@/components/shop/shop-header";
import { ProductCategoryNavigation } from "@/components/shop/product-category-navigation";
import {
  ProductFilterSidebar,
  MobileFilterDrawer,
  ShopFilterState,
} from "@/components/shop/product-filters";
import { ProductSortBar, SortOption } from "@/components/shop/product-sort";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductPagination } from "@/components/shop/product-pagination";
import { getCategoryCounts } from "@/data/products";

interface ShopCatalogClientProps {
  initialProducts: Product[];
}

const ITEMS_PER_PAGE = 6;

export function ShopCatalogClient({ initialProducts }: ShopCatalogClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // Initial Category from URL param if valid
  const initialCategory: ProductCategory = useMemo(() => {
    if (!categoryParam) return "All Products";
    if (categoryParam.toLowerCase() === "personalised") return "Custom Creations";
    const found = [
      "All Products",
      "Collectibles",
      "Anime Figures",
      "Miniatures",
      "Home Decor",
      "Desk Accessories",
      "Planters",
      "Gaming",
      "Custom Creations",
    ].find((c) => c.toLowerCase() === categoryParam.toLowerCase());
    return (found as ProductCategory) || "All Products";
  }, [categoryParam]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(initialCategory);
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [filters, setFilters] = useState<ShopFilterState>({
    category: initialCategory,
    availability: "All",
    priceRange: "all",
    material: "all",
  });

  // Sync category param if URL changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
      setFilters((prev) => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const categoryCounts = useMemo(() => getCategoryCounts(), []);

  // Filter Handler
  const handleFilterChange = <K extends keyof ShopFilterState>(
    key: K,
    value: ShopFilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSelectCategory = (category: ProductCategory) => {
    setActiveCategory(category);
    handleFilterChange("category", category);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All Products");
    setFilters({
      category: "All Products",
      availability: "All",
      priceRange: "all",
      material: "all",
    });
    setSortOption("recommended");
    setCurrentPage(1);
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== "All Products") count++;
    if (filters.availability !== "All") count++;
    if (filters.priceRange !== "all") count++;
    if (filters.material !== "all") count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [activeCategory, filters, searchQuery]);

  // Filtered and Sorted Products
  const processedProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // 1. Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchTag = product.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTag) return false;
        }

        // 2. Category filter
        if (activeCategory !== "All Products" && product.category !== activeCategory) {
          return false;
        }

        // 3. Availability filter
        if (filters.availability !== "All") {
          const stockInfo = computeStockAvailability(product);
          if (stockInfo.status !== filters.availability) {
            return false;
          }
        }

        // 4. Price range filter
        if (filters.priceRange !== "all") {
          const p = product.price ?? 0;
          if (filters.priceRange === "under-300" && p >= 300) return false;
          if (filters.priceRange === "300-600" && (p < 300 || p > 600)) return false;
          if (filters.priceRange === "above-600" && p <= 600) return false;
        }

        // 5. Material filter
        if (filters.material !== "all") {
          if (!product.material || !product.material.toLowerCase().includes(filters.material.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "price-low") {
          return (a.price ?? 99999) - (b.price ?? 99999);
        }
        if (sortOption === "price-high") {
          return (b.price ?? 0) - (a.price ?? 0);
        }
        if (sortOption === "rating") {
          return (b.rating ?? 0) - (a.rating ?? 0);
        }
        if (sortOption === "newest") {
          return a.id.localeCompare(b.id);
        }
        // Recommended: natural catalogue order
        return 0;
      });
  }, [initialProducts, searchQuery, activeCategory, filters, sortOption]);

  // Pagination calculation
  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header & Search */}
      <ShopHeader
        totalCount={initialProducts.length}
        filteredCount={processedProducts.length}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        onClearSearch={() => {
          setSearchQuery("");
          setCurrentPage(1);
        }}
      />

      {/* 2. Horizontally scrollable category bar */}
      <ProductCategoryNavigation
        activeCategory={activeCategory}
        categoryCounts={categoryCounts}
        onSelectCategory={handleSelectCategory}
      />

      {/* 3. Main Workspace: Filter Sidebar + Products Area */}
      <div className="flex items-start gap-8 pt-2">
        {/* Desktop Sidebar */}
        <ProductFilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Product Listing Area */}
        <div className="flex flex-col flex-1 min-w-0">
          <ProductSortBar
            currentSort={sortOption}
            onSortChange={(s) => setSortOption(s)}
            resultCount={processedProducts.length}
            onOpenMobileFilters={() => setMobileDrawerOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          <div className="pt-6">
            <ProductGrid
              products={paginatedProducts}
              onResetFilters={handleClearFilters}
            />

            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
