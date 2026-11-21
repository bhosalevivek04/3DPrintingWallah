"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart/cart-context";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Info,
} from "lucide-react";

export function CartView() {
  const { items, totalCount, subtotal, isLoaded, removeItem, updateQuantity, clearCart } = useCart();

  // Show a lightweight placeholder before client hydration
  if (!isLoaded) {
    return (
      <div className="py-16 sm:py-24 max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="h-8 w-48 bg-stone-200/70 rounded-lg animate-pulse mb-8" />
        <div className="h-64 w-full bg-stone-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="pt-4 pb-12 sm:pb-16 max-w-[1440px] mx-auto px-4 lg:px-8">
      {/* Global Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: "Cart" }]} className="mb-6" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pb-6 mb-8 border-b border-[var(--border)] gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Your Order Cart
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Review your 3D-printed selections before submitting an order request.
          </p>
        </div>
        <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-stone-100 text-[var(--foreground)] border border-[var(--border)] w-max">
          {totalCount} {totalCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-stone-50/60 p-8 sm:p-16 text-center max-w-2xl mx-auto flex flex-col items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-blue-50 border border-blue-200/70 flex items-center justify-center text-[var(--primary)] shadow-2xs">
            <ShoppingBag className="h-8 w-8 stroke-[1.6]" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Your cart is empty
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed">
              Explore our catalogue of handcrafted geometric planters, miniatures, desk trays, and
              custom collectibles ready for 3D printing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:bg-[var(--primary-hover)] transition-all shadow-sm active:scale-97 cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/custom/3d-printing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[var(--foreground)] border border-[var(--border)] text-sm font-bold hover:bg-stone-100/70 transition-all active:scale-97 cursor-pointer"
            >
              <span>Upload Custom 3D Model</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Cart Content Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs divide-y divide-[var(--border)]/70">
              {items.map((item) => {
                const itemSubtotal = (item.unitPrice || 0) * item.quantity;

                return (
                  <div
                    key={`${item.productId}-${item.selectedColor || "default"}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-stone-50/40"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="relative h-20 w-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-[var(--border)]/60"
                      >
                        <Image
                          src={item.image || "/images/hero-workshop.webp"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>

                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
                          {item.category}
                        </span>
                        <Link
                          href={`/shop/${item.slug}`}
                          className="text-base font-bold text-[var(--foreground)] tracking-tight hover:text-[var(--primary)] transition-colors truncate"
                        >
                          {item.name}
                        </Link>
                        {item.selectedColor && (
                          <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
                            <span>Color / Finish:</span>
                            <span className="font-semibold text-[var(--foreground)]">
                              {item.selectedColor}
                            </span>
                          </div>
                        )}
                        <span className="text-xs font-semibold text-[var(--foreground)] sm:hidden">
                          {item.priceDisplay} each
                        </span>
                      </div>
                    </div>

                    {/* Middle: Quantity Selector */}
                    <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-5">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center rounded-lg border border-[var(--border)] bg-white h-9 shadow-2xs">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.selectedColor)
                            }
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="px-2.5 h-full text-sm font-bold text-[var(--foreground)] hover:bg-stone-100 rounded-l-lg transition-colors cursor-pointer active:scale-95"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold select-none text-[var(--foreground)]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.selectedColor)
                            }
                            disabled={item.quantity >= item.maxAllowedQuantity}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="px-2.5 h-full text-sm font-bold text-[var(--foreground)] hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-r-lg transition-colors cursor-pointer active:scale-95"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.selectedColor)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer active:scale-90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Right: Item Total */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-sm font-extrabold text-[var(--foreground)] block">
                          ₹{itemSubtotal.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[11px] text-[var(--muted-foreground)] hidden sm:block">
                          {item.priceDisplay} × {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Continue Shopping</span>
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Sidebar Summary & Enquiry Callout (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xs flex flex-col gap-5 sticky top-20">
              <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight pb-3 border-b border-[var(--border)]">
                Order Enquiry Summary
              </h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                  <span>Selected Items ({totalCount})</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-1">
                    <span>Shipping Estimate</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Calculated on Request
                  </span>
                </div>

                <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                  <span>Taxes (GST)</span>
                  <span className="text-xs font-medium text-[var(--foreground)]">Inclusive</span>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[var(--foreground)]">
                    Estimated Subtotal
                  </span>
                  <span className="text-xl font-extrabold text-[var(--foreground)]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Business Model Callout: NO online payment required */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 flex items-start gap-2.5 text-xs text-blue-950">
                <Info className="h-4 w-4 text-[var(--primary)] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <strong className="font-bold text-blue-900">
                    No Payment Charged at Checkout
                  </strong>
                  <p className="text-[11.5px] leading-relaxed text-blue-800">
                    This is an enquiry-based order request. Our workshop team will review print
                    parameters and stock, then contact you directly to confirm delivery and arrange
                    payment separately.
                  </p>
                </div>
              </div>

              {/* Proceed CTA */}
              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:bg-[var(--primary-hover)] transition-all shadow-sm active:scale-98 cursor-pointer"
              >
                <span>Proceed to Order Request</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Workshop Assurances */}
              <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-2.5 text-xs text-[var(--muted-foreground)]">
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
                  <span>Pan-India secure shipping with protective packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Layer-inspected quality before dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
                  <span>Prompt resolution for damaged transit prints</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
