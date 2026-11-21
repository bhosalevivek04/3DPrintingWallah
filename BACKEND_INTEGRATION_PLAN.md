# NewtronLabs Backend & Database Integration Plan (BACKEND_INTEGRATION_PLAN.md)

> Comprehensive Architectural Blueprint for Next-Phase Production Backend: Database Schemas, Object Storage, Admin Operations APIs, RBAC Security, Audit Logging, and Notification Pipelines.

---

## 1. Database Architecture & Entity Relationships

The recommended relational database is **PostgreSQL** (hosted via Supabase, AWS RDS, or Neon Serverless) managed through **Prisma ORM** or **Drizzle ORM**.

```mermaid
erDiagram
    ADMIN_USER ||--o{ AUDIT_LOG : generates
    ADMIN_USER ||--o{ INTERNAL_NOTE : writes
    CUSTOMER ||--o{ ORDER_REQUEST : places
    CUSTOMER ||--o{ CUSTOM_PRINT_REQUEST : submits
    ORDER_REQUEST ||--|{ ORDER_ITEM : contains
    ORDER_REQUEST ||--o{ STATUS_HISTORY : tracks
    ORDER_REQUEST ||--o| ORDER_TRACKING : dispatches
    ORDER_REQUEST ||--o| QUOTATION : generates
    CUSTOM_PRINT_REQUEST ||--o| QUOTATION : generates
    CUSTOM_PRINT_REQUEST ||--|{ MODEL_FILE : uploads
    PRODUCT ||--o{ ORDER_ITEM : referenced_by
    PRODUCT ||--o{ STOCK_ADJUSTMENT_LOG : audits
    PRODUCT ||--o{ PRODUCT_REVIEW : receives
    CATEGORY ||--o{ PRODUCT : classifies
```

### Complete Prisma Schema Definitions

