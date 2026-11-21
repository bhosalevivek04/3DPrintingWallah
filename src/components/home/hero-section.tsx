import React from "react";
import Link from "next/link";
import { HeroProductCarousel } from "@/components/home/hero-product-carousel";

export function HeroSection() {
  return (
    <section className="w-full bg-[var(--background)] py-14 sm:py-18 overflow-hidden" aria-label="Hero">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Introduction with Apple-Style Editorial Typography */}
          <div className="flex flex-col gap-6 max-w-[608px] animate-in fade-in duration-500">
            {/* Eyebrow */}
            <p className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[var(--primary)]">
              Small workshop. Big possibilities.
            </p>

            {/* Headline */}
            <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] font-bold tracking-tight text-[var(--foreground)] leading-[1.10]">
              Turn your ideas into something real.
            </h1>

            {/* Description */}
            <p className="text-[17px] sm:text-[18px] text-[var(--muted-foreground)] leading-[1.6] max-w-xl">
              3D Printing Wallah creates custom 3D-printed products and brings your ideas to life. Find an everyday object, make it personal, or start something of your own.
            </p>

            {/* Actions with Tactile Press Feedback */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-7 py-3.5 text-[14px] font-bold text-white hover:bg-[var(--primary-hover)] transition-all shadow-sm active:scale-97 min-h-[46px] cursor-pointer"
              >
                Explore Products
              </Link>
              <Link
                href="/custom/3d-printing"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-white px-7 py-3.5 text-[14px] font-bold text-[var(--foreground)] hover:bg-stone-50 hover:border-stone-400 transition-all active:scale-97 min-h-[46px] cursor-pointer shadow-2xs"
              >
                Start a Custom Print
              </Link>
            </div>

            {/* Supporting note */}
            <p className="text-[13px] text-[var(--muted-foreground)] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Your model, your sketch, or just the start of an idea.</span>
            </p>
          </div>

          {/* Right Column: Hero Product Showcase Carousel */}
          <HeroProductCarousel />
        </div>
      </div>
    </section>
  );
}
