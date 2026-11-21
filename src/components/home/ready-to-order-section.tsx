import React from "react";
import Link from "next/link";
import Image from "next/image";

const readyProducts = [
  {
    id: "ribbed-planter",
    image: "/images/product-ribbed-planter.webp",
    alt: "Ribbed planter concept 3D printed in blue",
    categoryLabel: "For your space",
    badge: "Sample product",
    title: "Ribbed planter",
    description: "A sculptural home for a little greenery.",
    href: "/shop",
  },
  {
    id: "modular-desk-tray",
    image: "/images/product-desk-tray.webp",
    alt: "Modular desk tray in natural beige finish",
    categoryLabel: "For your desk",
    badge: "Sample product",
    title: "Modular desk tray",
    description: "A small place for the things you reach for.",
    href: "/shop",
  },
  {
    id: "everyday-cable-clips",
    image: "/images/product-cable-clips.webp",
    alt: "Everyday cable clips for tidy wire management",
    categoryLabel: "Little helpers",
    badge: "Sample product",
    title: "Everyday cable clips",
    description: "Simple shapes to keep cables together.",
    href: "/shop",
  },
];

export function ReadyToOrderSection() {
  return (
    <section className="w-full bg-white py-20 border-y border-[var(--border)]" aria-labelledby="ready-heading">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex flex-col gap-10">
        {/* Section Introduction (Figma 0:1796) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-2">
            <p className="text-[14px] font-semibold text-[var(--primary)]">
              Find your everyday favourite
            </p>
            <h2 id="ready-heading" className="text-[32px] font-semibold text-[var(--foreground)] tracking-tight">
              Ready-to-order products
            </h2>
            <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
              A sample catalogue preview of useful, thoughtfully shaped objects. These concepts illustrate what we could make, not confirmed stock.
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-white px-5 py-2.5 text-[14px] font-semibold text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-colors min-h-[44px]"
          >
            Explore Products
          </Link>
        </div>

        {/* Product Collection Cards (Figma 0:1801) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {readyProducts.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-xs hover:border-[var(--primary)] transition-all"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] w-full bg-[#F7F6F2] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Product Content */}
              <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[var(--muted-foreground)]">
                      {p.categoryLabel}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[#F7F6F2] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--muted-foreground)]">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="text-[20px] font-semibold text-[var(--foreground)] tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <Link
                  href={p.href}
                  className="mt-2 inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-white py-2.5 px-4 text-[14px] font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  Explore concept
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Catalogue Note (Figma 0:1808) */}
        <p className="text-[14px] text-[var(--muted-foreground)]">
          Sample products only. Final designs and availability are to be confirmed.
        </p>
      </div>
    </section>
  );
}
