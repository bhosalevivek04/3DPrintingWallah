"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { CartItem, CartContextValue, AddToCartOptions } from "@/types/cart";

const CART_STORAGE_KEY = "newtronlabs_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

function getItemKey(productId: string, selectedColor?: string): string {
  return `${productId}:::${selectedColor || "default"}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydration-safe initial load from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read cart from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage on item change after mount
  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist cart to localStorage:", e);
    }
  }, [items, isLoaded]);

  const getItemQuantity = useCallback(
    (productId: string, selectedColor?: string): number => {
      const targetKey = getItemKey(productId, selectedColor);
      const found = items.find((i) => getItemKey(i.productId, i.selectedColor) === targetKey);
      return found ? found.quantity : 0;
    },
    [items]
  );

  const addItem = useCallback(
    (options: AddToCartOptions, quantity = 1): { success: boolean; message: string } => {
      if (quantity <= 0) {
        return { success: false, message: "Quantity must be at least 1." };
      }

      if (options.availability === "out_of_stock") {
        return { success: false, message: "This product is currently out of stock." };
      }

      const targetKey = getItemKey(options.productId, options.selectedColor);
      const existing = items.find((i) => getItemKey(i.productId, i.selectedColor) === targetKey);

      let success = true;
      let message = "";

      if (existing) {
        const newQty = existing.quantity + quantity;
        const cappedQty = Math.min(newQty, options.maxAllowedQuantity);

        if (cappedQty === existing.quantity) {
          success = false;
          message = `Maximum limit (${options.maxAllowedQuantity}) already in cart.`;
        } else {
          message = `Updated "${options.name}" quantity to ${cappedQty}.`;
        }

        setItems((prevItems) =>
          prevItems.map((item) =>
            getItemKey(item.productId, item.selectedColor) === targetKey
              ? { ...item, quantity: cappedQty, maxAllowedQuantity: options.maxAllowedQuantity }
              : item
          )
        );
      } else {
        const initialQty = Math.min(quantity, options.maxAllowedQuantity);
        message = `Added ${initialQty}x "${options.name}" to cart.`;

        const newItem: CartItem = {
          productId: options.productId,
          slug: options.slug,
          name: options.name,
          category: options.category,
          image: options.image,
          unitPrice: options.unitPrice,
          priceDisplay: options.priceDisplay,
          quantity: initialQty,
          availability: options.availability,
          maxAllowedQuantity: options.maxAllowedQuantity,
          selectedColor: options.selectedColor,
          material: options.material,
        };

        setItems((prevItems) => [...prevItems, newItem]);
      }

      return { success, message };
    },
    [items]
  );

  const removeItem = useCallback((productId: string, selectedColor?: string) => {
    const targetKey = getItemKey(productId, selectedColor);
    setItems((prev) => prev.filter((i) => getItemKey(i.productId, i.selectedColor) !== targetKey));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, selectedColor?: string) => {
      const targetKey = getItemKey(productId, selectedColor);
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => getItemKey(i.productId, i.selectedColor) !== targetKey)
        );
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
          if (getItemKey(item.productId, item.selectedColor) === targetKey) {
            const capped = Math.min(quantity, item.maxAllowedQuantity);
            return { ...item, quantity: capped };
          }
          return item;
        })
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);
  }, [items]);

  const value: CartContextValue = useMemo(
    () => ({
      items,
      totalCount,
      subtotal,
      isLoaded,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
    }),
    [
      items,
      totalCount,
      subtotal,
      isLoaded,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
