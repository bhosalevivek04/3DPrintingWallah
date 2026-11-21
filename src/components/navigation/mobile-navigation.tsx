"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Menu, ShoppingBag } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useCart } from "@/lib/cart/cart-context";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalCount, isLoaded } = useCart();
  const cartBadgeCount = isLoaded ? totalCount : 0;

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors lg:hidden active:scale-95"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer panel */}
          <nav
            className="fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-[var(--background)] shadow-2xl flex flex-col lg:hidden border-l border-[var(--border)] animate-in slide-in-from-right duration-200"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 text-base font-bold tracking-tight text-[var(--foreground)]"
              >
                <Image
                  src="/images/Logo.png"
                  alt="NewtronLabs Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-md object-contain"
                />
                <span>{siteConfig.name}</span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-[var(--foreground)] hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors active:scale-95"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="flex flex-col gap-1 px-4 py-6 flex-1 overflow-y-auto">
              {navigationConfig.mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col rounded-xl px-3.5 py-3 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors active:scale-98"
                  >
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-[var(--border)] px-6 py-5 flex items-center justify-between gap-3">
              <Link
                href="/track-order"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] py-1.5"
              >
                Track Order
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[var(--primary)] text-white shadow-xs active:scale-95 transition-transform"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Cart ({cartBadgeCount})</span>
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
