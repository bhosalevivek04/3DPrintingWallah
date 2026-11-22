"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/shop/product-card";
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from "lucide-react";

interface ProductShowcaseCarouselProps {
  eyebrow?: string;
  title: string;
  description?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  autoPlayInterval?: number;
}

export function ProductShowcaseCarousel({
  eyebrow,
  title,
  description,
  products,
  viewAllHref = "/shop",
  viewAllLabel = "View all",
  autoPlayInterval = 5000,
}: ProductShowcaseCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check scroll boundary
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
  }, [checkScroll, products]);

  // Viewport intersection observer to pause when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto-play timer (respects hover, offscreen, and prefers-reduced-motion)
  useEffect(() => {
    if (products.length <= 3) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    if (!isVisible || isPaused) return;

    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        // Smooth wrap back to start
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByAmount("right");
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isVisible, isPaused, products.length, autoPlayInterval]);

  if (!products || products.length === 0) return null;

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      className="py-12 sm:py-16 overflow-hidden"
      aria-label={title}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-1">
                {eyebrow}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 max-w-xl">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[var(--primary)] hover:underline mr-2"
              >
                <span>{viewAllLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}

            {/* Navigation Arrows & Accessible Autoplay Toggle */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? "Resume carousel autoplay" : "Pause carousel autoplay"}
                title={isPaused ? "Play" : "Pause"}
                className="h-9 w-9 rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-stone-50 flex items-center justify-center transition-all shadow-2xs active:scale-90 cursor-pointer"
              >
                {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount("left")}
                disabled={!canScrollLeft}
                aria-label="Previous products"
                className="h-9 w-9 rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-2xs active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount("right")}
                disabled={!canScrollRight}
                aria-label="Next products"
                className="h-9 w-9 rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-2xs active:scale-90 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Reel */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[320px] shrink-0 flex flex-col"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
