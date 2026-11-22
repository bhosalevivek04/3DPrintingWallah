# Database Architecture Proposal — NewtronLabs / 3D Printing Wallah

> **Document version**: 1.0  
> **Date**: November 2026  
> **Stack**: Next.js 16 (App Router) · TypeScript · Tailwind CSS  
> **Deployment target**: Cloudflare Pages / Workers  
> **Budget**: Free tier initially  

---

## Table of Contents

1. [Recommended Database](#1-recommended-database)
2. [Recommended ORM / Query Layer](#2-recommended-orm--query-layer)
3. [Recommended Object Storage](#3-recommended-object-storage)
4. [Authentication Strategy](#4-authentication-strategy)
5. [Complete Database Schema](#5-complete-database-schema)
6. [Entity Relationship Diagram](#6-entity-relationship-diagram)
7. [Proposed API Endpoints](#7-proposed-api-endpoints)
8. [Environment Variable Requirements](#8-environment-variable-requirements)
9. [Free-Tier Cost Estimate](#9-free-tier-cost-estimate)
10. [Migration Sequence](#10-migration-sequence)
11. [Security Architecture](#11-security-architecture)
12. [Backup Strategy](#12-backup-strategy)
13. [Risks & Trade-Offs](#13-risks--trade-offs)

---

## 1. Recommended Database

### Comparison Matrix

| Criterion | Cloudflare D1 | Supabase (PostgreSQL) | Neon (PostgreSQL) |
|:---|:---|:---|:---|
| **Engine** | SQLite (via Workers) | PostgreSQL 15 | PostgreSQL 16 |
| **Free-tier storage** | 500 MB (5 GB total across DBs) | 500 MB | 0.5 GiB |
| **Free-tier compute** | 5M rows read/day, 100K rows written/day | Unlimited API requests (pauses after 1 week inactivity) | 191.9 compute hours/month (0.25 vCPU) |
| **Next.js 16 compatibility** | ✅ Via Workers binding; requires `@cloudflare/next-on-pages` or `@opennextjs/cloudflare` | ✅ Via `@supabase/supabase-js` or Postgres drivers | ✅ Via `@neondatabase/serverless` HTTP/WebSocket driver |
| **Cloudflare deployment** | ✅ Native (same edge network) | ⚠️ External — requires outbound fetch to Supabase region | ✅ Serverless driver works over HTTP from Workers/edge |
| **Relational support** | Partial — SQLite lacks ENUM, native arrays, advanced JSON operators | Full PostgreSQL | Full PostgreSQL |
| **Array columns** | ❌ Not supported (SQLite) | ✅ `text[]`, `integer[]`, etc. | ✅ `text[]`, `integer[]`, etc. |
| **JSON functions** | ❌ Limited `json_extract` only | ✅ Full `jsonb` operators (`->`, `->>`, `@>`, `?`) | ✅ Full `jsonb` operators |
| **Transactions** | ⚠️ Single-statement or batch only; no multi-round-trip transactions | ✅ Full ACID | ✅ Full ACID |
| **Auth integration** | ❌ None built-in | ✅ Supabase Auth (GoTrue) — 50K MAU free | ❌ None built-in (use Auth.js) |
| **Backup / recovery** | Manual export; no PITR on free tier | Daily backups (7-day retention on free) | ✅ Point-in-time recovery (7-day on free) |
| **Branching / previews** | ❌ | ❌ (branching is Pro only) | ✅ Free instant database branches |
| **Scalability** | Scales at edge; 10 GB on paid plan | Scales vertically (Pro plan needed) | Autoscales compute; scales to 0 when idle |
| **Migration complexity** | High — SQLite syntax differences, no ENUM, schema workarounds | Medium — standard Postgres, Prisma/Drizzle migrations | Low — standard Postgres, Drizzle migrations |
| **ORM support** | Drizzle (SQLite dialect), limited Prisma | Prisma, Drizzle, Kysely, TypeORM | Drizzle, Prisma, Kysely — all with serverless driver |
| **Vendor lock-in** | High (D1-specific bindings, SQLite dialect) | Medium (Supabase Auth ties, GoTrue dependency) | Low (standard Postgres, portable schema) |
| **Estimated monthly cost (MVP)** | $0 | $0 | $0 |
| **Estimated cost at scale (~10K orders/month)** | $5/mo (Workers Paid) | $25/mo (Pro plan) | $19/mo (Scale plan) |

### Recommendation: **Neon (PostgreSQL)**

Neon is the best fit for this project for the following reasons:

1. **Full PostgreSQL compatibility** — the existing data model uses arrays (`colors`, `tags`, `features`, `subcategories`), ENUM types (12 order statuses, 6 quotation statuses, etc.), and `jsonb` columns (`metadata` in audit logs). D1/SQLite cannot natively support any of these without workarounds.

2. **Cloudflare Workers / Edge compatibility** — Neon's `@neondatabase/serverless` driver communicates over HTTP (fetch) or WebSocket, both of which work inside Cloudflare Workers and Edge Runtime. No TCP socket or binary engine required.

3. **Free database branching** — each Vercel/Cloudflare preview deployment can get its own isolated database branch at zero cost. This is critical for testing schema migrations before production.

4. **Drizzle ORM synergy** — Drizzle's `neon-http` driver is first-class, type-safe, and runs on the edge. No binary engine overhead.

5. **No vendor lock-in** — the schema is standard PostgreSQL. Migrating to any other Postgres host (Supabase, AWS RDS, Railway) requires only a connection string change.

6. **Point-in-time recovery** — Neon provides 7-day PITR on the free tier, which is superior to D1's manual-export-only backup story.

7. **Scale-to-zero** — when the workshop has no traffic (overnight), Neon suspends the compute endpoint and charges nothing. Aligns with the budget-conscious MVP phase.

---

## 2. Recommended ORM / Query Layer

### Recommendation: **Drizzle ORM**

| Criterion | Drizzle ORM | Prisma |
|:---|:---|:---|
| Bundle size | ~50 KB (tree-shakeable) | ~2 MB+ (requires binary Query Engine) |
| Edge / Workers runtime | ✅ Runs natively — pure JS/TS | ❌ Query Engine binary cannot run in Cloudflare Workers |
| Neon HTTP driver | ✅ First-class `drizzle-orm/neon-http` | ⚠️ Requires `@prisma/adapter-neon` (experimental) |
| Type safety | Full compile-time inference from schema | Generated types from `prisma generate` |
| Migration tooling | `drizzle-kit push` / `drizzle-kit generate` | `prisma migrate dev` |
| SQL access | Full SQL escape hatch via `sql` template tag | Limited raw query support |
| Relational queries | `drizzle-orm/relations` for joins | Prisma Client relation loading |

**Why NOT Prisma**: Prisma's Query Engine is a Rust binary compiled to WASM for edge environments. On Cloudflare Workers, this adds ~2–4 MB to the bundle, hits the 10 MB Worker size limit, and introduces cold start latency of 500ms+. Drizzle is pure TypeScript, adds negligible bundle size, and has zero cold start penalty.

### Installation

```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

### Drizzle Configuration (`drizzle.config.ts`)

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Database Client (`src/db/index.ts`)

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

---

## 3. Recommended Object Storage

### Recommendation: **Cloudflare R2**

| Feature | Cloudflare R2 |
|:---|:---|
| Free storage | 10 GB |
| Free Class A ops (writes) | 1 M / month |
| Free Class B ops (reads) | 10 M / month |
| Egress fees | **$0** (zero egress, ever) |
| API compatibility | S3-compatible (`@aws-sdk/client-s3`) |
| Integration | Native with Cloudflare Workers via bindings |
| CDN | Automatic via Cloudflare's global network |

**Use cases in this project**:

| Asset Type | R2 Key Pattern | Max Size |
|:---|:---|:---|
| Custom print 3D models (.stl, .obj, .3mf, .glb, .gltf) | `models/{requestId}/{timestamp}-{filename}` | 50 MB |
| Reference images | `references/{requestId}/{timestamp}-{filename}` | 10 MB |
| Product catalog images | `products/{productId}/{slug}-{index}.webp` | 5 MB |
| Quotation PDFs | `quotations/{quotationId}.pdf` | 2 MB |
| Admin avatars | `avatars/{adminUserId}.webp` | 1 MB |

### Upload Flow

1. **Client** requests a presigned upload URL from `POST /api/uploads/signed-url`
2. **Server** validates file extension, size, and auth — generates a presigned PUT URL via `@aws-sdk/s3-request-presigner` (TTL: 15 min)
3. **Client** uploads directly to R2 (browser → R2, no server relay)
4. **Client** sends the returned `fileKey` to the relevant API endpoint (e.g., custom print submission)
5. **Admin download** generates a presigned GET URL on demand

### R2 Bucket CORS

```json
[
  {
    "AllowedOrigins": ["https://3dprintingwallah.com", "http://localhost:3000"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedHeaders": ["Content-Type", "Content-Length", "x-amz-meta-*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 4. Authentication Strategy

### Recommendation: **Auth.js v5 (NextAuth)** with Credentials Provider

| Component | Choice |
|:---|:---|
| Auth library | Auth.js v5 (`next-auth@5`) |
| Provider | Credentials (email + password) |
| Session strategy | JWT (HTTP-only, `SameSite=Lax`, `Secure` cookies) |
| Database adapter | `@auth/drizzle-adapter` (stores sessions/accounts in Neon) |
| Password hashing | Argon2id via `@node-rs/argon2` |

### RBAC Roles

| Role | Code | Description |
|:---|:---|:---|
| Super Admin | `SUPER_ADMIN` | Full system access, settings, user management |
| Workshop Lead | `WORKSHOP_LEAD` | Orders, production, inventory, quotations, analytics |
| Slicing Technician | `SLICING_TECH` | Custom prints, CAD review, inventory adjustments |
| Customer Support | `SUPPORT` | Read-only orders, enquiries, reviews (respond only) |
| Billing Operator | `BILLING` | Payments, quotations, invoices, analytics export |

### Permissions Matrix

| Action | SUPER_ADMIN | WORKSHOP_LEAD | SLICING_TECH | SUPPORT | BILLING |
|:---|:---:|:---:|:---:|:---:|:---:|
| View operations dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage order statuses | ✅ | ✅ | ✅ | 👁️ | 👁️ |
| Confirm payment status | ✅ | ✅ | ❌ | ❌ | ✅ |
| CAD / slicing inspection | ✅ | ✅ | ✅ | 👁️ | ❌ |
| Create / send quotations | ✅ | ✅ | ✅ | ❌ | ✅ |
| Adjust inventory quantities | ✅ | ✅ | ✅ | ❌ | ❌ |
| Product catalogue CRUD | ✅ | ✅ | 👁️ | 👁️ | ❌ |
| Manage admin users | ✅ | ❌ | ❌ | ❌ | ❌ |
| System settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Export analytics CSV | ✅ | ✅ | ❌ | ❌ | ✅ |

> 👁️ = Read-only access

### Middleware Route Protection (`src/middleware.ts`)

```typescript
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Protect all /admin routes except login page
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protect all /api/admin routes
  if (pathname.startsWith("/api/admin")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Settings restricted to SUPER_ADMIN
  if (pathname.startsWith("/admin/settings") && userRole !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/admin?error=forbidden", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

---

## 5. Complete Database Schema

All 22 tables defined using Drizzle ORM TypeScript syntax (`drizzle-orm/pg-core`).

> **Important**: Inventory is **NOT** deducted when an order request is submitted. The order lifecycle is enquiry-based — the workshop reviews the request, prepares a quotation, and only adjusts stock upon `Payment Confirmed` or manual production allocation.

### File: `src/db/schema.ts`

```typescript
import {
  pgTable,
  pgEnum,
  text,
  varchar,
  integer,
  boolean,
  decimal,
  timestamp,
  jsonb,
  serial,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// ============================================================
// ENUMS
// ============================================================

export const adminRoleEnum = pgEnum("admin_role", [
  "SUPER_ADMIN",
  "WORKSHOP_LEAD",
  "SLICING_TECH",
  "SUPPORT",
  "BILLING",
]);

export const productAvailabilityEnum = pgEnum("product_availability", [
  "in_stock",
  "low_stock",
  "out_of_stock",
  "made_to_order",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "Request Submitted",
  "Under Review",
  "Awaiting Customer Confirmation",
  "Quotation Sent",
  "Awaiting Payment",
  "Payment Confirmed",
  "Processing / In Production",
  "Quality Check",
  "Ready for Dispatch",
  "Shipped",
  "Delivered",
  "Cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "Unpaid",
  "Awaiting Payment",
  "Partially Paid",
  "Payment Confirmed",
  "Refunded",
]);

export const customPrintStatusEnum = pgEnum("custom_print_status", [
  "draft",
  "submitted",
  "under_review",
  "quotation_prepared",
  "quotation_sent",
  "requires_info",
  "accepted",
  "approved",
  "in_production",
  "completed",
  "rejected",
  "cancelled",
]);

export const quotationStatusEnum = pgEnum("quotation_status", [
  "Draft",
  "Ready for Review",
  "Sent",
  "Accepted",
  "Rejected",
  "Expired",
]);

export const enquiryStatusEnum = pgEnum("enquiry_status", [
  "New",
  "In Progress",
  "Resolved",
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "Pending",
  "Approved",
  "Rejected",
]);

export const fulfillmentStatusEnum = pgEnum("fulfillment_status", [
  "Order Placed",
  "In Production",
  "Quality Checked",
  "Packed",
  "Dispatched",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Delayed",
]);

export const courierNameEnum = pgEnum("courier_name", [
  "Delhivery",
  "BlueDart",
  "DTDC",
  "India Post Speed Post",
  "Dunzo / Local Courier",
  "Standard Workshop Delivery",
]);

export const stockAdjustmentReasonEnum = pgEnum("stock_adjustment_reason", [
  "Restocked batch",
  "Damaged in workshop",
  "Calibration loss",
  "Physical audit correction",
  "Fulfillment deduction",
  "Reserved for custom order",
  "Other",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "UPI",
  "Bank Transfer",
  "Cash on Delivery",
  "Razorpay",
  "Other",
]);

export const paymentRecordStatusEnum = pgEnum("payment_record_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

// ============================================================
// 1. ADMIN USERS
// ============================================================

export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: adminRoleEnum("role").notNull().default("WORKSHOP_LEAD"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 2. CUSTOMERS
// ============================================================

export const customers = pgTable("customers", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  company: varchar("company", { length: 255 }),
  deliveryAddress: text("delivery_address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  pinCode: varchar("pin_code", { length: 10 }),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 3. CATEGORIES
// ============================================================

export const categories = pgTable("categories", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(1),
  isActive: boolean("is_active").notNull().default(true),
  subcategories: text("subcategories").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 4. PRODUCTS
// ============================================================

export const products = pgTable("products", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: text("category_id").notNull().references(() => categories.id),
  subcategory: varchar("subcategory", { length: 100 }),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  price: decimal("price", { precision: 10, scale: 2 }),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  availability: productAvailabilityEnum("availability").notNull().default("in_stock"),
  available: boolean("available").notNull().default(true),
  stockQuantity: integer("stock_quantity").notNull().default(10),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  trackInventory: boolean("track_inventory").notNull().default(true),
  allowBackorders: boolean("allow_backorders").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  bestseller: boolean("bestseller").notNull().default(false),
  newArrival: boolean("new_arrival").notNull().default(false),
  imageAlt: text("image_alt").notNull().default(""),
  badge: varchar("badge", { length: 50 }),
  badgeVariant: varchar("badge_variant", { length: 20 }),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("5.0"),
  reviewCount: integer("review_count").notNull().default(0),
  material: varchar("material", { length: 100 }),
  dimensions: varchar("dimensions", { length: 100 }),
  weight: varchar("weight", { length: 50 }),
  printingTechnology: varchar("printing_technology", { length: 100 }),
  finish: varchar("finish", { length: 100 }),
  colors: text("colors").array().notNull().default([]),
  tags: text("tags").array().notNull().default([]),
  features: text("features").array().notNull().default([]),
  productionTime: varchar("production_time", { length: 50 }),
  href: text("href").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index("products_category_id_idx").on(table.categoryId),
  availabilityIdx: index("products_availability_idx").on(table.availability),
  featuredIdx: index("products_featured_idx").on(table.featured),
}));

// ============================================================
// 5. PRODUCT IMAGES
// ============================================================

export const productImages = pgTable("product_images", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIdx: index("product_images_product_id_idx").on(table.productId),
}));

// ============================================================
// 6. PRODUCT SPECIFICATIONS
// ============================================================

export const productSpecifications = pgTable("product_specifications", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }).notNull(),
  value: text("value").notNull(),
}, (table) => ({
  productIdx: index("product_specs_product_id_idx").on(table.productId),
}));

// ============================================================
// 7. ORDER REQUESTS
// ============================================================

export const orderRequests = pgTable("order_requests", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  orderId: varchar("order_id", { length: 30 }).notNull().unique(), // NWL-ORD-YYYYMMDD-XXXX
  status: orderStatusEnum("status").notNull().default("Request Submitted"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("Unpaid"),
  customerId: text("customer_id").notNull().references(() => customers.id),
  totalQuantity: integer("total_quantity").notNull(),
  estimatedSubtotal: decimal("estimated_subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).default("0"),
  grandTotal: decimal("grand_total", { precision: 10, scale: 2 }),
  paymentPolicyNote: text("payment_policy_note").notNull().default(""),
  estimatedReviewHours: integer("estimated_review_hours").notNull().default(24),
  quotationId: text("quotation_id"),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  courierName: varchar("courier_name", { length: 100 }),
  dispatchDate: timestamp("dispatch_date", { withTimezone: true }),
  estimatedDeliveryDate: timestamp("estimated_delivery_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  customerIdx: index("order_requests_customer_id_idx").on(table.customerId),
  statusIdx: index("order_requests_status_idx").on(table.status),
  createdAtIdx: index("order_requests_created_at_idx").on(table.createdAt),
}));

// ============================================================
// 8. ORDER REQUEST ITEMS
// ============================================================

export const orderRequestItems = pgTable("order_request_items", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  orderRequestId: text("order_request_id").notNull().references(() => orderRequests.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  image: text("image").notNull().default(""),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  priceDisplay: varchar("price_display", { length: 50 }).notNull().default(""),
  quantity: integer("quantity").notNull(),
  availability: varchar("availability", { length: 50 }).notNull(),
  maxAllowedQuantity: integer("max_allowed_quantity").notNull().default(10),
  selectedColor: varchar("selected_color", { length: 50 }),
  material: varchar("material", { length: 100 }),
}, (table) => ({
  orderIdx: index("order_items_order_request_id_idx").on(table.orderRequestId),
}));

// ============================================================
// 9. ORDER STATUS HISTORY
// ============================================================

export const orderStatusHistory = pgTable("order_status_history", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  orderRequestId: text("order_request_id").notNull().references(() => orderRequests.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").notNull(),
  note: text("note"),
  updatedBy: varchar("updated_by", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orderIdx: index("order_status_history_order_id_idx").on(table.orderRequestId),
}));

// ============================================================
// 10. ORDER INTERNAL NOTES
// ============================================================

export const orderInternalNotes = pgTable("order_internal_notes", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  orderRequestId: text("order_request_id").notNull().references(() => orderRequests.id, { onDelete: "cascade" }),
  author: varchar("author", { length: 255 }).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orderIdx: index("order_notes_order_id_idx").on(table.orderRequestId),
}));

// ============================================================
// 11. CUSTOM PRINT REQUESTS
// ============================================================

export const customPrintRequests = pgTable("custom_print_requests", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  referenceId: varchar("reference_id", { length: 30 }).notNull().unique(), // NWL-REQ-YYYYMMDD-XXXX
  status: customPrintStatusEnum("status").notNull().default("submitted"),
  customerId: text("customer_id").notNull().references(() => customers.id),
  estimatedQuotationHours: integer("estimated_quotation_hours").default(24),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  customerIdx: index("custom_prints_customer_id_idx").on(table.customerId),
  statusIdx: index("custom_prints_status_idx").on(table.status),
}));

// ============================================================
// 12. MODEL FILES (R2 references)
// ============================================================

export const modelFiles = pgTable("model_files", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  customPrintRequestId: text("custom_print_request_id").notNull().references(() => customPrintRequests.id, { onDelete: "cascade" }),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  extension: varchar("extension", { length: 10 }).notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  r2Key: text("r2_key").notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  requestIdx: index("model_files_request_id_idx").on(table.customPrintRequestId),
}));

// ============================================================
// 13. CUSTOM PRINT REQUIREMENTS
// ============================================================

export const customPrintRequirements = pgTable("custom_print_requirements", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  customPrintRequestId: text("custom_print_request_id").notNull().references(() => customPrintRequests.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  material: varchar("material", { length: 100 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  finish: varchar("finish", { length: 100 }).notNull(),
  infill: varchar("infill", { length: 50 }),
  notes: text("notes"),
  specialInstructions: text("special_instructions"),
});

// ============================================================
// 14. QUOTATIONS
// ============================================================

export const quotations = pgTable("quotations", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  orderRequestId: text("order_request_id").references(() => orderRequests.id),
  customPrintRequestId: text("custom_print_request_id").references(() => customPrintRequests.id),
  customerId: text("customer_id").notNull().references(() => customers.id),
  materialCharge: decimal("material_charge", { precision: 10, scale: 2 }).notNull().default("0"),
  finishingCharge: decimal("finishing_charge", { precision: 10, scale: 2 }).notNull().default("0"),
  designCharge: decimal("design_charge", { precision: 10, scale: 2 }).notNull().default("0"),
  deliveryCharge: decimal("delivery_charge", { precision: 10, scale: 2 }).notNull().default("0"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  grandTotal: decimal("grand_total", { precision: 10, scale: 2 }).notNull(),
  validityDate: timestamp("validity_date", { withTimezone: true }).notNull(),
  notes: text("notes"),
  terms: text("terms").notNull().default(""),
  status: quotationStatusEnum("status").notNull().default("Draft"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 15. QUOTATION LINE ITEMS
// ============================================================

export const quotationLineItems = pgTable("quotation_line_items", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  quotationId: text("quotation_id").notNull().references(() => quotations.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
}, (table) => ({
  quotationIdx: index("line_items_quotation_id_idx").on(table.quotationId),
}));

// ============================================================
// 16. PAYMENTS
// ============================================================

export const payments = pgTable("payments", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  orderRequestId: text("order_request_id").notNull().references(() => orderRequests.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: paymentMethodEnum("method").notNull(),
  transactionRef: varchar("transaction_ref", { length: 255 }),
  status: paymentRecordStatusEnum("status").notNull().default("pending"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orderIdx: index("payments_order_request_id_idx").on(table.orderRequestId),
}));

// ============================================================
// 17. SHIPPING TRACKING
// ============================================================

export const shippingTracking = pgTable("shipping_tracking", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  orderRequestId: text("order_request_id").notNull().unique().references(() => orderRequests.id, { onDelete: "cascade" }),
  trackingNumber: varchar("tracking_number", { length: 100 }).notNull(),
  courierName: courierNameEnum("courier_name").notNull(),
  courierUrl: text("courier_url"),
  fulfillmentStatus: fulfillmentStatusEnum("fulfillment_status").notNull().default("Order Placed"),
  dispatchDate: timestamp("dispatch_date", { withTimezone: true }),
  estimatedDelivery: timestamp("estimated_delivery", { withTimezone: true }),
  actualDelivery: timestamp("actual_delivery", { withTimezone: true }),
  originLocation: varchar("origin_location", { length: 255 }).notNull(),
  destinationCity: varchar("destination_city", { length: 100 }).notNull(),
  trackingNotes: text("tracking_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 18. TRACKING EVENTS
// ============================================================

export const trackingEvents = pgTable("tracking_events", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  shippingTrackingId: text("shipping_tracking_id").notNull().references(() => shippingTracking.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  note: text("note"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  trackingIdx: index("tracking_events_tracking_id_idx").on(table.shippingTrackingId),
}));

// ============================================================
// 19. CONTACT ENQUIRIES
// ============================================================

export const contactEnquiries = pgTable("contact_enquiries", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().default(""),
  subject: varchar("subject", { length: 500 }).notNull(),
  message: text("message").notNull(),
  status: enquiryStatusEnum("status").notNull().default("New"),
  internalReplyNote: text("internal_reply_note"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
}, (table) => ({
  statusIdx: index("enquiries_status_idx").on(table.status),
}));

// ============================================================
// 20. PRODUCT REVIEWS
// ============================================================

export const productReviews = pgTable("product_reviews", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  productId: text("product_id").notNull().references(() => products.id),
  customerId: text("customer_id").references(() => customers.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  rating: integer("rating").notNull(), // 1-5
  title: varchar("title", { length: 500 }).notNull(),
  comment: text("comment").notNull(),
  status: reviewStatusEnum("status").notNull().default("Pending"),
  verifiedPurchase: boolean("verified_purchase").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIdx: index("reviews_product_id_idx").on(table.productId),
  statusIdx: index("reviews_status_idx").on(table.status),
}));

// ============================================================
// 21. STOCK ADJUSTMENT LOGS
// ============================================================

export const stockAdjustmentLogs = pgTable("stock_adjustment_logs", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  productId: text("product_id").notNull().references(() => products.id),
  previousQuantity: integer("previous_quantity").notNull(),
  adjustmentQuantity: integer("adjustment_quantity").notNull(),
  updatedQuantity: integer("updated_quantity").notNull(),
  reason: stockAdjustmentReasonEnum("reason").notNull(),
  adjustedBy: varchar("adjusted_by", { length: 255 }).notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIdx: index("stock_logs_product_id_idx").on(table.productId),
}));

// ============================================================
// 22. AUDIT LOGS
// ============================================================

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  adminUserId: text("admin_user_id").notNull().references(() => adminUsers.id),
  action: varchar("action", { length: 100 }).notNull(), // e.g. "ORDER_STATUS_CHANGED"
  entityType: varchar("entity_type", { length: 50 }).notNull(), // e.g. "order_request"
  entityId: text("entity_id").notNull(),
  metadata: jsonb("metadata"), // flexible payload
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  adminIdx: index("audit_logs_admin_id_idx").on(table.adminUserId),
  entityIdx: index("audit_logs_entity_idx").on(table.entityType, table.entityId),
  timestampIdx: index("audit_logs_timestamp_idx").on(table.timestamp),
}));

// ============================================================
// RELATIONS (Drizzle relational query support)
// ============================================================

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  auditLogs: many(auditLogs),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orderRequests: many(orderRequests),
  customPrintRequests: many(customPrintRequests),
  productReviews: many(productReviews),
  quotations: many(quotations),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  specifications: many(productSpecifications),
  orderItems: many(orderRequestItems),
  reviews: many(productReviews),
  stockAdjustments: many(stockAdjustmentLogs),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productSpecificationsRelations = relations(productSpecifications, ({ one }) => ({
  product: one(products, {
    fields: [productSpecifications.productId],
    references: [products.id],
  }),
}));

export const orderRequestsRelations = relations(orderRequests, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orderRequests.customerId],
    references: [customers.id],
  }),
  items: many(orderRequestItems),
  statusHistory: many(orderStatusHistory),
  internalNotes: many(orderInternalNotes),
  shippingTracking: one(shippingTracking),
  payments: many(payments),
}));

export const orderRequestItemsRelations = relations(orderRequestItems, ({ one }) => ({
  orderRequest: one(orderRequests, {
    fields: [orderRequestItems.orderRequestId],
    references: [orderRequests.id],
  }),
  product: one(products, {
    fields: [orderRequestItems.productId],
    references: [products.id],
  }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  orderRequest: one(orderRequests, {
    fields: [orderStatusHistory.orderRequestId],
    references: [orderRequests.id],
  }),
}));

export const orderInternalNotesRelations = relations(orderInternalNotes, ({ one }) => ({
  orderRequest: one(orderRequests, {
    fields: [orderInternalNotes.orderRequestId],
    references: [orderRequests.id],
  }),
}));

export const customPrintRequestsRelations = relations(customPrintRequests, ({ one, many }) => ({
  customer: one(customers, {
    fields: [customPrintRequests.customerId],
    references: [customers.id],
  }),
  modelFiles: many(modelFiles),
  requirements: one(customPrintRequirements),
  quotation: one(quotations),
}));

export const modelFilesRelations = relations(modelFiles, ({ one }) => ({
  customPrintRequest: one(customPrintRequests, {
    fields: [modelFiles.customPrintRequestId],
    references: [customPrintRequests.id],
  }),
}));

export const customPrintRequirementsRelations = relations(customPrintRequirements, ({ one }) => ({
  customPrintRequest: one(customPrintRequests, {
    fields: [customPrintRequirements.customPrintRequestId],
    references: [customPrintRequests.id],
  }),
}));

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  orderRequest: one(orderRequests, {
    fields: [quotations.orderRequestId],
    references: [orderRequests.id],
  }),
  customPrintRequest: one(customPrintRequests, {
    fields: [quotations.customPrintRequestId],
    references: [customPrintRequests.id],
  }),
  customer: one(customers, {
    fields: [quotations.customerId],
    references: [customers.id],
  }),
  lineItems: many(quotationLineItems),
}));

export const quotationLineItemsRelations = relations(quotationLineItems, ({ one }) => ({
  quotation: one(quotations, {
    fields: [quotationLineItems.quotationId],
    references: [quotations.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  orderRequest: one(orderRequests, {
    fields: [payments.orderRequestId],
    references: [orderRequests.id],
  }),
}));

export const shippingTrackingRelations = relations(shippingTracking, ({ one, many }) => ({
  orderRequest: one(orderRequests, {
    fields: [shippingTracking.orderRequestId],
    references: [orderRequests.id],
  }),
  events: many(trackingEvents),
}));

export const trackingEventsRelations = relations(trackingEvents, ({ one }) => ({
  shippingTracking: one(shippingTracking, {
    fields: [trackingEvents.shippingTrackingId],
    references: [shippingTracking.id],
  }),
}));

export const contactEnquiriesRelations = relations(contactEnquiries, () => ({}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  customer: one(customers, {
    fields: [productReviews.customerId],
    references: [customers.id],
  }),
}));

export const stockAdjustmentLogsRelations = relations(stockAdjustmentLogs, ({ one }) => ({
  product: one(products, {
    fields: [stockAdjustmentLogs.productId],
    references: [products.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  adminUser: one(adminUsers, {
    fields: [auditLogs.adminUserId],
    references: [adminUsers.id],
  }),
}));
```

---

## 6. Entity Relationship Diagram

```mermaid
erDiagram
    admin_users {
        text id PK
        varchar email UK
        text password_hash
        varchar name
        enum role
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    customers {
        text id PK
        varchar email UK
        varchar full_name
        varchar phone
        varchar company
        text delivery_address
        varchar city
        varchar state
        varchar pin_code
        timestamp created_at
    }

    categories {
        text id PK
        varchar name UK
        varchar slug UK
        text description
        integer display_order
        boolean is_active
        text_arr subcategories
        timestamp created_at
    }

    products {
        text id PK
        varchar sku UK
        varchar slug UK
        varchar name
        text category_id FK
        decimal price
        enum availability
        integer stock_quantity
        boolean featured
        text_arr colors
        text_arr tags
        text_arr features
        timestamp created_at
    }

    product_images {
        text id PK
        text product_id FK
        text url
        integer display_order
    }

    product_specifications {
        text id PK
        text product_id FK
        varchar label
        text value
    }

    order_requests {
        text id PK
        varchar order_id UK
        enum status
        enum payment_status
        text customer_id FK
        integer total_quantity
        decimal estimated_subtotal
        decimal grand_total
        timestamp created_at
    }

    order_request_items {
        text id PK
        text order_request_id FK
        text product_id FK
        varchar name
        decimal unit_price
        integer quantity
        varchar selected_color
    }

    order_status_history {
        text id PK
        text order_request_id FK
        enum status
        text note
        varchar updated_by
        timestamp timestamp
    }

    order_internal_notes {
        text id PK
        text order_request_id FK
        varchar author
        text content
        timestamp timestamp
    }

    custom_print_requests {
        text id PK
        varchar reference_id UK
        enum status
        text customer_id FK
        integer est_quotation_hours
        timestamp created_at
    }

    model_files {
        text id PK
        text custom_print_request_id FK
        varchar file_name
        varchar extension
        integer size_bytes
        text r2_key
    }

    custom_print_requirements {
        text id PK
        text custom_print_request_id FK
        integer quantity
        varchar material
        varchar color
        varchar finish
    }

    quotations {
        text id PK
        text order_request_id FK
        text custom_print_request_id FK
        text customer_id FK
        decimal grand_total
        enum status
        timestamp validity_date
    }

    quotation_line_items {
        text id PK
        text quotation_id FK
        varchar title
        integer quantity
        decimal unit_price
        decimal total
    }

    payments {
        text id PK
        text order_request_id FK
        decimal amount
        enum method
        varchar transaction_ref
        enum status
        timestamp paid_at
    }

    shipping_tracking {
        text id PK
        text order_request_id FK
        varchar tracking_number
        enum courier_name
        enum fulfillment_status
        timestamp dispatch_date
    }

    tracking_events {
        text id PK
        text shipping_tracking_id FK
        varchar status
        varchar location
        text note
        timestamp timestamp
    }

    contact_enquiries {
        text id PK
        varchar customer_name
        varchar email
        varchar subject
        text message
        enum status
        timestamp submitted_at
    }

    product_reviews {
        text id PK
        text product_id FK
        text customer_id FK
        integer rating
        varchar title
        text comment
        enum status
        boolean verified_purchase
    }

    stock_adjustment_logs {
        text id PK
        text product_id FK
        integer previous_quantity
        integer adjustment_quantity
        integer updated_quantity
        enum reason
    }

    audit_logs {
        text id PK
        text admin_user_id FK
        varchar action
        varchar entity_type
        text entity_id
        jsonb metadata
        timestamp timestamp
    }

    customers ||--o{ order_requests : "places"
    customers ||--o{ custom_print_requests : "submits"
    customers ||--o{ product_reviews : "writes"
    customers ||--o{ quotations : "receives"

    categories ||--o{ products : "classifies"

    products ||--o{ product_images : "has"
    products ||--o{ product_specifications : "has"
    products ||--o{ order_request_items : "referenced_by"
    products ||--o{ product_reviews : "receives"
    products ||--o{ stock_adjustment_logs : "tracked_by"

    order_requests ||--|{ order_request_items : "contains"
    order_requests ||--o{ order_status_history : "tracks"
    order_requests ||--o{ order_internal_notes : "annotated_by"
    order_requests ||--o| shipping_tracking : "dispatched_via"
    order_requests ||--o{ payments : "paid_by"
    order_requests ||--o| quotations : "quoted_by"

    custom_print_requests ||--|{ model_files : "uploads"
    custom_print_requests ||--o| custom_print_requirements : "specifies"
    custom_print_requests ||--o| quotations : "quoted_by"

    quotations ||--|{ quotation_line_items : "itemizes"

    shipping_tracking ||--|{ tracking_events : "logs"

    admin_users ||--o{ audit_logs : "generates"
```

---

## 7. Proposed API Endpoints

### Orders

| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/admin/orders` | List all order requests (filterable by status, payment status, date range, search query) |
| `GET` | `/api/admin/orders/:id` | Full order detail with items, status history, internal notes |
| `PATCH` | `/api/admin/orders/:id/status` | Advance order through the 12-step lifecycle |
| `PATCH` | `/api/admin/orders/:id/payment` | Update payment status independently |
| `POST` | `/api/admin/orders/:id/notes` | Append internal workshop note |
| `GET` | `/api/order-requests?ref=NWL-ORD-...` | Public: customer order tracking lookup (PII masked) |
| `POST` | `/api/order-requests` | Public: submit new order request from checkout |

### Products

| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/admin/products` | List products with filters (category, availability, search) |
| `POST` | `/api/admin/products` | Create new product |
| `PUT` | `/api/admin/products/:id` | Update product details |
| `POST` | `/api/admin/products/:id/duplicate` | Clone product entry |
| `DELETE` | `/api/admin/products/:id` | Archive / soft-delete product |
| `POST` | `/api/admin/products/:id/images` | Upload/reorder product images |

### Inventory

| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/admin/inventory` | Current stock levels, low-stock flags |
| `POST` | `/api/admin/inventory/adjust` | Manual stock adjustment with reason and operator |
| `GET` | `/api/admin/inventory/logs` | Adjustment history (filterable by product) |

### Custom Print Requests

| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/admin/custom-prints` | List submissions with status filter |
| `GET` | `/api/admin/custom-prints/:id` | Full request detail with model file metadata and requirements |
| `PATCH` | `/api/admin/custom-prints/:id/status` | Update status (e.g., `under_review` → `quotation_prepared`) |
| `GET` | `/api/admin/custom-prints/:id/download` | Generate presigned R2 download URL for model file |
| `POST` | `/api/custom-print-requests` | Public: submit custom print request |
| `POST` | `/api/uploads/signed-url` | Public: request presigned R2 upload URL |

### Quotations

| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/admin/quotations` | List quotations with status filter |
| `POST` | `/api/admin/quotations` | Create itemized quotation (from order or custom print) |
| `GET` | `/api/admin/quotations/:id` | Retrieve quotation with line items |
| `PATCH` | `/api/admin/quotations/:id/status` | Update status (Draft → Sent → Accepted) |
| `POST` | `/api/admin/quotations/:id/send` | Send quotation email to customer |

### Shipping & Tracking

| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/admin/tracking/:orderId` | Retrieve tracking manifest and event timeline |
| `PUT` | `/api/admin/tracking/:orderId` | Create/update tracking info (AWB, courier, status) |
| `POST` | `/api/admin/tracking/:orderId/events` | Append tracking milestone event |

### Reviews

| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/admin/reviews` | List reviews with moderation filter |
| `PATCH` | `/api/admin/reviews/:id/status` | Approve or reject review |
| `POST` | `/api/products/:slug/reviews` | Public: submit product review |

### Contact Enquiries

| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/admin/enquiries` | List contact enquiries |
| `PATCH` | `/api/admin/enquiries/:id` | Update status and add internal reply note |
| `DELETE` | `/api/admin/enquiries/:id` | Delete enquiry |
| `POST` | `/api/contact` | Public: submit contact form |

### Settings & Auth

| Method | Route | Description |
|:---|:---|:---|
| `GET` | `/api/admin/settings` | Retrieve admin settings |
| `PUT` | `/api/admin/settings` | Update store/order/inventory/shipping settings |
| `GET` | `/api/admin/users` | List admin users (SUPER_ADMIN only) |
| `POST` | `/api/admin/users` | Create admin user (SUPER_ADMIN only) |
| `PATCH` | `/api/admin/users/:id` | Update admin user role/status |
| `POST` | `/api/auth/signin` | Auth.js sign-in endpoint |
| `POST` | `/api/auth/signout` | Auth.js sign-out endpoint |

---

## 8. Environment Variable Requirements

### `.env.example`

```env
# ============================================================
# APPLICATION
# ============================================================
NEXT_PUBLIC_APP_URL="https://3dprintingwallah.com"
NODE_ENV="production"

# ============================================================
# DATABASE — Neon PostgreSQL (Serverless)
# ============================================================
DATABASE_URL="postgresql://neondb_owner:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# ============================================================
# AUTHENTICATION — Auth.js v5
# ============================================================
AUTH_SECRET="generate-with: openssl rand -hex 32"
AUTH_TRUST_HOST="true"

# ============================================================
# OBJECT STORAGE — Cloudflare R2
# ============================================================
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="newtronlabs-models"
R2_PUBLIC_DOMAIN="models.3dprintingwallah.com"

# ============================================================
# EMAIL SERVICES
# ============================================================
# Option A: Resend (recommended)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"

# Option B: SMTP fallback
SMTP_HOST="smtp.postmarkapp.com"
SMTP_PORT=587
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"

# Business email addresses
BUSINESS_EMAIL="support@newtronlabs.in"
NOTIFICATION_EMAIL="workshop@newtronlabs.in"
```

---

## 9. Free-Tier Cost Estimate

### Monthly Cost: **$0** (MVP phase)

| Service | Free Tier Allocation | Expected MVP Usage | Remaining Headroom |
|:---|:---|:---|:---|
| **Neon PostgreSQL** | 0.5 GiB storage, 191.9 compute-hours/month | ~50 MB data, ~20 compute-hours | ~90% headroom |
| **Cloudflare R2** | 10 GB storage, 1M Class A ops, 10M Class B ops | ~500 MB (models + images), ~5K ops | ~95% headroom |
| **Cloudflare Pages** | Unlimited requests, 500 builds/month | ~100 builds/month | ~80% headroom |
| **Auth.js v5** | Self-hosted (free) | — | Unlimited |
| **Resend Email** | 100 emails/day, 3,000/month | ~20-50 emails/month | ~98% headroom |

### When Paid Tier Is Needed

| Trigger | Threshold | Estimated Monthly Cost |
|:---|:---|:---|
| Neon storage exceeds 0.5 GiB | ~5,000+ products or ~50K orders with history | $19/mo (Neon Scale) |
| R2 storage exceeds 10 GB | ~200+ 50MB model files stored | $0.015/GB-month ($0.15/GB extra) |
| Email volume exceeds 100/day | ~100+ orders/day | $20/mo (Resend Pro) |
| Need staging/preview database branches under load | Before production launch | $0 (Neon branches are free) |

**Realistic projection**: the free tier will comfortably serve the first **6–12 months** of operation for a workshop processing 5–15 orders/day.

---

## 10. Migration Sequence

### Step-by-Step Plan

```
Phase 0: Infrastructure Setup (Day 1)
│
├── 1. Create Neon project (ap-southeast-1 region for India latency)
│   ├── Create production branch: `main`
│   └── Create development branch: `dev`
│
├── 2. Install dependencies
│   ├── pnpm add drizzle-orm @neondatabase/serverless @paralleldrive/cuid2
│   ├── pnpm add -D drizzle-kit
│   └── pnpm add next-auth@5 @auth/drizzle-adapter @node-rs/argon2
│
├── 3. Configure environment
│   ├── Add DATABASE_URL to .env.local
│   └── Add AUTH_SECRET to .env.local
│
Phase 1: Schema & Migration (Day 2)
│
├── 4. Create src/db/schema.ts (as defined in Section 5)
├── 5. Create src/db/index.ts (database client)
├── 6. Run initial migration
│   └── npx drizzle-kit push
│
Phase 2: Seed Data (Day 2-3)
│
├── 7. Seed categories from INITIAL_DEMO_CATEGORIES (category-service.ts)
│   └── Map 7 categories with their subcategories, slugs, display orders
│
├── 8. Seed products from @/data/products.ts
│   ├── Map each product to the new schema
│   ├── Create product_images records (from images[] array)
│   ├── Create product_specifications records (from specifications[] array)
│   └── Link each product to its category via category_id FK
│
├── 9. Create default admin user
│   ├── Email: admin@newtronlabs.in
│   ├── Role: SUPER_ADMIN
│   └── Password: hashed with Argon2id (prompt on first run)
│
Phase 3: Repository Swap (Day 3-5)
│
├── 10. Implement Drizzle-backed service classes
│   ├── src/services/db/drizzle-product-service.ts (implements IProductService)
│   ├── src/services/db/drizzle-category-service.ts (implements ICategoryService)
│   ├── src/services/db/drizzle-enquiry-service.ts (implements IEnquiryService)
│   ├── src/services/db/drizzle-inventory-service.ts (implements IInventoryService)
│   └── src/services/db/drizzle-auth-service.ts (implements IAuthService)
│
├── 11. Implement factory pattern for gradual swap
│   └── Each service export checks DATABASE_URL:
│
│       // src/services/product-service.ts
│       export const productService: IProductService = process.env.DATABASE_URL
│         ? new DrizzleProductService(db)
│         : new MockProductService();
│
Phase 4: Route-by-Route Migration (Day 5-10)
│
├── 12. Migrate public routes (highest impact first)
│   ├── POST /api/order-requests → write to Neon
│   ├── POST /api/custom-print-requests → write to Neon
│   ├── POST /api/contact → write to Neon
│   └── GET /api/order-requests?ref= → read from Neon
│
├── 13. Migrate admin routes
│   ├── /api/admin/orders/*
│   ├── /api/admin/products/*
│   ├── /api/admin/custom-prints/*
│   ├── /api/admin/inventory/*
│   ├── /api/admin/quotations/*
│   └── /api/admin/enquiries/*
│
├── 14. Migrate storefront reads
│   ├── Homepage featured products → db query
│   ├── Shop catalog with filters → db query
│   └── Product detail pages → db query
│
Phase 5: Auth Integration (Day 10-12)
│
├── 15. Configure Auth.js v5 with Drizzle adapter
├── 16. Build /admin/login page
├── 17. Enable middleware.ts route protection
└── 18. Remove development bypass auth (sessionStorage-based)
```

### Critical Migration Rules

1. **Preserve existing order reference IDs** — any orders created during the mock phase that are manually migrated must keep their `NWL-ORD-*` IDs. The `order_id` column has a `UNIQUE` constraint to prevent duplicates.

2. **Duplicate prevention** — the unique constraints on `products.sku`, `products.slug`, `customers.email`, `order_requests.order_id`, and `custom_print_requests.reference_id` ensure the seed script is idempotent. Use `ON CONFLICT DO NOTHING` or Drizzle's `onConflictDoNothing()`.

3. **Zero-downtime swap** — the factory pattern ensures the application continues to work with mock data if `DATABASE_URL` is not set. This allows gradual rollout without breaking the prototype.

4. **Customer upsert** — when an order comes in, upsert the customer by email. If a customer with that email exists, update their address/phone. If not, create a new customer record. This deduplicates the flat `CustomerOrderDetails` into a proper relational `customers` row.

---

## 11. Security Architecture

### Password Hashing

```typescript
import { hash, verify } from "@node-rs/argon2";

// Hash on registration/creation
const passwordHash = await hash(plaintext, {
  memoryCost: 19456,    // 19 MB
  timeCost: 2,          // 2 iterations
  outputLen: 32,        // 32 bytes
  parallelism: 1,
});

// Verify on login
const isValid = await verify(storedHash, candidatePassword);
```

**Algorithm**: Argon2id — winner of the Password Hashing Competition, resistant to both GPU and side-channel attacks. Preferred over bcrypt for new applications.

### Session Security

| Property | Value |
|:---|:---|
| Token type | JWT (signed with AUTH_SECRET via HS256) |
| Cookie name | `__Secure-next-auth.session-token` |
| `HttpOnly` | ✅ (not accessible via JavaScript) |
| `Secure` | ✅ (HTTPS only) |
| `SameSite` | `Lax` (protects against CSRF while allowing navigation) |
| Max age | 24 hours (configurable) |
| Rotation | On each request (sliding expiration) |

### Middleware Route Guards

All `/admin/*` and `/api/admin/*` routes are protected by the Auth.js middleware (Section 4). Unauthenticated requests are redirected to `/admin/login` (pages) or receive a `401 Unauthorized` response (API).

### RBAC Permission Matrix

Implemented as a utility function:

```typescript
// src/lib/permissions.ts
import { AdminRole } from "@/db/schema";

const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  WORKSHOP_LEAD: 80,
  SLICING_TECH: 60,
  BILLING: 50,
  SUPPORT: 20,
};

type Permission =
  | "orders:read" | "orders:write" | "orders:payment"
  | "products:read" | "products:write"
  | "inventory:read" | "inventory:write"
  | "custom-prints:read" | "custom-prints:write"
  | "quotations:read" | "quotations:write"
  | "reviews:read" | "reviews:write"
  | "enquiries:read" | "enquiries:write"
  | "settings:read" | "settings:write"
  | "users:read" | "users:write"
  | "analytics:read" | "analytics:export";

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: ["*"] as unknown as Permission[], // all permissions
  WORKSHOP_LEAD: [
    "orders:read", "orders:write", "orders:payment",
    "products:read", "products:write",
    "inventory:read", "inventory:write",
    "custom-prints:read", "custom-prints:write",
    "quotations:read", "quotations:write",
    "reviews:read", "reviews:write",
    "enquiries:read", "enquiries:write",
    "analytics:read", "analytics:export",
  ],
  SLICING_TECH: [
    "orders:read", "orders:write",
    "products:read",
    "inventory:read", "inventory:write",
    "custom-prints:read", "custom-prints:write",
    "quotations:read", "quotations:write",
    "reviews:read",
    "analytics:read",
  ],
  BILLING: [
    "orders:read", "orders:payment",
    "quotations:read", "quotations:write",
    "analytics:read", "analytics:export",
  ],
  SUPPORT: [
    "orders:read",
    "products:read",
    "custom-prints:read",
    "reviews:read", "reviews:write",
    "enquiries:read", "enquiries:write",
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  if ((perms as unknown as string[]).includes("*")) return true;
  return perms.includes(permission);
}
```

### API Request Validation

All API routes must validate request bodies using **Zod** schemas:

```typescript
import { z } from "zod";

export const createOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
    deliveryAddress: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pinCode: z.string().regex(/^\d{6}$/),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(100),
    selectedColor: z.string().optional(),
  })).min(1),
});
```

### CORS Configuration

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL! },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, PATCH, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },
};
```

### Rate Limiting Plan

For the MVP (Cloudflare Pages), rate limiting is enforced via **Cloudflare WAF rules** (free tier includes 5 custom rules):

| Route Pattern | Limit | Window |
|:---|:---|:---|
| `POST /api/order-requests` | 5 requests | per minute per IP |
| `POST /api/custom-print-requests` | 3 requests | per minute per IP |
| `POST /api/contact` | 3 requests | per minute per IP |
| `POST /api/auth/signin` | 5 attempts | per minute per IP |
| `POST /api/uploads/signed-url` | 10 requests | per minute per IP |

For the future paid tier, migrate to **Cloudflare Rate Limiting** (advanced rules with response-based triggers) or **Upstash Ratelimit** (`@upstash/ratelimit` with Redis).

---

## 12. Backup Strategy

### Neon PostgreSQL — Point-in-Time Recovery

| Feature | Free Tier | Scale Plan ($19/mo) |
|:---|:---|:---|
| Retention window | 7 days | 30 days |
| Recovery granularity | Per-second | Per-second |
| Restore method | Console → Restore to new branch | Console / API |

Neon automatically maintains a continuous backup via its log-structured storage engine. No manual backup configuration is required.

**Recovery procedure**:
1. Navigate to Neon Console → Project → Branches
2. Click "Restore" on the target branch
3. Select the point-in-time to restore to
4. Neon creates a new branch from that point
5. Verify data, then promote the restored branch

### Cloudflare R2 — Object Versioning

Enable bucket versioning to protect against accidental overwrites or deletions:

```bash
# Enable versioning via Wrangler CLI
wrangler r2 bucket update newtronlabs-models --versioning enabled
```

| Feature | Behavior |
|:---|:---|
| Overwrite protection | Previous versions retained; retrievable by version ID |
| Delete protection | Delete markers added; actual objects retained |
| Lifecycle rules | Auto-expire non-current versions after 30 days to manage storage |

### Schema Version Control

All schema changes are tracked via Drizzle migrations in `drizzle/migrations/`:

```
drizzle/
├── migrations/
│   ├── 0000_init_schema.sql
│   ├── 0001_add_payments_table.sql
│   └── meta/
│       ├── 0000_snapshot.json
│       └── 0001_snapshot.json
└── drizzle.config.ts
```

**Rules**:
- Migrations are committed to Git alongside application code
- Never edit a migration after it has been applied to production
- Use `drizzle-kit generate` to create new migration files from schema changes
- Use `drizzle-kit push` for development; `drizzle-kit migrate` for production

---

## 13. Risks & Trade-Offs

### Risk Matrix

| Risk | Severity | Likelihood | Mitigation |
|:---|:---:|:---:|:---|
| **Neon free-tier compute exhaustion** | High | Medium | Monitor via Neon dashboard; auto-suspend scales to 0 when idle; upgrade to Scale ($19/mo) if consistently hitting 191 compute-hours |
| **Neon cold starts** | Medium | High | First request after idle timeout (~5 min) adds 300–500ms latency. Mitigation: use Neon's `@neondatabase/serverless` HTTP driver (no TCP connection overhead); accept cold starts for admin panel; for storefront, consider ISR/SSG for product pages |
| **Cloudflare R2 vendor coupling** | Medium | Low | R2 is S3-compatible; migration to AWS S3 or Backblaze B2 requires only endpoint + credentials change. Keep `IObjectStorageAdapter` interface for portability |
| **Migration complexity** | High | Medium | Phased rollout via factory pattern; keep mock services as fallback; test with Neon branch before applying to `main` branch |
| **No staging environment on free tier** | Medium | High | Neon branches serve as free staging databases; use Cloudflare Pages preview deployments (automatic per PR) pointing to Neon dev branch |
| **Data loss during migration** | High | Low | Mock data is ephemeral (in-memory/localStorage). Only risk is losing orders placed during transition. Mitigation: announce maintenance window; manually migrate any in-flight orders |
| **Auth.js edge compatibility** | Medium | Low | Auth.js v5 supports Edge Runtime. Verify that `@node-rs/argon2` works in Cloudflare Workers (may need `argon2-browser` or `bcrypt` fallback for edge-only environments) |
| **Single-region latency** | Low | Medium | Neon project in `ap-southeast-1` (Singapore) gives ~40ms latency to India. If latency is an issue, consider Neon's read replicas (paid) or ISR caching for storefront reads |
| **Free email limits** | Low | Low | Resend free tier allows 100 emails/day (3,000/month). Sufficient for MVP. Upgrade to Pro ($20/mo) if volume exceeds this |
| **R2 storage growth** | Low | Low | 10 GB free tier is generous. At 50 MB per model file, that's ~200 uploads. Implement lifecycle rules to archive old model files after 90 days |

### Key Design Trade-Offs

| Decision | Trade-off | Rationale |
|:---|:---|:---|
| Neon over Supabase | Lose built-in auth (Supabase Auth) | Auth.js is more flexible, avoids GoTrue vendor lock-in, and the Drizzle adapter is first-class |
| Neon over D1 | Lose edge-native latency | D1's SQLite lacks arrays, enums, jsonb, and proper transactions — the schema would require extensive workarounds |
| Drizzle over Prisma | Smaller community, newer ecosystem | Prisma's binary engine is incompatible with Cloudflare Workers (the deployment target) |
| CUID2 over UUID | Slightly longer IDs (25 chars) | Collision-resistant, sortable, URL-safe, and consistent with existing codebase ID generation patterns |
| Decimal columns for prices | Requires explicit parsing in TypeScript (Drizzle returns strings) | Avoids floating-point rounding errors for financial calculations (critical for invoicing/quotations) |
| Enquiry-based order lifecycle (no auto-deduct) | Stock may show incorrect availability until admin reviews | Matches the workshop's real-world workflow — orders are manually reviewed and confirmed before production |

---

*End of Database Architecture Proposal*
