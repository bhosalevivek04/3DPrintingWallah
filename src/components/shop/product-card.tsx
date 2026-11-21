"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { computeStockAvailability } from "@/lib/inventory/inventory-service";
import { useCart } from "@/lib/cart/cart-context";
import { Heart, Star, ArrowUpRight, Plus, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();
  const stockInfo = computeStockAvailability(product);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!stockInfo.isPurchasable) return;

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        image: product.images[0] || "/images/hero-workshop.webp",
        unitPrice: product.price || 0,
        priceDisplay: product.priceDisplay,
        availability: product.availability,
        maxAllowedQuantity: stockInfo.maxPurchasableQuantity,
        selectedColor: product.colors?.[0] || "Standard Workshop Finish",
        material: product.material,
      },
      1
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const discountPercent =
    product.price && product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <article className="group relative flex flex-col rounded-2xl border border-[var(--border)]/80 bg-white overflow-hidden apple-card">
      {/* Image Container with Link */}
      <Link
        href={product.href}
        className="relative aspect-[4/3] w-full bg-stone-100/70 overflow-hidden block"
        aria-label={`View ${product.name} details`}
      >
        <Image
          src={product.images[0] || "/images/hero-workshop.webp"}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay with Apple-style Restrained Pills */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs ${
              stockInfo.badgeVariant === "in_stock"
                ? "bg-[var(--color-success)] text-white"
                : stockInfo.badgeVariant === "low_stock"
                ? "bg-[var(--color-warning)] text-white"
                : stockInfo.badgeVariant === "out_of_stock"
                ? "bg-[var(--color-danger)] text-white"
                : "bg-[var(--color-brand)] text-white"
            }`}
          >
            {stockInfo.badgeLabel}
          </span>
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--color-warning)] text-white w-max shadow-2xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button with Tactile Active State */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all z-10 shadow-xs cursor-pointer active:scale-90 ${
            isWishlisted
              ? "bg-[var(--color-danger-bg)] text-[var(--color-danger)] border border-[var(--color-danger-border)]"
              : "bg-white/95 text-stone-600 hover:text-[var(--color-danger)] hover:bg-white"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-200 ${isWishlisted ? "fill-[var(--color-danger)] text-[var(--color-danger)] scale-110" : ""}`}
          />
        </button>
      </Link>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--primary)] uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 font-semibold text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-stone-400 font-normal">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Product Name */}
          <Link href={product.href} className="group-hover:text-[var(--primary)] transition-colors">
            <h3 className="text-base font-bold text-[var(--foreground)] tracking-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
            {product.shortDescription || product.tagline}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-[var(--border)]/70 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-[var(--foreground)] tracking-tight">
                {product.priceDisplay}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[var(--muted-foreground)] line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {product.material && (
              <span className="text-[11px] text-[var(--muted-foreground)] truncate max-w-[130px]">
                {product.material}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {stockInfo.isPurchasable && (
              <button
                type="button"
                onClick={handleQuickAdd}
                aria-label={`Add ${product.name} to cart`}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs ${
                  justAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-[var(--brand-inverse)] text-white hover:bg-black"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Cart</span>
                  </>
                )}
              </button>
            )}

            <Link
              href={product.href}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <span>Details</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
