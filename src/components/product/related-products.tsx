import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/shop/product-card";
import { Sparkles } from "lucide-react";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="pt-10 border-t border-[var(--border)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--primary)]" />
          <h2 id="related-heading" className="text-xl font-bold text-[var(--foreground)] tracking-tight">
            Related 3D Creations
          </h2>
        </div>
        <span className="text-xs text-[var(--muted-foreground)]">
          Complementary designs from our workshop
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
