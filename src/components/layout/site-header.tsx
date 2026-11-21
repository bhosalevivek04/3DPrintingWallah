"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useCart } from "@/lib/cart/cart-context";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Custom 3D Printing", href: "/custom/3d-printing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalCount, isLoaded } = useCart();
  const cartBadgeCount = isLoaded ? totalCount : 0;
  const isCartActive = pathname === "/cart" || pathname === "/checkout";

  // Prevent background scrolling when mobile drawer is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const checkIsActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/shop") {
      return pathname === "/shop" || pathname.startsWith("/shop/");
    }
    if (href === "/custom/3d-printing") {
      return pathname.startsWith("/custom");
    }
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 glass-header border-b border-[var(--border)]/70 transition-all duration-200">
      <div className="max-w-[1440px] h-full mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Brand Wordmark with Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[20px] sm:text-[22px] font-bold tracking-tight text-[var(--brand-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg py-1 transition-transform active:scale-97"
        >
          <Image
            src="/images/Logo.png"
            alt="NewtronLabs Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-contain"
            priority
          />
          <span className="tracking-tight">{siteConfig.name}</span>
        </Link>

        {/* Main Navigation (Apple-style subtle active pills & smooth hover) */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = checkIsActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-full text-[13.5px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] active:scale-97 ${
                  isActive
                    ? "text-[var(--primary)] bg-blue-50/80 font-bold shadow-2xs"
                    : "text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-stone-100/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Utility Navigation (Track Order + Cart) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/track-order"
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] active:scale-97 ${
              pathname === "/track-order"
                ? "text-[var(--primary)] bg-blue-50/80 font-bold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-stone-100/60"
            }`}
          >
            Track Order
          </Link>

          <Link
            href="/cart"
            aria-label={`View cart with ${cartBadgeCount} items`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] active:scale-97 shadow-2xs ${
              isCartActive
                ? "bg-[var(--primary)] text-white shadow-sm font-bold"
                : cartBadgeCount > 0
                ? "bg-blue-50 text-[var(--primary)] border border-blue-200 hover:bg-blue-100/80"
                : "bg-stone-100/80 hover:bg-stone-200/70 text-[var(--foreground)]"
            }`}
          >
            <ShoppingBag
              className={`h-3.5 w-3.5 ${
                isCartActive ? "text-white" : "text-[var(--primary)]"
              }`}
            />
            <span>Cart ({cartBadgeCount})</span>
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-[var(--foreground)] hover:bg-stone-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] active:scale-95 transition-transform"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer with Smooth Fade & Slide Entrance */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-header border-b border-[var(--border)] px-6 py-5 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-md">
          {NAV_ITEMS.map((item) => {
            const isActive = checkIsActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors active:scale-98 ${
                  isActive
                    ? "bg-blue-50 text-[var(--primary)] font-bold shadow-2xs"
                    : "text-[var(--foreground)] hover:bg-stone-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 mt-1 border-t border-[var(--border)]/70 flex items-center justify-between gap-3">
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-xs font-semibold py-1.5 transition-colors ${
                pathname === "/track-order"
                  ? "text-[var(--primary)] font-bold"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Track Order
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[var(--primary)] text-white shadow-xs active:scale-95 transition-transform"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Cart ({cartBadgeCount})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
