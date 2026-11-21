"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { heroCarouselSlides, HeroCarouselSlide } from "@/data/hero-carousel";

const AUTO_ROTATE_INTERVAL_MS = 5000;

export function HeroProductCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const totalSlides = heroCarouselSlides.length;

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Slide navigation callbacks
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Set up auto-rotation interval
  useEffect(() => {
    // If paused or user prefers reduced motion, disable auto-rotation
    if (isPaused || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTO_ROTATE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, prefersReducedMotion, nextSlide, activeIndex]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Ensure horizontal swipe is dominant and exceeds 40px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  const activeSlide: HeroCarouselSlide = heroCarouselSlides[activeIndex];

  return (
    <div
      ref={carouselContainerRef}
      className="flex flex-col gap-3 max-w-[608px] w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured 3D printed products showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main Image Frame (matches exact Figma aspect ratio: 608/456) */}
      <div
        className="relative aspect-[608/456] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-sm border border-[var(--border)] group select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides list */}
        {heroCarouselSlides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${totalSlides}: ${slide.name}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                prefersReducedMotion ? "duration-0" : ""
              } ${isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"}`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 608px"
                className="object-cover"
              />

              {/* Category Pill Tag (top-left) */}
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[var(--foreground)] border border-black/5 shadow-xs">
                  {slide.category}
                </span>
              </div>

              {/* Product Information Overlay (bottom) */}
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-6 pt-16 flex flex-col justify-end text-white">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                      {slide.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-1 max-w-md">
                      {slide.description}
                    </p>
                  </div>

                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs sm:text-sm font-semibold text-white/95 hover:text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous Slide Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous product slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/40 hover:bg-black/65 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-md active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Next Slide Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next product slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/40 hover:bg-black/65 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-md active:scale-95"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Caption & Pagination Dots Bar (underneath image) */}
      <div className="flex items-center justify-between text-[14px] text-[var(--muted-foreground)] px-1 gap-4">
        {/* Dynamic Caption for active product */}
        <div className="truncate min-w-0" aria-live="polite">
          <span className="font-medium text-[var(--foreground)]">{activeSlide.caption}</span>
          <span className="mx-1.5 text-stone-300">•</span>
          <span className="text-xs text-[var(--muted-foreground)]">{activeSlide.meta}</span>
        </div>

        {/* Pagination Dots Controls */}
        <div
          className="flex items-center gap-1.5 shrink-0"
          role="tablist"
          aria-label="Product carousel pagination"
        >
          {heroCarouselSlides.map((slide, idx) => {
            const isDotActive = idx === activeIndex;

            return (
              <button
                key={slide.id}
                role="tab"
                type="button"
                aria-selected={isDotActive}
                aria-label={`Go to slide ${idx + 1}: ${slide.name}`}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                  isDotActive
                    ? "w-6 h-2 bg-[var(--primary)]"
                    : "w-2 h-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
