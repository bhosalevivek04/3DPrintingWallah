"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const total = images.length;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setSelectedImageIndex((prev) => (prev + 1) % total);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setSelectedImageIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
        setIsZoomed(false);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev + 1) % total);
        setIsZoomed(false);
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev - 1 + total) % total);
        setIsZoomed(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, total]);

  const activeImage = images[selectedImageIndex] || images[0] || "/images/hero-workshop.webp";

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Stage */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-[4/3] w-full bg-stone-100/80 rounded-2xl overflow-hidden border border-[var(--border)]/80 shadow-xs group cursor-zoom-in"
      >
        <Image
          key={activeImage}
          src={activeImage}
          alt={`${alt} - view ${selectedImageIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300 ease-out"
        />

        {/* Previous / Next Controls on Main Image */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100 shadow-md active:scale-90"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100 shadow-md active:scale-90"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image index & Lightbox Trigger Pill */}
        <div className="absolute bottom-3.5 right-3.5 px-3 py-1.5 rounded-lg bg-black/55 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 shadow-xs group-hover:bg-black/75 transition-colors">
          <Maximize2 className="h-3.5 w-3.5" />
          <span>
            {selectedImageIndex + 1} / {total} (Click to inspect)
          </span>
        </div>
      </div>

      {/* Thumbnails Row */}
      {total > 1 && (
        <div
          className="flex items-center gap-3 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Product thumbnails"
        >
          {images.map((img, idx) => {
            const isSelected = idx === selectedImageIndex;
            return (
              <button
                key={img + idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Show image ${idx + 1}`}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer bg-stone-100 active:scale-95 ${
                  isSelected
                    ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30 scale-102 shadow-xs"
                    : "border-[var(--border)] opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${alt} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => {
            setIsLightboxOpen(false);
            setIsZoomed(false);
          }}
        >
          {/* Top Bar Controls */}
          <div
            className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center gap-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsZoomed((z) => !z)}
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer active:scale-90"
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLightboxOpen(false);
                setIsZoomed(false);
              }}
              aria-label="Close image viewer"
              className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90 z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90 z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            className={`relative max-w-5xl max-h-[85vh] w-full h-[75vh] flex items-center justify-center transition-transform duration-300 ${
              isZoomed ? "scale-130 cursor-zoom-out" : "scale-100 cursor-zoom-in"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed((z) => !z);
            }}
          >
            <Image
              src={activeImage}
              alt={`${alt} high-resolution layer inspect`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Bottom Caption */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white/90 text-xs font-semibold backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {alt} • {selectedImageIndex + 1} of {total} (Click image to zoom)
          </div>
        </div>
      )}
    </div>
  );
}
