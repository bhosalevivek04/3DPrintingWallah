"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/lib/cart/cart-context";
import {
  computeStockAvailability,
  validatePurchaseQuantity,
} from "@/lib/inventory/inventory-service";
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Bell,
  Check,
} from "lucide-react";

interface ProductPurchaseCardProps {
  product: Product;
}

export function ProductPurchaseCard({ product }: ProductPurchaseCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const stockInfo = computeStockAvailability(product);

  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || "Standard Workshop Finish"
  );
  const [quantity, setQuantity] = useState(stockInfo.isPurchasable ? 1 : 0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Notify Me state for out of stock products
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  const discountPercent =
    product.price && product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) return;
    setValidationError(null);
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncreaseQuantity = () => {
    if (!stockInfo.isPurchasable) return;
    const nextQty = quantity + 1;
    const validation = validatePurchaseQuantity(product, nextQty);
    if (!validation.valid) {
      setValidationError(validation.error || "Maximum available quantity reached.");
      return;
    }
    setValidationError(null);
    setQuantity(nextQty);
  };

  const handleAddToCart = () => {
    const validation = validatePurchaseQuantity(product, quantity);
    if (!validation.valid) {
      setValidationError(validation.error || "Unable to add product to cart.");
      return;
    }
    setValidationError(null);

    const result = addItem(
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
        selectedColor,
        material: product.material,
      },
      quantity
    );

    if (result.success) {
      setCartFeedback(
        `Added ${quantity}x "${product.name}" (${selectedColor}) to your cart.`
      );
      setTimeout(() => setCartFeedback(null), 6000);
    } else {
      setValidationError(result.message);
    }
  };

  const handleBuyNow = () => {
    const validation = validatePurchaseQuantity(product, quantity);
    if (!validation.valid) {
      setValidationError(validation.error || "Unable to proceed to checkout.");
      return;
    }
    setValidationError(null);

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
        selectedColor,
        material: product.material,
      },
      quantity
    );

    router.push("/checkout");
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes("@")) {
      setNotifyError("Please enter a valid email address.");
      return;
    }
    setNotifyError(null);
    setNotifySuccess(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tag */}
      <div className="flex items-center gap-2">
        <Link
          href={`/shop?category=${encodeURIComponent(product.category)}`}
          className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] hover:underline"
        >
          {product.categoryLabel || product.category}
        </Link>
      </div>

      {/* Title & Availability Badge */}
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              stockInfo.badgeVariant === "in_stock"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : stockInfo.badgeVariant === "low_stock"
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : stockInfo.badgeVariant === "out_of_stock"
                ? "bg-rose-100 text-rose-800 border border-rose-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {stockInfo.badgeLabel}
          </span>
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-[var(--foreground)] border border-[var(--border)]">
              {product.badge}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          {product.name}
        </h1>

        {/* Rating Row */}
        {product.rating && (
          <div className="flex items-center gap-3 mt-2 text-sm">
            <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
            {product.reviewCount && (
              <span className="text-xs text-[var(--muted-foreground)]">
                {product.reviewCount} customer ratings & reviews
              </span>
            )}
          </div>
        )}
      </div>

      {/* Price Block */}
      <div className="p-4 rounded-xl bg-stone-50 border border-[var(--border)] flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              {product.priceDisplay}
            </span>
            {product.originalPrice && (
              <span className="text-base text-[var(--muted-foreground)] line-through">
                ₹{product.originalPrice}
              </span>
            )}
            {discountPercent && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Inclusive of all taxes • Free shipping on orders over ₹999
          </p>
        </div>

        {product.productionTime && (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 hidden sm:inline">
            {product.productionTime}
          </span>
        )}
      </div>

      {/* Dedicated Stock Availability Section */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          stockInfo.status === "in_stock"
            ? "bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success)]"
            : stockInfo.status === "low_stock"
            ? "bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] text-[var(--color-warning)]"
            : stockInfo.status === "out_of_stock"
            ? "bg-[var(--color-danger-bg)] border-[var(--color-danger-border)] text-[var(--color-danger)]"
            : "bg-[var(--color-info-bg)] border-[var(--color-info-border)] text-[var(--color-info)]"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ${
                stockInfo.status === "in_stock"
                  ? "bg-[var(--color-success)]"
                  : stockInfo.status === "low_stock"
                  ? "bg-[var(--color-warning)] animate-pulse"
                  : stockInfo.status === "out_of_stock"
                  ? "bg-[var(--color-danger)]"
                  : "bg-[var(--color-info)]"
              }`}
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[var(--color-text-primary)]">
                {stockInfo.detailLabel}
              </span>
              {stockInfo.detailSubtext && (
                <span className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {stockInfo.detailSubtext}
                </span>
              )}
            </div>
          </div>

          {stockInfo.showLowStockWarning && stockInfo.remainingCount !== null && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)] shrink-0">
              Low Stock
            </span>
          )}
        </div>
      </div>

      {/* Short Summary */}
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
        {product.description}
      </p>

      {/* Colors Selection (if applicable) */}
      {product.colors && product.colors.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
            Color / Finish: <span className="font-normal text-[var(--primary)]">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedColor === c
                    ? "bg-[var(--brand-inverse)] text-white ring-2 ring-[var(--primary)] shadow-xs"
                    : "bg-white text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--accent)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Wishlist Selector (only when purchasable) */}
      {stockInfo.isPurchasable ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Quantity
              </span>
              <div className="inline-flex items-center rounded-xl border border-[var(--border)] bg-white h-11">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="px-3.5 h-full text-base font-bold text-[var(--foreground)] hover:bg-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed rounded-l-xl transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-[var(--foreground)] select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= stockInfo.maxPurchasableQuantity}
                  aria-label="Increase quantity"
                  className="px-3.5 h-full text-base font-bold text-[var(--foreground)] hover:bg-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed rounded-r-xl transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Save for later
              </span>
              <button
                type="button"
                onClick={() => setIsWishlisted((w) => !w)}
                className={`inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border transition-all text-sm font-semibold cursor-pointer ${
                  isWishlisted
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-white text-[var(--foreground)] border-[var(--border)] hover:bg-stone-50"
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`} />
                <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
              </button>
            </div>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{validationError}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
            Save for later
          </span>
          <button
            type="button"
            onClick={() => setIsWishlisted((w) => !w)}
            className={`inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border transition-all text-sm font-semibold cursor-pointer ${
              isWishlisted
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-white text-[var(--foreground)] border-[var(--border)] hover:bg-stone-50"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`} />
            <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
          </button>
        </div>
      )}

      {/* Cart Feedback Notification */}
      {cartFeedback && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs sm:text-sm text-emerald-950 animate-in fade-in shadow-xs"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex flex-col gap-1">
              <strong className="font-bold text-emerald-900">{cartFeedback}</strong>
              <span className="text-xs text-emerald-700">
                Enquiry-based workflow: No online payment collected now. Our team reviews your order and arranges payment separately.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/cart"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100/70 transition-colors shadow-2xs"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}

      {/* Main Purchase CTA Buttons or Out-of-Stock Notification */}
      {stockInfo.isPurchasable ? (
        <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:bg-[var(--primary-hover)] transition-colors shadow-sm cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[var(--brand-inverse)] text-white font-bold text-sm hover:bg-black transition-colors shadow-sm cursor-pointer"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Buy Now</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pt-2">
          {/* Disabled Purchase Action */}
          <button
            type="button"
            disabled
            className="w-full h-12 rounded-xl bg-stone-100 text-stone-400 font-bold text-sm cursor-not-allowed border border-stone-200 select-none"
          >
            Currently Unavailable
          </button>

          {/* Interactive Notify Me Form */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-stone-50/70 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              <Bell className="h-4 w-4 text-[var(--primary)]" />
              <span>Notify Me When Available</span>
            </div>

            {notifySuccess ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Thank you! We will notify you at <strong className="font-bold">{notifyEmail}</strong> as soon as this product is back in stock.
                </span>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors cursor-pointer shrink-0"
                >
                  Notify Me
                </button>
              </form>
            )}

            {notifyError && (
              <p className="text-xs text-rose-600 font-medium">{notifyError}</p>
            )}

            <p className="text-[11px] text-[var(--muted-foreground)]">
              We respect your privacy and will only send an alert when new units are printed.
            </p>
          </div>
        </div>
      )}

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Truck className="h-4 w-4 text-[var(--primary)] shrink-0" />
          <span>All India Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Layer Inspected</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <RotateCcw className="h-4 w-4 text-[var(--primary)] shrink-0" />
          <span>Damaged Print Replacement</span>
        </div>
      </div>
    </div>
  );
}
