import React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { ProductShowcaseCarousel } from "@/components/home/product-showcase-carousel";
import { CategoryShowcaseCarousel } from "@/components/home/category-showcase-carousel";
import { CustomPrintingSection } from "@/components/home/custom-printing-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";
import { FAQSection } from "@/components/home/faq-section";
import { productService } from "@/services/product-service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Printing Wallah — Ideas into objects. Made with 3D Printing Wallah.",
  description:
    "3D Printing Wallah creates custom 3D-printed products and brings your ideas to life. Find an everyday object, make it personal, or start something of your own.",
};

export default async function HomePage() {
  const allProducts = await productService.getAllProducts();

  const bestSellers = allProducts.filter(
    (p) => p.badge === "Bestseller" || p.bestseller || (p.reviewCount && p.reviewCount >= 20)
  );
  const featured = allProducts.filter(
    (p) => p.featured || (p.rating && p.rating >= 4.8)
  );
  const newArrivals = allProducts.filter(
    (p) => p.newArrival || p.badge === "New" || p.badge === "Popular"
  );
  const collectibles = allProducts.filter(
    (p) =>
      p.category === "Collectibles" ||
      p.category === "Anime Figures" ||
      p.category === "Gaming" ||
      p.category === "Miniatures"
  );

  return (
    <>
      {/* 1. Hero Showcase */}
      <HeroSection />

      {/* 2. Best Sellers Discovery Carousel */}
      <ProductShowcaseCarousel
        eyebrow="Community Favorites"
        title="Best Selling 3D Creations"
        description="Our most loved planters, modular trays, and functional desk objects printed and layer-finished in our workshop."
        products={bestSellers.length > 0 ? bestSellers : allProducts.slice(0, 5)}
        viewAllHref="/shop"
        viewAllLabel="Explore catalogue"
      />

      {/* 3. Explore Categories Interactive Carousel */}
      <CategoryShowcaseCarousel />

      {/* 4. Featured Products Carousel */}
      <ProductShowcaseCarousel
        eyebrow="Curated Highlights"
        title="Featured Studio Prints"
        description="Handcrafted objects demonstrating precise geometric tolerances, matte tactile surfaces, and durable infill."
        products={featured.length > 0 ? featured : allProducts.slice(2, 7)}
        viewAllHref="/shop"
      />

      {/* 5. Custom 3D Printing Showcase Banner */}
      <CustomPrintingSection />

      {/* 6. Popular Collectibles Carousel */}
      <ProductShowcaseCarousel
        eyebrow="Sculptures & Figures"
        title="Popular Collectibles & Gaming"
        description="Intricately sliced character busts, headphone docks, and tabletop collectibles with micro-layer resolution."
        products={collectibles.length > 0 ? collectibles : allProducts}
        viewAllHref="/shop?category=Collectibles"
        viewAllLabel="View collectibles"
      />

      {/* 7. New Arrivals Carousel */}
      <ProductShowcaseCarousel
        eyebrow="Fresh from the Workshop"
        title="New Arrivals"
        description="Recent workshop releases designed for modern homes and creative workspaces."
        products={newArrivals.length > 0 ? newArrivals : allProducts.slice(0, 4)}
        viewAllHref="/shop"
      />

      {/* 8. Process & Workshop Standards */}
      <HowItWorksSection />
      <WhyChooseSection />
      <FAQSection />
    </>
  );
}
