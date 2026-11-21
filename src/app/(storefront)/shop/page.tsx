import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { readyToOrderProducts, personalisedProducts } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — 3D Printed Products",
  description:
    "Browse ready-to-order and personalised 3D printed products from 3D Printing Wallah.",
};

const allProducts = [...readyToOrderProducts, ...personalisedProducts];

export default function ShopPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Shop"
          title="All products"
          description="Sample catalogue. These concepts illustrate what we can make. Availability to be confirmed."
          className="mb-10"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden hover:border-[var(--primary)] hover:shadow-sm transition-all"
            >
              <div
                className={`relative w-full aspect-[4/3] ${product.imageColor} flex items-center justify-center`}
              >
                <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center">
                  <span className="text-3xl" aria-hidden="true">📦</span>
                </div>
                {product.badge && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="sample">{product.badge}</Badge>
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 p-5 gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">
                    {product.tagline}
                  </p>
                  <h3 className="text-base font-bold text-[var(--foreground)]">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-auto">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {product.priceDisplay}
                  </span>
                  <Link
                    href={product.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded py-1 transition-colors"
                  >
                    View
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
