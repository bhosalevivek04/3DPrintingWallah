"use client";

import React, { useState, useEffect } from "react";
import { orderService } from "@/services/order-service";
import { productService } from "@/services/product-service";
import { customPrintService } from "@/services/custom-print-service";
import { quotationService } from "@/services/quotation-service";
import { inventoryService } from "@/services/inventory-service";
import { OrderRequest } from "@/types/order";
import { Product } from "@/types/product";
import { Quotation, AnalyticsDateRange } from "@/types/admin";
import { InventoryItemState } from "@/services/inventory-service";
import { CustomPrintRequest } from "@/types/custom-print";
import {
  BarChart3,
  Download,
  Calendar,
  IndianRupee,
  Layers,
  FileBox,
  FileText,
  Package,
  TrendingUp,
  CheckCircle2,
  PieChart,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>("30d");
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customPrints, setCustomPrints] = useState<CustomPrintRequest[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [inventory, setInventory] = useState<InventoryItemState[]>([]);

  useEffect(() => {
    Promise.all([
      orderService.getAllOrders(),
      productService.getAllProducts(),
      customPrintService.getAllRequests(),
      quotationService.getAllQuotations(),
      inventoryService.getInventoryOverview(),
    ]).then(([ords, prods, prints, quotes, inv]) => {
      setOrders(ords);
      setProducts(prods);
      setCustomPrints(prints);
      setQuotations(quotes);
      setInventory(inv);
    });
  }, []);

  // Aggregations
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Payment Confirmed" || o.status === "Delivered" || o.status === "Shipped")
    .reduce((sum, o) => sum + (o.grandTotal || o.estimatedSubtotal), 0);

  const totalQuotesValue = quotations.reduce((sum, q) => sum + q.grandTotal, 0);

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  // Category counts
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  // CSV Exporter Utility
  const exportToCSV = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]).join(",");
    const csvContent = [
      headers,
      ...rows.map((row) =>
        Object.values(row)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportOrdersCSV = () => {
    const data = orders.map((o) => ({
      OrderID: o.orderId,
      Date: new Date(o.createdAt).toLocaleDateString(),
      Customer: o.customer.fullName,
      Email: o.customer.email,
      Phone: o.customer.phone,
      City: o.customer.city,
      Status: o.status,
      PaymentStatus: o.paymentStatus || "Unpaid",
      ItemCount: o.items.length,
      TotalUnits: o.totalQuantity,
      Subtotal: o.estimatedSubtotal,
      GrandTotal: o.grandTotal || o.estimatedSubtotal,
    }));
    exportToCSV("newtronlabs_order_requests", data);
  };

  const handleExportInventoryCSV = () => {
    const data = inventory.map((i) => ({
      SKU: i.sku,
      Name: i.name,
      Category: i.category,
      StockQuantity: i.stockQuantity,
      LowStockThreshold: i.lowStockThreshold,
      Availability: i.availability,
    }));
    exportToCSV("newtronlabs_inventory_report", data);
  };

  const handleExportQuotesCSV = () => {
    const data = quotations.map((q) => ({
      QuoteID: q.id,
      Date: new Date(q.createdAt).toLocaleDateString(),
      Client: q.customerName,
      Email: q.customerEmail,
      Status: q.status,
      Subtotal: q.subtotal,
      Discount: q.discount,
      GrandTotal: q.grandTotal,
      ValidityDate: new Date(q.validityDate).toLocaleDateString(),
    }));
    exportToCSV("newtronlabs_quotations_pipeline", data);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Reports &amp; Workshop Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Operational throughput, enquiry stage distribution, quotation acceptance, and raw CSV data exports.
          </p>
        </div>

        {/* Date Filter */}
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
              <option value="all">All-Time Cumulative</option>
            </select>
          </div>
        </div>
      </div>

      {/* CSV Export Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <strong className="text-xs font-bold text-[var(--foreground)] block">
            Export Operational Reports (CSV)
          </strong>
          <span className="text-[11px] text-[var(--muted-foreground)]">
            Download formatted spreadsheets of orders, quotations, and current stock for offline review.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportOrdersCSV}
            className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-stone-500" />
            <span>Orders CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportQuotesCSV}
            className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-stone-500" />
            <span>Quotes CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportInventoryCSV}
            className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-stone-500" />
            <span>Inventory CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Confirmed Revenue
          </span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-emerald-700">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">Payment settled orders</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Quotation Pipeline
          </span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-indigo-700">
              ₹{totalQuotesValue.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">{quotations.length} total proposals</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Orders Processed
          </span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-[var(--foreground)]">{orders.length}</span>
            <span className="text-[11px] text-stone-400 block mt-0.5">Enquiry submissions</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Custom CAD Submissions
          </span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-[var(--foreground)]">{customPrints.length}</span>
            <span className="text-[11px] text-stone-400 block mt-0.5">Uploaded STL / OBJ models</span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid: Status Distribution & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Order Status Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-[var(--border)] shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-blue-600" />
              <h3 className="text-base font-bold text-[var(--foreground)]">
                Order Requests by Lifecycle Status
              </h3>
            </div>
            <span className="text-[11px] text-stone-400">Total: {orders.length}</span>
          </div>

          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = Math.round((count / orders.length) * 100);
              return (
                <div key={status} className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between font-semibold text-stone-700">
                    <span>{status}</span>
                    <span className="font-mono text-stone-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Performance */}
        <div className="p-6 rounded-3xl bg-white border border-[var(--border)] shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <h3 className="text-base font-bold text-[var(--foreground)]">
                Catalogue Depth by Category
              </h3>
            </div>
            <span className="text-[11px] text-stone-400">Total: {products.length} products</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / products.length) * 100);
              return (
                <div key={cat} className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between font-semibold text-stone-700">
                    <span>{cat}</span>
                    <span className="font-mono text-stone-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
