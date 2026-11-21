import React from "react";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { CartProvider } from "@/lib/cart/cart-context";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <StorefrontShell>{children}</StorefrontShell>
    </CartProvider>
  );
}