```prisma
// ------------------------------------------
// 1. Admin Users & RBAC
// ------------------------------------------
enum AdminRole {
  SUPER_ADMIN
  WORKSHOP_LEAD
  SLICING_TECHNICIAN
  CUSTOMER_SUPPORT
  BILLING_OPERATOR
}

model AdminUser {
  id            String       @id @default(cuid())
  email         String       @unique
  passwordHash  String
  name          String
  role          AdminRole    @default(WORKSHOP_LEAD)
  avatarUrl     String?
  isActive      Boolean      @default(true)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  internalNotes InternalNote[]
  auditLogs     AuditLog[]
}

// ------------------------------------------
// 2. Customers
// ------------------------------------------
model Customer {
  id                  String               @id @default(cuid())
  email               String               @unique
  fullName            String
  phone               String
  company             String?
  deliveryAddress     String?
  city                String?
  state               String?
  pinCode             String?
  internalNotes       String?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  orders              OrderRequest[]
  customPrints        CustomPrintRequest[]
  reviews             ProductReview[]
}

// ------------------------------------------
// 3. Products & Categories
// ------------------------------------------
enum ProductAvailability {
  IN_STOCK
  LOW_STOCK
  OUT_OF_STOCK
  MADE_TO_ORDER
}

model Category {
  id           String       @id @default(cuid())
  name         String       @unique
  slug         String       @unique
  description  String
  image        String
  displayOrder Int          @default(1)
  isActive     Boolean      @default(true)
  subcategories String[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  products     Product[]
}

model Product {
  id                  String               @id @default(cuid())
  sku                 String               @unique
  slug                String               @unique
  name                String
  categoryId          String
  category            Category             @relation(fields: [categoryId], references: [id])
  subcategory         String?
  tagline             String
  shortDescription    String
  description         String
  price               Int                  // stored in whole INR
  originalPrice       Int?
  priceDisplay        String
  availability        ProductAvailability  @default(IN_STOCK)
  trackInventory      Boolean              @default(true)
  stockQuantity       Int                  @default(10)
  lowStockThreshold   Int                  @default(5)
  allowBackorders     Boolean              @default(false)
  featured            Boolean              @default(false)
  bestseller          Boolean              @default(false)
  newArrival          Boolean              @default(false)
  images              String[]
  imageAlt            String
  badge               String?
  rating              Float?               @default(5.0)
  reviewCount         Int                  @default(0)
  material            String?
  dimensions          String?
  weight              String?
  printingTechnology  String?
  finish              String?
  colors              String[]
  tags                String[]
  specifications      Json?
  productionTime      String?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  orderItems          OrderItem[]
  adjustmentLogs      StockAdjustmentLog[]
  reviews             ProductReview[]
}

// ------------------------------------------
// 4. Order Requests & 12-Step Lifecycle
// ------------------------------------------
enum OrderStatus {
  REQUEST_SUBMITTED
  UNDER_REVIEW
  AWAITING_CUSTOMER_CONFIRMATION
  QUOTATION_SENT
  AWAITING_PAYMENT
  PAYMENT_CONFIRMED
  PROCESSING_IN_PRODUCTION
  QUALITY_CHECK
  READY_FOR_DISPATCH
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  AWAITING_PAYMENT
  PARTIALLY_PAID
  PAYMENT_CONFIRMED
  REFUNDED
}

model OrderRequest {
  id                    String            @id @default(cuid())
  orderId               String            @unique // e.g. NWL-ORD-20261121-7104
  customerId            String
  customer              Customer          @relation(fields: [customerId], references: [id])
  status                OrderStatus       @default(REQUEST_SUBMITTED)
  paymentStatus         PaymentStatus     @default(UNPAID)
  totalQuantity         Int
  estimatedSubtotal     Int
  shippingFee           Int               @default(0)
  grandTotal            Int
  paymentPolicyNote     String
  instructions          String?
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  items                 OrderItem[]
  statusHistory         StatusHistory[]
  internalNotes         InternalNote[]
  tracking              OrderTracking?
  quotation             Quotation?
}

model OrderItem {
  id             String       @id @default(cuid())
  orderRequestId String
  orderRequest   OrderRequest @relation(fields: [orderRequestId], references: [id], onDelete: Cascade)
  productId      String
  product        Product      @relation(fields: [productId], references: [id])
  name           String
  unitPrice      Int
  quantity       Int
  selectedColor  String?
  totalPrice     Int
}

model StatusHistory {
  id             String       @id @default(cuid())
  orderRequestId String
  orderRequest   OrderRequest @relation(fields: [orderRequestId], references: [id], onDelete: Cascade)
  status         OrderStatus
  note           String?
  updatedBy      String       // User name or webhook source
  timestamp      DateTime     @default(now())
}

model InternalNote {
  id             String        @id @default(cuid())
  orderRequestId String?
  orderRequest   OrderRequest? @relation(fields: [orderRequestId], references: [id], onDelete: Cascade)
  authorId       String
  author         AdminUser     @relation(fields: [authorId], references: [id])
  content        String
  createdAt      DateTime      @default(now())
}

// ------------------------------------------
// 5. Custom 3D Printing Submissions
// ------------------------------------------
enum CustomPrintStatus {
  SUBMITTED
  UNDER_REVIEW
  QUOTATION_PREPARED
  QUOTATION_SENT
  REQUIRES_INFO
  ACCEPTED
  IN_PRODUCTION
  COMPLETED
  CANCELLED
}

model CustomPrintRequest {
  id                    String            @id @default(cuid())
  referenceId           String            @unique // e.g. NWL-CP-20261120-9182
  customerId            String
  customer              Customer          @relation(fields: [customerId], references: [id])
  status                CustomPrintStatus @default(SUBMITTED)
  technology            String
  material              String
  color                 String
  surfaceFinish         String
  quantity              Int               @default(1)
  dimensions            Json
  additionalNotes       String?
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  files                 ModelFile[]
  quotation             Quotation?
}

model ModelFile {
  id                    String             @id @default(cuid())
  customPrintRequestId  String
  customPrint           CustomPrintRequest @relation(fields: [customPrintRequestId], references: [id], onDelete: Cascade)
  fileName              String
  extension             String
  mimeType              String
  sizeBytes             Int
  storageKey            String             // Cloudflare R2 bucket key
  downloadUrl           String
  uploadedAt            DateTime           @default(now())
}

// ------------------------------------------
// 6. Quotation Engine
// ------------------------------------------
enum QuotationStatus {
  DRAFT
  READY_FOR_REVIEW
  SENT
  ACCEPTED
  REJECTED
  EXPIRED
}

model Quotation {
  id                    String              @id @default(cuid())
  quotationNumber       String              @unique // e.g. NWL-QTN-202611-001
  orderRequestId        String?             @unique
  orderRequest          OrderRequest?       @relation(fields: [orderRequestId], references: [id])
  customPrintRequestId  String?             @unique
  customPrint           CustomPrintRequest? @relation(fields: [customPrintRequestId], references: [id])
  customerName          String
  customerEmail         String
  customerPhone         String
  company               String?
  materialCharge        Int                 @default(0)
  finishingCharge       Int                 @default(0)
  designCharge          Int                 @default(0)
  deliveryCharge        Int                 @default(0)
  subtotal              Int
  discount              Int                 @default(0)
  tax                   Int                 @default(0)
  grandTotal            Int
  validityDate          DateTime
  notes                 String?
  terms                 String
  status                QuotationStatus     @default(DRAFT)
  sentAt                DateTime?
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt

  items                 QuotationLineItem[]
}

model QuotationLineItem {
  id          String    @id @default(cuid())
  quotationId String
  quotation   Quotation @relation(fields: [quotationId], references: [id], onDelete: Cascade)
  title       String
  description String?
  quantity    Int       @default(1)
  unitPrice   Int
  total       Int
}

// ------------------------------------------
// 7. Order Tracking & Logistics
// ------------------------------------------
model OrderTracking {
  id                    String           @id @default(cuid())
  orderRequestId        String           @unique
  orderRequest          OrderRequest     @relation(fields: [orderRequestId], references: [id], onDelete: Cascade)
  trackingNumber        String
  courierName           String           // Delhivery, BlueDart, DTDC
  courierUrl            String?
  fulfillmentStatus     String           // Dispatched, In Transit, Out for Delivery, Delivered
  originLocation        String
  destinationCity       String
  dispatchDate          DateTime?
  estimatedDeliveryDate DateTime?
  actualDeliveryDate    DateTime?
  trackingNotes         String?
  updatedAt             DateTime         @updatedAt

  events                TrackingEvent[]
}

model TrackingEvent {
  id              String        @id @default(cuid())
  orderTrackingId String
  orderTracking   OrderTracking @relation(fields: [orderTrackingId], references: [id], onDelete: Cascade)
  status          String
  location        String
  note            String
  timestamp       DateTime      @default(now())
}

// ------------------------------------------
// 8. Reviews, Enquiries & Stock Audit
// ------------------------------------------
enum ReviewModerationStatus {
  PENDING
  APPROVED
  REJECTED
}

model ProductReview {
  id               String                 @id @default(cuid())
  productId        String
  product          Product                @relation(fields: [productId], references: [id])
  customerId       String?
  customer         Customer?              @relation(fields: [customerId], references: [id])
  customerName     String
  customerEmail    String
  rating           Int                    // 1-5
  title            String
  comment          String
  status           ReviewModerationStatus @default(PENDING)
  verifiedPurchase Boolean                @default(false)
  createdAt        DateTime               @default(now())
}

enum ContactEnquiryStatus {
  NEW
  IN_PROGRESS
  RESOLVED
}

model ContactEnquiry {
  id                String               @id @default(cuid())
  customerName      String
  email             String
  phone             String
  subject           String
  message           String
  status            ContactEnquiryStatus @default(NEW)
  internalReplyNote String?
  submittedAt       DateTime             @default(now())
  resolvedAt        DateTime?
}

model StockAdjustmentLog {
  id                 String   @id @default(cuid())
  productId          String
  product            Product  @relation(fields: [productId], references: [id])
  previousQuantity   Int
  adjustmentQuantity Int
  updatedQuantity    Int
  reason             String
  adjustedBy         String
  notes              String?
  timestamp          DateTime @default(now())
}

model AuditLog {
  id         String     @id @default(cuid())
  adminId    String
  admin      AdminUser  @relation(fields: [adminId], references: [id])
  action     String     // e.g. "ORDER_STATUS_CHANGED", "PRODUCT_ARCHIVED", "STOCK_ADJUSTED"
  entityType String     // "OrderRequest", "Product", "Quotation"
  entityId   String
  metadata   Json?
  timestamp  DateTime   @default(now())
}
```

