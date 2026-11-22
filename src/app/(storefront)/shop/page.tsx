import React, { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { productService } from "@/services/product-service";
import { ShopCatalogClient } from "@/components/shop/shop-catalog-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop 3D Printed Creations — Figurines, Planters & Desk Decor",
  description:
    "Explore NewtronLabs' curated catalogue of 3D-printed products: architectural planters, modular organisers, figurines, miniatures, and custom bespoke gifts.",
};

interface ShopPageProps {
  searchParams?: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolved = searchParams ? await searchParams : {};
  const products = await productService.getAllProducts();

  return (
    <div className="pt-4 pb-12 sm:pb-16 bg-[var(--background)] min-h-[calc(100vh-64px)]">
      <Container>
        <Breadcrumbs items={[{ label: "Shop" }]} className="mb-4 sm:mb-6" />

        <Suspense fallback={<div className="py-20 text-center text-sm text-[var(--muted-foreground)]">Loading shop catalogue...</div>}>
          <ShopCatalogClient
            initialProducts={products}
            serverCategory={resolved.category}
            serverSort={resolved.sort}
            serverQuery={resolved.q}
            serverPage={resolved.page ? parseInt(resolved.page, 10) : undefined}
          />
        </Suspense>
      </Container>
    </div>
  );
}
