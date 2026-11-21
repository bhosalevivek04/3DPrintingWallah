"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  LayoutDashboard,
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
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { orderService } from "@/services/order-service";
import { customPrintService } from "@/services/custom-print-service";
import { inventoryService } from "@/services/inventory-service";
import { enquiryService } from "@/services/enquiry-service";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ElementType;
  badgeCount?: number;
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [counts, setCounts] = useState({
    pendingOrders: 0,
    newCustomPrints: 0,
    lowStock: 0,
    newEnquiries: 0,
  });

  useEffect(() => {
    Promise.all([
      orderService.getAllOrders(),
      customPrintService.getAllRequests(),
      inventoryService.getInventoryOverview(),
      enquiryService.getAllEnquiries(),
    ]).then(([orders, prints, inv, enqs]) => {
      setCounts({
        pendingOrders: orders.filter(
          (o) => o.status === "Request Submitted" || o.status === "Under Review"
        ).length,
        newCustomPrints: prints.filter((p) => p.status === "submitted").length,
        lowStock: inv.filter((i) => i.availability === "low_stock").length,
        newEnquiries: enqs.filter((e) => e.status === "New").length,
      });
    });
  }, [pathname]);

  const navItems: NavItemConfig[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: FileBox, badgeCount: counts.pendingOrders },
    { label: "Custom 3D Prints", href: "/admin/custom-prints", icon: Layers, badgeCount: counts.newCustomPrints },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Inventory", href: "/admin/inventory", icon: SlidersHorizontal, badgeCount: counts.lowStock },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Quotations", href: "/admin/quotations", icon: FileText },
    { label: "Order Tracking", href: "/admin/tracking", icon: Truck },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Contact Enquiries", href: "/admin/enquiries", icon: MessageSquare, badgeCount: counts.newEnquiries },
    { label: "Reports & Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[var(--border)] select-none">
      {/* Brand & Collapse Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border)]">
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 overflow-hidden font-extrabold tracking-tight text-sm text-[var(--foreground)]"
        >
          <div className="h-8 w-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-2xs">
            NL
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="truncate">{siteConfig.name}</span>
              <span className="text-[10px] font-semibold text-[var(--muted-foreground)] tracking-normal">
                Workshop Operations
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-blue-50/80 text-[var(--primary)] font-bold shadow-2xs"
                  : "text-stone-600 hover:text-[var(--foreground)] hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-[var(--primary)]" : "text-stone-400 group-hover:text-stone-600"
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {/* Badge Counter */}
              {item.badgeCount && item.badgeCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    collapsed
                      ? "hidden"
                      : isActive
                      ? "bg-[var(--primary)] text-white"
                      : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Navigation: Storefront Link */}
      <div className="p-3 border-t border-[var(--border)] bg-stone-50/60">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-[var(--foreground)] hover:bg-stone-100 transition-colors w-full cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 text-stone-400" />
          {!collapsed && <span>Storefront Portal</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className={`sticky top-0 h-screen ${collapsed ? "w-20" : "w-64"}`}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