---

## 2. Admin Authentication & Role-Based Access Control (RBAC)

### Technology Stack
- **NextAuth.js v5 (Auth.js)** with Credentials Provider and HTTP-only JWT session cookies.
- **Argon2id** or **bcrypt** password hashing.
- Role-based route middleware: `src/middleware.ts` guarding `/admin/*` and `/api/admin/*`.

### Permissions Matrix
| Action | SUPER_ADMIN | WORKSHOP_LEAD | SLICING_TECH | SUPPORT | BILLING |
| :--- | :---: | :---: | :---: | :---: | :---: |
| View Operations Dashboard | Yes | Yes | Yes | Yes | Yes |
| Manage Order Statuses | Yes | Yes | Yes | Read Only | Read Only |
| Confirm Payment Status | Yes | Yes | No | No | Yes |
| Slicing & CAD Inspection | Yes | Yes | Yes | Read Only | No |
| Create / Send Quotations | Yes | Yes | Yes | No | Yes |
| Adjust Inventory Quantities | Yes | Yes | Yes | No | No |
| Product Catalogue CRUD | Yes | Yes | Read Only | Read Only | No |
| Export Analytics CSV | Yes | Yes | No | No | Yes |
| Modify System Settings | Yes | No | No | No | No |

---

## 3. Proposed Admin API Endpoints

