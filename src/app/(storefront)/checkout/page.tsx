import React from "react";
import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Submit Order Request — 3D Printing Wallah",
  description:
    "Review your order and submit an enquiry-based 3D printing order request. No online payment required during checkout.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
