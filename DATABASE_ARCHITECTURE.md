# Database Architecture Blueprint: Neon PostgreSQL & Prisma ORM

**Project:** NewtronLabs / 3D Printing Wallah  
**Primary Database:** Neon PostgreSQL (Serverless)  
**ORM / Data Access Layer:** Prisma ORM with `@prisma/adapter-neon`  
**Runtime:** Cloudflare Workers (Edge V8) & Node.js 20+  
**Status:** Architectural Blueprint & Repository Integration Design  

---

## 1. Architectural Overview

The NewtronLabs data layer connects serverless edge workers (Cloudflare Workers) to a scalable relational engine (Neon PostgreSQL) via WebSocket/HTTP connection pooling.

```mermaid
graph TD
    subgraph Client Layer
        Browser[Client Browser]
        AdminApp[Admin Operations UI]
    end

    subgraph Edge Layer [Cloudflare Workers]
        AppRouter[Next.js App Router]
        RepoFactory[Repository Service Factory]
        PrismaClient[Prisma Client + Neon Adapter]
    end

    subgraph Data Layer [Neon Cloud]
        NeonPooler[PgBouncer Serverless Connection Pooler]
        NeonCompute[Neon PostgreSQL Primary Compute]
        NeonStorage[Neon Storage Engine Page-Servers]
    end

    Browser -->|HTTPS| AppRouter
    AdminApp -->|HTTPS + Auth Session| AppRouter
    AppRouter --> RepoFactory
    RepoFactory --> PrismaClient
    PrismaClient -->|WebSockets / HTTP SSL| NeonPooler
    NeonPooler --> NeonCompute
    NeonCompute --> NeonStorage
```

---

## 2. Serverless Connection Management

### The Connection Challenge on Edge Runtimes
Cloudflare Workers spin up thousands of ephemeral instances on demand. If every worker opens a direct TCP connection to a PostgreSQL database, the connection limit (typically 100 on standard PostgreSQL) would be exhausted within seconds.

### The Solution: Two-Tier Connection Strategy
1. **Runtime API Queries (Cloudflare Workers):**
   Connects via Neon's pooled endpoint (`-pooler.neon.tech`) using `@neondatabase/serverless` over WebSockets. Connections are multiplexed via PgBouncer.
2. **Schema Migrations & CLI Tooling (`npx prisma migrate`):**
   Connects via direct session endpoint (`DIRECT_URL`) using standard TCP from development workstations or CI/CD build environments.

### Environment Configuration:
```env
# Pooled connection string for runtime application queries (via PgBouncer)
DATABASE_URL="postgresql://user:password@ep-cool-dawn-123456-pooler.us-east-2.aws.neon.tech/newtronlabs?sslmode=require&pgbouncer=true"

# Direct connection string for Prisma migrations & schema changes
DIRECT_URL="postgresql://user:password@ep-cool-dawn-123456.us-east-2.aws.neon.tech/newtronlabs?sslmode=require"
```

---

## 3. Zero-Breaking-Change Repository Integration

The existing application is structured around TypeScript service contracts:
- `IProductService` in `src/services/product-service.ts`
- `IEnquiryService` in `src/services/enquiry-service.ts`
- `IInventoryService` in `src/services/inventory-service.ts`
- `ICategoryService` in `src/services/category-service.ts`
- `IAuthService` in `src/services/auth-service.ts`

### The Factory Switcher Pattern
To maintain full backwards compatibility with development environments and prevent regressions during database rollout, services will implement the Factory Switcher pattern:

```typescript
// src/services/product-service.ts
import { IProductService } from "@/types/services";
import { MockProductService } from "./mock/mock-product-service";
import { PrismaProductService } from "./db/prisma-product-service";

// Factory returns Prisma implementation when DATABASE_URL is configured,
// and gracefully falls back to Mock implementation for local offline prototyping.
export const productService: IProductService = process.env.DATABASE_URL
  ? new PrismaProductService()
  : new MockProductService();
```

---

## 4. Query Performance & Indexing Strategy

To guarantee sub-50ms query latency across the catalog and admin dashboard:

1. **Unique Lookups:**
   - `Product.slug` (`UNIQUE INDEX idx_product_slug`)
   - `OrderRequest.orderId` (`UNIQUE INDEX idx_order_ref`)
   - `CustomPrintRequest.referenceId` (`UNIQUE INDEX idx_custom_print_ref`)
   - `Customer.email` (`UNIQUE INDEX idx_customer_email`)

2. **Catalog Filtering & Sorting:**
   - Composite index on `(category_id, availability, price)` for catalog filtering.
   - Partial index on active products: `WHERE available = true`.

3. **Admin Queue Operations:**
   - Composite index on `(status, created_at DESC)` for `OrderRequest` and `CustomPrintRequest`.
   - Partial index for pending moderation: `ProductReview WHERE status = 'PENDING'`.
   - Index on `ContactEnquiry(status, submitted_at DESC)`.

---

## 5. ACID Transaction Safety

1. **Atomic Order Requests:**
   Creating an order request with multiple items and status history uses `prisma.$transaction`:
   ```typescript
   await prisma.$transaction(async (tx) => {
     const order = await tx.orderRequest.create({ data: orderData });
     await tx.orderRequestItem.createMany({ data: itemsData });
     await tx.orderStatusHistory.create({ data: initialHistoryData });
     return order;
   });
   ```
2. **Explicit Business Rule: No Inventory Deduction on Submission:**
   Order requests are enquiry-based. Inventory is **not** subtracted during customer submission. Stock is only deducted when an authorized workshop operator confirms payment or updates status to `Processing / In Production`.
