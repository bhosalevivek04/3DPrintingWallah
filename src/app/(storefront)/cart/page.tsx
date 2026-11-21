import React from "react";
import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart — 3D Printing Wallah",
  description:
    "Review your 3D-printed products and submit an order request. No online payment required during checkout.",
};

export default function CartPage() {
  return <CartView />;
}
