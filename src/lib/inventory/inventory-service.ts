/**
 * Centralized Product Stock & Inventory Management Service
 * Provides single source of truth for stock status calculation, purchase validation,
 * and contracts for atomic server-side inventory reservation and admin operations.
 */

import { Product, ProductAvailability } from "@/types/product";

export type EffectiveStockStatus = "in_stock" | "low_stock" | "out_of_stock" | "made_to_order";

export interface StockAvailabilityInfo {
  status: EffectiveStockStatus;
  badgeLabel: string;
  badgeVariant: "in_stock" | "low_stock" | "out_of_stock" | "made_to_order";
  detailLabel: string;
  detailSubtext?: string;
  isPurchasable: boolean;
  maxPurchasableQuantity: number;
  showExactCount: boolean;
  remainingCount: number | null;
  showLowStockWarning: boolean;
}

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

/**
 * Computes effective stock status and UI metadata from product inventory fields.
 * Never displays misleading counts for Made to Order or non-tracked items.
 */
export function computeStockAvailability(product: Product): StockAvailabilityInfo {
  // 1. Made to order products
  if (product.availability === "made_to_order" || product.availability === ("Made to Order" as ProductAvailability)) {
    return {
      status: "made_to_order",
      badgeLabel: "Made to Order",
      badgeVariant: "made_to_order",
      detailLabel: "Made to Order",
      detailSubtext: product.productionTime
        ? `Production time: ${product.productionTime}`
        : "Fabricated upon order confirmation",
      isPurchasable: true,
      maxPurchasableQuantity: 10,
      showExactCount: false,
      remainingCount: null,
      showLowStockWarning: false,
    };
  }

  // 2. Inventory tracking disabled
  if (!product.trackInventory) {
    const isOutOfStock =
      product.availability === "out_of_stock" ||
      product.availability === ("Out of Stock" as ProductAvailability);

    if (isOutOfStock) {
      return {
        status: "out_of_stock",
        badgeLabel: "Out of Stock",
        badgeVariant: "out_of_stock",
        detailLabel: "Currently Out of Stock",
        detailSubtext: "We are preparing our next print batch.",
        isPurchasable: false,
        maxPurchasableQuantity: 0,
        showExactCount: false,
        remainingCount: 0,
        showLowStockWarning: false,
      };
    }

    return {
      status: "in_stock",
      badgeLabel: "In Stock",
      badgeVariant: "in_stock",
      detailLabel: "In Stock",
      detailSubtext: product.productionTime || "Ready to dispatch in 24–48 hours",
      isPurchasable: true,
      maxPurchasableQuantity: 10,
      showExactCount: false,
      remainingCount: null,
      showLowStockWarning: false,
    };
  }

  // 3. Inventory tracking enabled
  const threshold = product.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
  const stock = typeof product.stockQuantity === "number" ? Math.max(0, product.stockQuantity) : 0;

  // Zero stock
  if (stock === 0) {
    if (product.allowBackorders) {
      return {
        status: "in_stock",
        badgeLabel: "Backorder",
        badgeVariant: "low_stock",
        detailLabel: "Available on Backorder",
        detailSubtext: "Units will print and dispatch with next workshop batch",
        isPurchasable: true,
        maxPurchasableQuantity: 5,
        showExactCount: false,
        remainingCount: 0,
        showLowStockWarning: true,
      };
    }

    return {
      status: "out_of_stock",
      badgeLabel: "Out of Stock",
      badgeVariant: "out_of_stock",
      detailLabel: "Currently Out of Stock",
      detailSubtext: "This product is temporarily out of stock.",
      isPurchasable: false,
      maxPurchasableQuantity: 0,
      showExactCount: false,
      remainingCount: 0,
      showLowStockWarning: false,
    };
  }

  // Low stock warning (stock between 1 and threshold)
  if (stock <= threshold) {
    return {
      status: "low_stock",
      badgeLabel: `Only ${stock} left!`,
      badgeVariant: "low_stock",
      detailLabel: `Hurry! Only ${stock} ${stock === 1 ? "unit" : "units"} left in stock`,
      detailSubtext: "High order demand — order soon before batch sells out",
      isPurchasable: true,
      maxPurchasableQuantity: stock,
      showExactCount: true,
      remainingCount: stock,
      showLowStockWarning: true,
    };
  }

  // Normal In Stock (above threshold, e.g. 25 units)
  return {
    status: "in_stock",
    badgeLabel: "In Stock",
    badgeVariant: "in_stock",
    detailLabel: `Available: ${stock} units`,
    detailSubtext: "Ready to dispatch from our workshop",
    isPurchasable: true,
    maxPurchasableQuantity: Math.min(stock, 10), // Limit single order to 10 for fair distribution
    showExactCount: false,
    remainingCount: stock,
    showLowStockWarning: false,
  };
}

/**
 * Validates requested quantity against product stock constraints.
 */
export function validatePurchaseQuantity(
  product: Product,
  requestedQuantity: number
): { valid: boolean; error?: string; maxAllowed: number } {
  const stockInfo = computeStockAvailability(product);

  if (!stockInfo.isPurchasable) {
    return {
      valid: false,
      error: `"${product.name}" is currently out of stock and cannot be purchased.`,
      maxAllowed: 0,
    };
  }

  if (requestedQuantity < 1) {
    return {
      valid: false,
      error: "Quantity must be at least 1.",
      maxAllowed: stockInfo.maxPurchasableQuantity,
    };
  }

  if (requestedQuantity > stockInfo.maxPurchasableQuantity) {
    const errorMsg =
      stockInfo.status === "low_stock"
        ? `Only ${stockInfo.remainingCount} ${
            stockInfo.remainingCount === 1 ? "unit is" : "units are"
          } available in stock.`
        : `Maximum allowed purchase quantity is ${stockInfo.maxPurchasableQuantity} units.`;

    return {
      valid: false,
      error: errorMsg,
      maxAllowed: stockInfo.maxPurchasableQuantity,
    };
  }

  return {
    valid: true,
    maxAllowed: stockInfo.maxPurchasableQuantity,
  };
}

/**
 * Architectural specification for server-side atomic inventory reservations:
 * In production with PostgreSQL / MySQL, inventory reservation uses conditional execution:
 *
 *   UPDATE products
 *   SET stock_quantity = stock_quantity - :qty,
 *       reserved_quantity = reserved_quantity + :qty
 *   WHERE id = :productId
 *     AND stock_quantity >= :qty
 *     AND track_inventory = TRUE;
 *
 * Failed orders or expired reservation TTLs execute:
 *
 *   UPDATE products
 *   SET stock_quantity = stock_quantity + :qty,
 *       reserved_quantity = reserved_quantity - :qty
 *   WHERE id = :productId;
 */
export interface InventoryReservationRequest {
  productId: string;
  quantity: number;
  reservationId: string;
  expiresAt: number; // TTL (e.g. 15 minutes)
}

/**
 * Admin Inventory Management Schema for future dashboard operations.
 */
export interface AdminProductStockUpdate {
  productId: string;
  stockQuantity: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  allowBackorders?: boolean;
  availability?: EffectiveStockStatus;
}

export function filterLowStockProducts(allProducts: Product[]): Product[] {
  return allProducts.filter((p) => {
    const info = computeStockAvailability(p);
    return info.status === "low_stock";
  });
}

export function filterOutOfStockProducts(allProducts: Product[]): Product[] {
  return allProducts.filter((p) => {
    const info = computeStockAvailability(p);
    return info.status === "out_of_stock";
  });
}