### Orders
- `GET /api/admin/orders`: List order requests with status, payment, and search filters.
- `GET /api/admin/orders/:id`: Full details with snapshot items, status history, and notes.
- `PATCH /api/admin/orders/:id/status`: Update order status through the 12-stage lifecycle.
- `PATCH /api/admin/orders/:id/payment`: Update separate payment status.
- `POST /api/admin/orders/:id/notes`: Append internal technician note.

### Custom 3D Printing
- `GET /api/admin/custom-prints`: List model submissions with CAD metadata.
- `GET /api/admin/custom-prints/:id`: Slicing parameters, material requirements, notes.
- `PATCH /api/admin/custom-prints/:id/status`: Update status (e.g. `requires_info`, `accepted`).
- `GET /api/admin/custom-prints/:id/download`: Generate presigned R2 download URL.

### Quotations
- `POST /api/admin/quotations`: Create itemized quotation from order or CAD submission.
- `GET /api/admin/quotations/:id`: Retrieve quote with printable structure.
- `PATCH /api/admin/quotations/:id/status`: Update quote status (`Sent`, `Accepted`, `Rejected`).
- `POST /api/admin/quotations/:id/send`: Dispatch customer email with PDF attachment.

### Inventory & Products
- `GET /api/admin/inventory`: Current stock levels, low-stock threshold flags.
- `POST /api/admin/inventory/adjust`: Log manual stock +/- delta with reason and operator name.
- `POST /api/admin/products`: Create product.
- `PUT /api/admin/products/:id`: Update price, images, filament colors, specs.
- `POST /api/admin/products/:id/duplicate`: Clone product.
- `DELETE /api/admin/products/:id`: Archive product.

### Tracking & Logistics
- `GET /api/admin/tracking/:orderId`: Retrieve dispatch manifest and waypoints.
- `PUT /api/admin/tracking/:orderId`: Update AWB, courier name, and current status.
- `POST /api/admin/tracking/:orderId/events`: Append tracking milestone.

### Reviews & Enquiries
- `GET /api/admin/reviews`: List reviews with pending moderation filter.
- `PATCH /api/admin/reviews/:id/status`: Approve or reject review.
- `GET /api/admin/enquiries`: Contact messages.
- `PATCH /api/admin/enquiries/:id`: Update status and internal reply notes.

---

## 4. Cloudflare R2 Model Storage Strategy

1. **Client requests presigned URL**: Customer drops `.stl`, `.step`, or `.obj` file on `/custom/3d-printing`.
2. **Server generates URL**: `POST /api/custom-prints/upload-url` returns a short-lived presigned PUT URL pointing to private bucket `newtronlabs-models`.
3. **Direct upload**: Browser uploads file directly to Cloudflare R2 (avoiding server payload limits).
4. **Metadata record**: Browser sends file metadata, file size, hash, and printing requirements to server.
5. **Admin download**: Technician retrieves authenticated, presigned GET link via `/admin/custom-prints`.
