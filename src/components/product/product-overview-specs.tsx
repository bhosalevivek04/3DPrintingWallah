import React from "react";
import { Product } from "@/types/product";
import { Check, Layers, Sparkles, Box } from "lucide-react";

interface ProductOverviewSpecsProps {
  product: Product;
}

export function ProductOverviewSpecs({ product }: ProductOverviewSpecsProps) {
  return (
    <div className="flex flex-col gap-10 pt-10 border-t border-[var(--border)]">
      {/* 1. Product Features */}
      {product.features && product.features.length > 0 && (
        <section aria-labelledby="features-heading">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            <h2 id="features-heading" className="text-xl font-bold text-[var(--foreground)] tracking-tight">
              Key Features & Craftsmanship
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[var(--border)] shadow-xs"
              >
                <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-[var(--foreground)] leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Detailed Technical Specifications */}
      <section aria-labelledby="specs-heading">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-5 w-5 text-[var(--primary)]" />
          <h2 id="specs-heading" className="text-xl font-bold text-[var(--foreground)] tracking-tight">
            Technical Specifications
          </h2>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-xs">
          <div className="divide-y divide-[var(--border)]">
            {/* Standard Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 bg-stone-50/50">
              <span className="text-xs font-bold uppercase text-[var(--muted-foreground)]">
                Printing Technology
              </span>
              <span className="sm:col-span-2 text-sm font-semibold text-[var(--foreground)]">
                {product.printingTechnology || "High-precision FDM 3D Printing"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
              <span className="text-xs font-bold uppercase text-[var(--muted-foreground)]">
                Primary Material
              </span>
              <span className="sm:col-span-2 text-sm text-[var(--foreground)]">
                {product.material || "Biodegradable PLA+"}
              </span>
            </div>

            {product.dimensions && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 bg-stone-50/50">
                <span className="text-xs font-bold uppercase text-[var(--muted-foreground)]">
                  Dimensions
                </span>
                <span className="sm:col-span-2 text-sm text-[var(--foreground)]">
                  {product.dimensions}
                </span>
              </div>
            )}

            {product.weight && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                <span className="text-xs font-bold uppercase text-[var(--muted-foreground)]">
                  Weight
                </span>
                <span className="sm:col-span-2 text-sm text-[var(--foreground)]">
                  {product.weight}
                </span>
              </div>
            )}

            {product.finish && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 bg-stone-50/50">
                <span className="text-xs font-bold uppercase text-[var(--muted-foreground)]">
                  Surface Finish
                </span>
                <span className="sm:col-span-2 text-sm text-[var(--foreground)]">
                  {product.finish}
                </span>
              </div>
            )}

            {/* Custom fields from specifications array */}
            {product.specifications?.map((spec, index) => (
              <div
                key={spec.label}
                className={`grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 ${
                  index % 2 === 1 ? "bg-stone-50/50" : ""
                }`}
              >
                <span className="text-xs font-bold uppercase text-[var(--muted-foreground)]">
                  {spec.label}
                </span>
                <span className="sm:col-span-2 text-sm text-[var(--foreground)]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Ordering & Care Details */}
      <section aria-labelledby="ordering-heading">
        <div className="flex items-center gap-2 mb-4">
          <Box className="h-5 w-5 text-[var(--primary)]" />
          <h2 id="ordering-heading" className="text-xl font-bold text-[var(--foreground)] tracking-tight">
            Packaging & Care Guide
          </h2>
        </div>
        <div className="p-6 rounded-2xl bg-[var(--accent)] border border-[var(--border)] text-sm text-[var(--foreground)] leading-relaxed flex flex-col gap-3">
          <p>
            • <strong>Inspected Quality:</strong> Each 3D model is individual layer inspected for structural cohesion, surface smoothness, and dimensional accuracy prior to dispatch.
          </p>
          <p>
            • <strong>Care Instructions:</strong> Clean gently with a soft dry or slightly damp cloth. Avoid harsh chemicals or sustained exposure to temperatures exceeding 55°C (130°F) to prevent thermal softening of standard PLA.
          </p>
          <p>
            • <strong>Eco-Friendly Packaging:</strong> Shipped in custom corrugated cardboard boxes cushioned with biodegradable honeycomb paper wrap.
          </p>
        </div>
      </section>
    </div>
  );
}
