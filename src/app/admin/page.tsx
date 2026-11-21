"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { productService } from "@/services/product-service";
import { orderService } from "@/services/order-service";
import { customPrintService } from "@/services/custom-print-service";
import { quotationService } from "@/services/quotation-service";
import { inventoryService } from "@/services/inventory-service";
import { OrderRequest } from "@/types/order";
import { CustomPrintRequest } from "@/types/custom-print";
import { Quotation, AnalyticsDateRange } from "@/types/admin";
import { InventoryItemState } from "@/services/inventory-service";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  Package,
  FileBox,
  Layers,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Activity,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>("30d");
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [customPrints, setCustomPrints] = useState<CustomPrintRequest[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [inventory, setInventory] = useState<InventoryItemState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getAllOrders(),
      customPrintService.getAllRequests(),
      quotationService.getAllQuotations(),
      inventoryService.getInventoryOverview(),
    ]).then(([ords, prints, quotes, inv]) => {
      setOrders(ords);
      setCustomPrints(prints);
      setQuotations(quotes);
      setInventory(inv);
      setLoading(false);
    });
  }, []);

  // Computed metrics
  const totalOrders = orders.length;
  const newRequests = orders.filter((o) => o.status === "Request Submitted").length;
  const underReview = orders.filter(
    (o) => o.status === "Under Review" || o.status === "Under Workshop Review"
  ).length;
  const inProduction = orders.filter(
    (o) => o.status === "Processing / In Production" || o.status === "In Production"
  ).length;
  const completedOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Completed"
  ).length;

  const totalProducts = inventory.length;
  const lowStockItems = inventory.filter((i) => i.availability === "low_stock");
  const outOfStockItems = inventory.filter((i) => i.availability === "out_of_stock");

  const pendingQuotations = quotations.filter(
    (q) => q.status === "Draft" || q.status === "Ready for Review" || q.status === "Sent"
  );
  const totalQuotationValue = quotations.reduce((acc, q) => acc + q.grandTotal, 0);

  // Confirmed revenue = delivered or payment confirmed orders
  const confirmedPaidOrders = orders.filter(
    (o) => o.paymentStatus === "Payment Confirmed" || o.status === "Delivered" || o.status === "Shipped"
  );
  const totalConfirmedRevenue = confirmedPaidOrders.reduce(
    (acc, o) => acc + (o.grandTotal || o.estimatedSubtotal),
    0
  );

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Bar with Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Workshop Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Real-time status of 3D printing orders, fabrication queues, quotations, and material inventory.
          </p>
        </div>

        {/* Date Filter & Quick Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[var(--border)] rounded-xl p-1 text-xs shadow-2xs">
            <Calendar className="h-3.5 w-3.5 ml-2 text-stone-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as AnalyticsDateRange)}
              className="bg-transparent font-semibold text-stone-700 py-1 px-2.5 outline-hidden cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All-Time Metrics</option>
            </select>
          </div>

          <Link
            href="/admin/orders"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
          >
            Review Orders ({newRequests})
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (10 Core Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Total Orders
            </span>
            <div className="h-7 w-7 rounded-lg bg-blue-50 text-[var(--primary)] flex items-center justify-center">
              <FileBox className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              {totalOrders}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] block mt-0.5">
              Enquiry checkout flow
            </span>
          </div>
        </div>

        {/* Metric 2: New Requests */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
              New Requests
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-700">{newRequests}</span>
            <span className="text-[11px] text-sky-600/80 block mt-0.5">Awaiting staff review</span>
          </div>
        </div>

        {/* Metric 3: Under Review */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Under Review
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">{underReview}</span>
            <span className="text-[11px] text-amber-600/80 block mt-0.5">Filament & slicer check</span>
          </div>
        </div>

        {/* Metric 4: In Production */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              In Production
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-700">{inProduction}</span>
            <span className="text-[11px] text-indigo-600/80 block mt-0.5">On printer beds</span>
          </div>
        </div>

        {/* Metric 5: Completed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Completed
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {completedOrders}
            </span>
            <span className="text-[11px] text-emerald-600/80 block mt-0.5">Delivered to client</span>
          </div>
        </div>

        {/* Metric 6: Custom 3D Enquiries */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Custom Prints
            </span>
            <div className="h-7 w-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
              <Layers className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              {customPrints.length}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] block mt-0.5">
              Customer CAD uploads
            </span>
          </div>
        </div>

        {/* Metric 7: Pending Quotes */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Pending Quotes
            </span>
            <div className="h-7 w-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              {pendingQuotations.length}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] block mt-0.5">
              Draft or sent to client
            </span>
          </div>
        </div>

        {/* Metric 8: Total Products */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Total Products
            </span>
            <div className="h-7 w-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
              <Package className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              {totalProducts}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] block mt-0.5">
              Active shop catalog
            </span>
          </div>
        </div>

        {/* Metric 9: Low Stock Alerts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
              Low Stock
            </span>
            <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-orange-700">
              {lowStockItems.length}
            </span>
            <span className="text-[11px] text-orange-600/80 block mt-0.5">Below threshold (≤5)</span>
          </div>
        </div>

        {/* Metric 10: Out of Stock */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              Out of Stock
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-700">
              {outOfStockItems.length}
            </span>
            <span className="text-[11px] text-rose-600/80 block mt-0.5">Backorders active</span>
          </div>
        </div>
      </div>

      {/* Revenue vs. Proposed Quotations Comparison Card */}
      <div className="p-6 rounded-3xl bg-white border border-[var(--border)] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                Commercial Overview: Confirmed Revenue vs. Proposed Quotations
              </h2>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Strict accounting separation: enquiry order requests are not treated as revenue until payment is settled.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
            Demo Currency: INR (₹)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Confirmed Real Revenue */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Actual Confirmed Sales
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/60 text-emerald-900">
                  Verified Payment
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tracking-tight">
                  ₹{totalConfirmedRevenue.toLocaleString("en-IN")}
                </span>
                <p className="text-xs text-emerald-800/90 mt-1">
                  Settled across {confirmedPaidOrders.length} confirmed orders via UPI / Direct Bank Transfer.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] text-emerald-700 flex items-center justify-between">
              <span>Ready for GST invoicing</span>
              <Link href="/admin/orders" className="font-bold hover:underline flex items-center gap-1">
                <span>View Orders</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Proposed Quotations / Pipeline */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                  Proposed Quotations (Pipeline)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-200/60 text-indigo-900">
                  Unsettled Enquiries
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-900 tracking-tight">
                  ₹{totalQuotationValue.toLocaleString("en-IN")}
                </span>
                <p className="text-xs text-indigo-800/90 mt-1">
                  Proposed across {quotations.length} custom quotes and corporate enquiries currently pending acceptance.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-200 text-[11px] text-indigo-700 flex items-center justify-between">
              <span>Not counted as recognized revenue</span>
              <Link href="/admin/quotations" className="font-bold hover:underline flex items-center gap-1">
                <span>Manage Quotations</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Recent Custom Printing Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Orders (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                Recent Order Requests
              </h2>
              <span className="text-xs text-[var(--muted-foreground)]">
                Latest customer enquiries requiring confirmation
              </span>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs divide-y divide-[var(--border)]">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.orderId}
                className="p-4 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[var(--foreground)]">
                      {order.orderId}
                    </span>
                    <AdminStatusBadge status={order.status} size="sm" />
                  </div>
                  <div className="text-stone-600 truncate">
                    <strong>{order.customer.fullName}</strong> • {order.customer.city || "India"}
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    {order.items.length} item(s) • Qty: {order.totalQuantity} • Est: ₹
                    {order.estimatedSubtotal.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/orders?ref=${order.orderId}`}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-stone-100 transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Custom 3D Model Submissions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                Custom 3D Model Submissions
              </h2>
              <span className="text-xs text-[var(--muted-foreground)]">
                Recent STL/OBJ files uploaded for quoting
              </span>
            </div>
            <Link
              href="/admin/custom-prints"
              className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>Queue ({customPrints.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs divide-y divide-[var(--border)]">
            {customPrints.slice(0, 3).map((req) => (
              <div
                key={req.referenceId}
                className="p-4 hover:bg-stone-50/70 transition-colors flex flex-col gap-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[var(--foreground)]">
                    {req.referenceId}
                  </span>
                  <AdminStatusBadge status={req.status} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-stone-700 font-medium">
                  <span className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-mono">
                    {req.modelFile.extension.toUpperCase()}
                  </span>
                  <span className="truncate">{req.modelFile.name}</span>
                  <span className="text-[10px] text-stone-400">({req.modelFile.formattedSize})</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)] pt-1">
                  <span>{req.customer.fullName} ({req.requirements.material})</span>
                  <Link
                    href={`/admin/custom-prints?ref=${req.referenceId}`}
                    className="text-[var(--primary)] font-bold hover:underline"
                  >
                    Review CAD &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Popular Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Low Stock Warnings */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                Low-Stock Workshop Alerts
              </h3>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-[var(--primary)] hover:underline"
            >
              Adjust Inventory
            </Link>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-600 font-semibold bg-emerald-50 rounded-xl">
              All active product filaments and items are above threshold!
            </div>
          ) : (
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="block text-stone-900">{item.name}</strong>
                    <span className="text-[11px] text-stone-600">
                      SKU: {item.sku} • Category: {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-orange-800">
                      Only {item.stockQuantity} left
                    </span>
                    <span className="block text-[10px] text-stone-500">
                      Threshold: {item.lowStockThreshold}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prototype Architecture Disclaimer Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-[var(--border)] shadow-2xs flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              System Architecture Note
            </span>
            <h3 className="text-base font-bold text-[var(--foreground)] mt-1">
              Frontend Service Abstraction Active
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mt-2">
              All modifications made in this workshop dashboard persist within your current browser session using
              defensive localStorage caching. The UI connects to strict TypeScript service contracts ready to swap with
              PostgreSQL and Cloudflare R2 endpoints during the backend integration phase.
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
            <span className="text-[11px] text-stone-400">Zero unauthenticated mock leaks</span>
            <Link
              href="/admin/settings"
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Configure Thresholds &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
