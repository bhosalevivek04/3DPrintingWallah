"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { History, ArrowRight } from "lucide-react";
import { productService } from "@/services/product-service";

interface RecentlyViewedProps {
  currentProductId: string;
}

const STORAGE_KEY = "newtronlabs_recently_viewed_slugs";

export function RecentlyViewedProducts({ currentProductId }: RecentlyViewedProps) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 1. Read existing slugs
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const list: string[] = stored ? JSON.parse(stored) : [];

      // 2. Fetch all products to lookup
      productService.getAllProducts().then((all) => {
        const matching = list
          .filter((id) => id !== currentProductId)
          .map((id) => all.find((p) => p.id === id))
          .filter((p): p is Product => Boolean(p))
          .slice(0, 4);

        setRecentProducts(matching);
      });

      // 3. Update storage with current product at the front
      const updated = [currentProductId, ...list.filter((id) => id !== currentProductId)].slice(
        0,
        8
      );
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not access sessionStorage for recently viewed products", e);
    }
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="pt-10 border-t border-[var(--border)]">
      <div className="flex items-center gap-2 mb-6">
        <History className="h-5 w-5 text-[var(--primary)]" />
        <h2 id="recent-heading" className="text-xl font-bold text-[var(--foreground)] tracking-tight">
          Recently Viewed
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {recentProducts.map((p) => (
          <Link
            key={p.id}
            href={p.href}
            className="group flex flex-col rounded-xl border border-[var(--border)] bg-white p-3 hover:border-[var(--primary)] hover:shadow-xs transition-all"
          >
            <div className="relative aspect-[4/3] w-full rounded-lg bg-stone-100 overflow-hidden mb-2">
              <Image
                src={p.images[0] || "/images/hero-workshop.webp"}
                alt={p.imageAlt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-103 transition-transform"
              />
            </div>
            <p className="text-xs font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)]">
              {p.name}
            </p>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="font-bold text-[var(--primary)]">{p.priceDisplay}</span>
              <ArrowRight className="h-3 w-3 text-stone-400 group-hover:text-[var(--primary)] transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
