"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Menu } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors lg:hidden"
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
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer panel */}
          <nav
            className="fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-[var(--background)] shadow-xl flex flex-col lg:hidden"
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
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-[var(--foreground)] hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors"
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
                    className="flex flex-col rounded-lg px-3 py-3 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-colors"
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

            <div className="border-t border-[var(--border)] px-6 py-5">
              <Link
                href="/track-order"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-2"
              >
                Track Order
              </Link>
              <p className="text-xs text-[var(--muted-foreground)]">
                {siteConfig.contact.email}
              </p>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
