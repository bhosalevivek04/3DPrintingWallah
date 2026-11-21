import React from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/data/products";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchaseCard } from "@/components/product/product-purchase-card";
import { ProductOverviewSpecs } from "@/components/product/product-overview-specs";
import { ProductFAQ } from "@/components/product/product-faq";
import { RelatedProducts } from "@/components/product/related-products";
import { RecentlyViewedProducts } from "@/components/product/recently-viewed";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found — NewtronLabs",
    };
  }

  return {
    title: `${product.name} | 3D Printed ${product.category} — NewtronLabs`,
    description: product.description,
    openGraph: {
      title: `${product.name} — NewtronLabs 3D Creations`,
      description: product.shortDescription,
      images: [
        {
          url: product.images[0] || "/images/hero-workshop.webp",
          width: 800,
          height: 600,
          alt: product.imageAlt,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product, 3);

  return (
    <div className="pt-4 pb-12 sm:pb-16 bg-[var(--background)] min-h-[calc(100vh-64px)]">
      <Container>
        {/* Dynamic Global Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: product.name },
          ]}
          className="mb-6 sm:mb-8"
        />

        {/* Top Product Showcase (Gallery on Left, Purchase on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} alt={product.name} />
          </div>

          <div className="lg:col-span-5">
            <ProductPurchaseCard product={product} />
          </div>
        </div>

        {/* Detailed Overview, Technical Specs & Care */}
        <ProductOverviewSpecs product={product} />

        {/* 3D Printing Specific FAQs */}
        <ProductFAQ />

        {/* Related Products */}
        <RelatedProducts products={related} />

        {/* Recently Viewed Products (Client Component) */}
        <RecentlyViewedProducts currentProductId={product.id} />
      </Container>
    </div>
  );
}
