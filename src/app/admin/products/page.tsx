"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { productService } from "@/services/product-service";
import { Product, ProductCategory, ProductAvailability } from "@/types/product";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit2,
  Copy,
  Archive,
  ExternalLink,
  Trash2,
  CheckCircle2,
  X,
  SlidersHorizontal,
  UploadCloud,
  ArrowUpDown,
  Tag,
} from "lucide-react";

const CATEGORIES: ProductCategory[] = [
  "Planters",
  "Desk Accessories",
  "Collectibles",
  "Home Decor",
  "Miniatures",
  "Gaming",
  "Custom Creations",
];

const SAMPLE_GALLERY_IMAGES = [
  "/images/product-ribbed-planter.webp",
  "/images/product-desk-tray.webp",
  "/images/product-lowpoly-fox.webp",
  "/images/product-voronoi-lamp.webp",
  "/images/product-cable-clips.webp",
  "/images/product-controller-stand.webp",
  "/images/product-mini-dragon.webp",
  "/images/hero-workshop.webp",
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    slug: "",
    category: "Planters" as ProductCategory,
    subcategory: "",
    price: 499,
    originalPrice: 699,
    stockQuantity: 15,
    lowStockThreshold: 5,
    material: "Matte PLA",
    dimensions: "100mm × 100mm × 100mm",
    weight: "150g",
    printingTechnology: "High-precision FDM",
    finish: "Smooth Satin",
    productionTime: "24-48 Hours",
    colors: "Matte Black, White, Cobalt Blue",
    description: "",
    shortDescription: "",
    featured: false,
    bestseller: false,
    newArrival: true,
    available: true,
    availability: "in_stock" as ProductAvailability,
    image: "/images/product-ribbed-planter.webp",
  });

  // Archive Confirm Dialog
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null);

  const loadProducts = () => {
    productService.getAllProducts().then(setProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: `NWL-PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: "",
      category: "Planters",
      subcategory: "Geometric Vessels",
      price: 499,
      originalPrice: 699,
      stockQuantity: 15,
      lowStockThreshold: 5,
      material: "Matte Recyclable PLA",
      dimensions: "110mm × 105mm",
      weight: "180g",
      printingTechnology: "High-precision FDM (0.16mm)",
      finish: "Micro-textured Matte",
      productionTime: "24-48 Hours",
      colors: "Cobalt Blue, Sandstone Sand, Matte White",
      description: "Precision-printed architectural decor piece crafted in our local workshop.",
      shortDescription: "Geometric 3D printed vessel with textured surfaces.",
      featured: false,
      bestseller: false,
      newArrival: true,
      available: true,
      availability: "in_stock",
      image: "/images/product-ribbed-planter.webp",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku || `NWL-PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory || "",
      price: p.price ?? 0,
      originalPrice: p.originalPrice ?? 0,
      stockQuantity: p.stockQuantity ?? 10,
      lowStockThreshold: p.lowStockThreshold ?? 5,
      material: p.material || "Matte PLA",
      dimensions: p.dimensions || "100mm × 100mm",
      weight: p.weight || "150g",
      printingTechnology: p.printingTechnology || "High-precision FDM",
      finish: p.finish || "Standard Matte",
      productionTime: p.productionTime || "24-48 Hours",
      colors: p.colors ? p.colors.join(", ") : "Standard",
      description: p.description,
      shortDescription: p.shortDescription,
      featured: !!p.featured,
      bestseller: !!p.bestseller,
      newArrival: !!p.newArrival,
      available: p.available,
      availability: p.availability,
      image: p.images[0] || "/images/product-ribbed-planter.webp",
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const colorArray = formData.colors.split(",").map((c) => c.trim()).filter(Boolean);

    let calculatedAvailability: ProductAvailability = formData.availability;
    if (formData.stockQuantity <= 0) {
      calculatedAvailability = "out_of_stock";
    } else if (formData.stockQuantity <= formData.lowStockThreshold) {
      calculatedAvailability = "low_stock";
    }

    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        subcategory: formData.subcategory,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stockQuantity: Number(formData.stockQuantity),
        lowStockThreshold: Number(formData.lowStockThreshold),
        material: formData.material,
        dimensions: formData.dimensions,
        weight: formData.weight,
        printingTechnology: formData.printingTechnology,
        finish: formData.finish,
        productionTime: formData.productionTime,
        colors: colorArray,
        description: formData.description,
        shortDescription: formData.shortDescription,
        featured: formData.featured,
        bestseller: formData.bestseller,
        newArrival: formData.newArrival,
        available: formData.available,
        availability: calculatedAvailability,
        images: [formData.image, ...editingProduct.images.slice(1)],
      });
      showToast(`Product "${formData.name}" updated successfully.`);
    } else {
      await productService.createProduct({
        name: formData.name,
        sku: formData.sku,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: formData.category,
        subcategory: formData.subcategory,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stockQuantity: Number(formData.stockQuantity),
        lowStockThreshold: Number(formData.lowStockThreshold),
        material: formData.material,
        dimensions: formData.dimensions,
        weight: formData.weight,
        printingTechnology: formData.printingTechnology,
        finish: formData.finish,
        productionTime: formData.productionTime,
        colors: colorArray,
        description: formData.description,
        shortDescription: formData.shortDescription,
        featured: formData.featured,
        bestseller: formData.bestseller,
        newArrival: formData.newArrival,
        available: formData.available,
        availability: calculatedAvailability,
        images: [formData.image],
      });
      showToast(`New product "${formData.name}" added to catalog.`);
    }

    setIsModalOpen(false);
    loadProducts();
  };

  const handleDuplicate = async (p: Product) => {
    const copy = await productService.duplicateProduct(p.id);
    if (copy) {
      loadProducts();
      showToast(`Duplicated "${p.name}" as "${copy.name}".`);
    }
  };

  const handleArchiveConfirm = async () => {
    if (!archiveTarget) return;
    await productService.archiveProduct(archiveTarget.id);
    loadProducts();
    showToast(`Archived "${archiveTarget.name}".`);
    setArchiveTarget(null);
  };

  // Filter & Sort
  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);

      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.price ?? 0) - (b.price ?? 0);
      if (sortBy === "price-high") return (b.price ?? 0) - (a.price ?? 0);
      if (sortBy === "stock-low") return (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0);
      if (sortBy === "stock-high") return (b.stockQuantity ?? 0) - (a.stockQuantity ?? 0);
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header with Add Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Product Catalogue Management
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Add new 3D printed creations, update pricing, customize filament material options, and manage availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-all shadow-2xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search, Category & Sort Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Product Name, SKU, or Keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Categories ({products.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="price-low">Sort: Price (Low to High)</option>
            <option value="price-high">Sort: Price (High to Low)</option>
            <option value="stock-low">Sort: Stock (Low to High)</option>
            <option value="stock-high">Sort: Stock (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Qty</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                    No products found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          <Image
                            src={product.images[0] || "/images/product-ribbed-planter.webp"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <strong className="block text-[var(--foreground)] truncate max-w-[200px]">
                            {product.name}
                          </strong>
                          <span className="font-mono text-[10px] text-stone-400 block">
                            SKU: {product.sku || "NWL-PRD"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-700">
                      {product.category}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-[var(--foreground)]">
                      ₹{(product.price ?? 0).toLocaleString("en-IN")}
                      {product.originalPrice && (
                        <span className="text-[10px] text-stone-400 line-through block font-normal">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[var(--foreground)]">
                        {product.stockQuantity ?? 10} units
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        Limit: {product.lowStockThreshold ?? 5}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <AdminStatusBadge status={product.availability} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.bestseller && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[9px] font-bold">
                            Bestseller
                          </span>
                        )}
                        {product.featured && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 text-[9px] font-bold">
                            Featured
                          </span>
                        )}
                        {product.badge && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-700 text-[9px]">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/shop/${product.slug}`}
                          target="_blank"
                          title="Preview in Storefront"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[var(--primary)] hover:bg-stone-100"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(product)}
                          title="Edit Product"
                          className="p-1.5 rounded-lg text-stone-600 hover:text-[var(--primary)] hover:bg-stone-100 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(product)}
                          title="Duplicate Product"
                          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setArchiveTarget(product)}
                          title="Archive Product"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-stone-50 border-t border-[var(--border)] flex items-center justify-between text-xs text-stone-500">
          <span>Total: {filtered.length} products listed</span>
          <span className="text-[11px] text-stone-400">Edits update both admin and storefront catalog</span>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div
            className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white border border-[var(--border)] shadow-xl overflow-y-auto p-6 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  {editingProduct ? `Edit "${editingProduct.name}"` : "Add New 3D Printed Creation"}
                </h3>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Configure catalogue attributes, pricing, filament options and inventory rules.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Spiral Fluted Desk Planter"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs font-medium focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU Number</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. NWL-PRD-4019"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white font-mono text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs font-semibold focus:outline-hidden cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Geometric Vessels"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white font-bold text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white font-bold text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Low-Stock Alert</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. Matte Recyclable PLA"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="e.g. 110mm × 105mm"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Lead Time</label>
                  <input
                    type="text"
                    value={formData.productionTime}
                    onChange={(e) => setFormData({ ...formData, productionTime: e.target.value })}
                    placeholder="e.g. 24-48 Hours"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Filament Colors (comma-separated)</label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Cobalt Blue, Sandstone Sand, Matte White"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                />
              </div>

              {/* Image Selection Preview */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Product Image (Select Workshop Asset)
                </label>
                <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-stone-50 border border-[var(--border)]">
                  {SAMPLE_GALLERY_IMAGES.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img })}
                      className={`relative h-14 w-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        formData.image === img ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="Thumbnail choice" fill className="object-cover" sizes="56px" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of layer structure, infill pattern and design inspiration..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-3 rounded-xl bg-stone-50 border border-[var(--border)]">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-[var(--primary)]"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="rounded text-[var(--primary)]"
                  />
                  <span>Bestseller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="rounded text-[var(--primary)]"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              {/* Footer CTAs */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-2xs cursor-pointer"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Archive Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!archiveTarget}
        title={`Archive "${archiveTarget?.name}"?`}
        description="Archiving will mark this product as out of stock on the storefront while retaining its order history in the database."
        confirmLabel="Archive Product"
        variant="warning"
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  );
}
