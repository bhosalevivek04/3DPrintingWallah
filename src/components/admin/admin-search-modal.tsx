"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FileBox,
  Layers,
  Package,
  FolderTree,
  SlidersHorizontal,
  Users,
  FileText,
  Truck,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
  ArrowRight,
} from "lucide-react";

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCHABLE_MODULES = [
  { label: "Dashboard Overview", href: "/admin", icon: BarChart3, keywords: "analytics stats revenue summary" },
  { label: "Customer Orders", href: "/admin/orders", icon: FileBox, keywords: "orders requests checkout enquiry dispatch status" },
  { label: "Custom 3D Printing", href: "/admin/custom-prints", icon: Layers, keywords: "custom models stl obj cad upload requests" },
  { label: "Product Catalogue", href: "/admin/products", icon: Package, keywords: "products sku items add planter lamp figure" },
  { label: "Categories", href: "/admin/categories", icon: FolderTree, keywords: "categories subcategories classification taxonomy" },
  { label: "Inventory & Stock", href: "/admin/inventory", icon: SlidersHorizontal, keywords: "stock quantity threshold low stock restock audit" },
  { label: "Customer Directory", href: "/admin/customers", icon: Users, keywords: "customers clients email phone address history" },
  { label: "Quotation Generator", href: "/admin/quotations", icon: FileText, keywords: "quotes estimations invoice pricing tax discount" },
  { label: "Order Tracking", href: "/admin/tracking", icon: Truck, keywords: "tracking delivery courier dispatch delhvery bluedart" },
  { label: "Customer Reviews", href: "/admin/reviews", icon: Star, keywords: "reviews ratings feedback approve reject stars" },
  { label: "Contact Enquiries", href: "/admin/enquiries", icon: MessageSquare, keywords: "enquiries contact messages support bulk corporate" },
  { label: "Reports & Analytics", href: "/admin/analytics", icon: BarChart3, keywords: "reports export csv performance metrics chart" },
  { label: "Workshop Settings", href: "/admin/settings", icon: Settings, keywords: "settings config thresholds shipping profile address" },
];

export function AdminSearchModal({ isOpen, onClose }: AdminSearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle modal
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SEARCHABLE_MODULES.filter((m) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return m.label.toLowerCase().includes(q) || m.keywords.toLowerCase().includes(q);
  });

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-lg rounded-2xl bg-white border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-3.5 border-b border-[var(--border)] flex items-center gap-3 bg-stone-50">
          <Search className="h-4 w-4 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search admin modules, orders, products, customers..."
            className="w-full bg-transparent text-sm font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-[var(--muted-foreground)]">
              No matching modules found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-100 transition-colors text-left text-xs font-semibold text-[var(--foreground)] group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-stone-100 group-hover:bg-blue-50 group-hover:text-[var(--primary)] flex items-center justify-center text-stone-500 transition-colors">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-stone-300 group-hover:text-[var(--primary)] transition-colors" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--border)] bg-stone-50/80 flex items-center justify-between text-[11px] text-stone-400">
          <span>Navigation Quick Jump</span>
          <span className="font-mono text-[10px] bg-stone-200/60 px-1.5 py-0.5 rounded-sm">ESC to close</span>
        </div>
      </div>
    </div>
  );
}
