import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const readyProducts = [
  {
    id: "ribbed-planter",
    image: "/images/product-ribbed-planter.webp",
    alt: "Ribbed planter concept 3D printed in blue",
    categoryLabel: "For your space",
    badge: "Sample concept",
    title: "Ribbed planter",
    description: "A sculptural home for a little greenery.",
    href: "/shop/ribbed-planter",
  },
  {
    id: "modular-desk-tray",
    image: "/images/product-desk-tray.webp",
    alt: "Modular desk tray in natural beige finish",
    categoryLabel: "For your desk",
    badge: "Sample concept",
    title: "Modular desk tray",
    description: "A small place for the things you reach for.",
    href: "/shop/modular-desk-tray",
  },
  {
    id: "everyday-cable-clips",
    image: "/images/product-cable-clips.webp",
    alt: "Everyday cable clips for tidy wire management",
    categoryLabel: "Little helpers",
    badge: "Sample concept",
    title: "Everyday cable clips",
    description: "Simple shapes to keep cables together.",
    href: "/shop/everyday-cable-clips",
  },
];

export function ReadyToOrderSection() {
  return (
    <section className="w-full bg-white py-20 border-y border-[var(--border)]/70" aria-labelledby="ready-heading">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex flex-col gap-10">
        {/* Section Introduction */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-2">
            <p className="text-[13px] font-bold uppercase tracking-wider text-[var(--primary)]">
              Find your everyday favourite
            </p>
            <h2 id="ready-heading" className="text-[32px] sm:text-[36px] font-bold text-[var(--foreground)] tracking-tight">
              Ready-to-order products
            </h2>
            <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
              A sample catalogue preview of useful, thoughtfully shaped objects. These concepts illustrate what we could make, not confirmed stock.
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-white px-6 py-3 text-[14px] font-bold text-[var(--foreground)] hover:bg-stone-50 hover:border-stone-400 transition-all shadow-2xs active:scale-97 min-h-[44px]"
          >
            Explore All Products
          </Link>
        </div>

        {/* Product Collection Cards with Apple Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {readyProducts.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col rounded-2xl border border-[var(--border)]/80 bg-white overflow-hidden apple-card"
            >
              {/* Product Image */}
              <Link href={p.href} className="relative aspect-[4/3] w-full bg-[#F7F6F2] overflow-hidden block">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                />
              </Link>

              {/* Product Content */}
              <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--primary)]">
                      {p.categoryLabel}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[var(--border)]/80 bg-[#F7F6F2] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
                      {p.badge}
                    </span>
                  </div>
                  <Link href={p.href} className="group-hover:text-[var(--primary)] transition-colors">
                    <h3 className="text-[20px] font-bold text-[var(--foreground)] tracking-tight">
                      {p.title}
                    </h3>
                  </Link>
                  <p className="text-[15px] text-[var(--muted-foreground)] leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <Link
                  href={p.href}
                  className="mt-2 inline-flex items-center justify-between rounded-xl border border-[var(--border)] bg-stone-50/70 hover:bg-stone-100/90 py-2.5 px-4 text-[13px] font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-all active:scale-97 cursor-pointer"
                >
                  <span>Explore concept</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Catalogue Note */}
        <p className="text-[13px] text-[var(--muted-foreground)]">
          Sample products only. Final designs and availability are confirmed before dispatch.
        </p>
      </div>
    </section>
  );
}
