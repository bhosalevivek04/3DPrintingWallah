"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Layers, Palette, Sparkles, Box, Wrench, Gamepad2, Gift } from "lucide-react";
import { ProductCategory } from "@/types/product";

interface CategoryCardItem {
  category: ProductCategory;
  title: string;
  count: string;
  description: string;
  image: string;
  iconName: string;
}

const CATEGORIES_DATA: CategoryCardItem[] = [
  {
    category: "Collectibles",
    title: "Collectibles & Figurines",
    count: "12+ models",
    description: "Detailed hand-finished display sculptures and anime models.",
    image: "/images/product-samurai-bust.webp",
    iconName: "Sparkles",
  },
  {
    category: "Planters",
    title: "Architectural Planters",
    count: "8+ designs",
    description: "Fluted geometric desk planters with integrated drainage.",
    image: "/images/product-ribbed-planter.webp",
    iconName: "Layers",
  },
  {
    category: "Desk Accessories",
    title: "Desk Accessories",
    count: "15+ designs",
    description: "Modular organizers, cable docks, and chamfered trays.",
    image: "/images/product-desk-tray.webp",
    iconName: "Box",
  },
  {
    category: "Gaming",
    title: "Gaming & Headphone Stands",
    count: "6+ accessories",
    description: "Sculpted controller docks and ergonomic battle-station accessories.",
    image: "/images/product-headphone-stand.webp",
    iconName: "Gamepad2",
  },
  {
    category: "Miniatures",
    title: "High-Detail Miniatures",
    count: "10+ miniatures",
    description: "High-precision resin miniatures for tabletop gaming and painting.",
    image: "/images/hero-workshop.webp",
    iconName: "Palette",
  },
  {
    category: "Custom Creations",
    title: "Custom 3D Printing",
    count: "Bespoke",
    description: "Turn your custom STL or CAD model into a physical prototype.",
    image: "/images/concept-custom.webp",
    iconName: "Wrench",
  },
];

export function CategoryShowcaseCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 sm:py-16 bg-stone-50/70 border-y border-[var(--border)]/70 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-1">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Explore 3D Creations by Category
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 max-w-xl">
              From precision desk essentials to high-detail figurines, discover objects designed for everyday enjoyment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[var(--primary)] hover:underline mr-2"
            >
              <span>Explore all categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className="h-9 w-9 rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-2xs active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className="h-9 w-9 rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-2xs active:scale-90 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Carousel */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.category}
              href={`/shop?category=${encodeURIComponent(cat.category)}`}
              className="group relative w-[260px] sm:w-[290px] shrink-0 rounded-2xl bg-white border border-[var(--border)]/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col active:scale-98"
            >
              <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="290px"
                />
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                  {cat.count}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)]/70 flex items-center justify-between text-xs font-bold text-[var(--primary)]">
                  <span>Browse Category</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
