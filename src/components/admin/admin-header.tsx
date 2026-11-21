"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  User,
  LogOut,
  Sliders,
} from "lucide-react";
import { notificationService } from "@/services/notification-service";
import { AdminNotificationsDropdown } from "./admin-notifications-dropdown";
import { AdminSearchModal } from "./admin-search-modal";

interface AdminHeaderProps {
  onOpenMobile: () => void;
}

const SECTION_TITLES: Record<string, { title: string; category: string }> = {
  "/admin": { title: "Workshop Overview", category: "Dashboard" },
  "/admin/orders": { title: "Order Requests", category: "Sales & Enquiries" },
  "/admin/custom-prints": { title: "Custom 3D Prints", category: "Model Fabrication" },
  "/admin/products": { title: "Product Catalogue", category: "Catalogue Management" },
  "/admin/categories": { title: "Categories & Taxonomies", category: "Catalogue Management" },
  "/admin/inventory": { title: "Inventory & Stock Levels", category: "Fulfillment & Supply" },
  "/admin/customers": { title: "Customer Directory", category: "Customer Relations" },
  "/admin/quotations": { title: "Quotation Generator", category: "Enquiry Pricing" },
  "/admin/tracking": { title: "Order Tracking & Logistics", category: "Fulfillment & Supply" },
  "/admin/reviews": { title: "Product Reviews Moderation", category: "Customer Relations" },
  "/admin/enquiries": { title: "Contact Enquiries Inbox", category: "Customer Relations" },
  "/admin/analytics": { title: "Reports & Analytics", category: "Business Intelligence" },
  "/admin/settings": { title: "Workshop Settings", category: "Configuration" },
};

export function AdminHeader({ onOpenMobile }: AdminHeaderProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    notificationService.getUnreadCount().then(setUnreadCount);
  }, [pathname, notifOpen]);

  const currentSection = SECTION_TITLES[pathname] || {
    title: "Workshop Operations",
    category: "Admin",
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[var(--border)] shadow-2xs">
        <div className="px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Dynamic Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobile}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted-foreground)]">
                <span>Admin</span>
                <ChevronRight className="h-3 w-3 text-stone-300" />
                <span className="text-stone-600">{currentSection.category}</span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-[var(--foreground)] tracking-tight truncate">
                {currentSection.title}
              </h1>
            </div>
          </div>

          {/* Right: Quick Search, Notifications, Store Link & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-[var(--foreground)] text-xs font-medium transition-colors cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline text-[10px] font-mono bg-white px-1.5 py-0.5 rounded-sm border border-stone-200 text-stone-400">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                )}
              </button>

              <AdminNotificationsDropdown
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
              />
            </div>

            {/* Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-stone-600 hover:text-[var(--primary)] hover:bg-blue-50/50 transition-colors cursor-pointer"
            >
              <span>View Store</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <div className="h-7 w-7 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-700">
                  WM
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-[var(--foreground)]">
                    Workshop Admin
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Technician Active
                  </span>
                </div>
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl bg-white border border-[var(--border)] shadow-xl p-2 animate-in fade-in slide-in-from-top-2 text-xs">
                    <div className="p-2 border-b border-[var(--border)] mb-1">
                      <strong className="block text-[var(--foreground)]">Workshop Manager</strong>
                      <span className="text-[11px] text-[var(--muted-foreground)]">workshop@newtronlabs.in</span>
                      <span className="mt-1 inline-block px-1.5 py-0.5 rounded-sm bg-blue-50 text-[var(--primary)] text-[10px] font-bold">
                        Lead Admin (Mock)
                      </span>
                    </div>

                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg text-stone-600 hover:bg-stone-50 font-medium"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Settings & Preferences</span>
                    </Link>

                    <Link
                      href="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg text-stone-600 hover:bg-stone-50 font-medium"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Storefront Homepage</span>
                    </Link>

                    <div className="border-t border-[var(--border)] my-1" />

                    <div className="p-2 text-[10px] text-amber-700 bg-amber-50 rounded-lg">
                      Frontend demonstration mode. Role-based access control will be connected in backend phase.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <AdminSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
