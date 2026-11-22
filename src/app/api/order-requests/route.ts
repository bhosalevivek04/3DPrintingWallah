import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product-service";
import {
  CreateOrderRequestPayload,
  OrderRequest,
  OrderRequestResponse,
} from "@/types/order";
import { CartItem } from "@/types/cart";
import { sendOrderRequestEmails, EmailDispatchResult } from "@/lib/email/order-email-service";

// In-memory order requests repository for active instance/prototype
// Global object attached for development HMR persistence
const globalOrders = global as unknown as {
  __orderRequestsStore?: Map<string, OrderRequest>;
};

if (!globalOrders.__orderRequestsStore) {
  globalOrders.__orderRequestsStore = new Map<string, OrderRequest>();
}

export const ordersStore = globalOrders.__orderRequestsStore;

function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `NWL-ORD-${year}${month}${day}-${randomSuffix}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15 && /^\d+$/.test(cleaned);
}

function isValidPinCode(pin: string): boolean {
  const cleaned = pin.replace(/\s/g, "");
  return /^\d{6}$/.test(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateOrderRequestPayload;

    // 1. Validate Customer Details
    const { customer, items: rawItems } = body;
    if (!customer) {
      return NextResponse.json<OrderRequestResponse>(
        {
          success: false,
          message: "Validation failed: Customer details are required.",
          error: "Missing customer details",
        },
        { status: 400 }
      );
    }

    if (!customer.fullName || customer.fullName.trim().length < 2) {
      return NextResponse.json<OrderRequestResponse>(
        {
          success: false,
          message: "Validation failed: Please provide your full name (minimum 2 characters).",
          error: "Invalid full name",
        },
        { status: 400 }
      );
    }

    if (!customer.email || !isValidEmail(customer.email.trim())) {
      return NextResponse.json<OrderRequestResponse>(
        {
          success: false,
          message: "Validation failed: Please provide a valid email address.",
          error: "Invalid email",
        },
        { status: 400 }
      );
    }

    if (!customer.phone || !isValidPhone(customer.phone.trim())) {
      return NextResponse.json<OrderRequestResponse>(
        {
          success: false,
          message: "Validation failed: Please provide a valid 10-digit phone number.",
          error: "Invalid phone number",
        },
        { status: 400 }
      );
    }

    if (!customer.deliveryAddress || customer.deliveryAddress.trim().length < 5) {
      return NextResponse.json<OrderRequestResponse>(
        {
          success: false,
          message: "Validation failed: Please provide a complete delivery address.",
          error: "Invalid address",
        },
        { status: 400 }
      );
    }

    if (!customer.city || customer.city.trim().length < 2) {
      return NextResponse.json<OrderRequestResponse>(
        {
          success: false,
          message: "Validation failed: Please provide your city.",
          error: "Invalid city",
        },
        { status: 400 }
      );
    }

    if (!customer.state || customer.state.trim().length < 2) {
      return NextResponse.json<OrderRequestResponse>(
        {
          success: false,
          message: "Validation failed: Please provide your state.",
          error: "Invalid state",
        },
        { status: 400 }
      );
    }

    if (!customer.pinCode || !isValidPinCode(customer.pinCode.trim())) {
      return NextResponse.json<OrderRequestResponse>(
        {
          success: false,
          message: "Validation failed: Please provide a valid 6-digit PIN code.",
          error: "Invalid PIN code",
        },
        { status: 400 }
      );
    }

    // 2. Validate Items
    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json<OrderRequestResponse>(
        {
          success: false,
          message: "Validation failed: Cart has no items to create an order request.",
          error: "Empty items list",
        },
        { status: 400 }
      );
    }

    // 3. Server-side product lookup and verification (prevents client price forgery)
    const verifiedItems: CartItem[] = [];
    let calculatedSubtotal = 0;
    let totalQuantity = 0;

    for (const rawItem of rawItems) {
      const canonicalProduct = await productService.getProductById(rawItem.productId);
      if (!canonicalProduct) {
        return NextResponse.json<OrderRequestResponse>(
          {
            success: false,
            message: `Validation failed: Product with ID "${rawItem.productId}" was not found.`,
            error: "Product not found",
          },
          { status: 400 }
        );
      }

      if (canonicalProduct.availability === "out_of_stock" && !canonicalProduct.allowBackorders) {
        return NextResponse.json<OrderRequestResponse>(
          {
            success: false,
            message: `Product "${canonicalProduct.name}" is currently out of stock.`,
            error: "Out of stock",
          },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Math.min(rawItem.quantity || 1, canonicalProduct.stockQuantity || 99));
      const unitPrice = canonicalProduct.price || 0;

      calculatedSubtotal += unitPrice * qty;
      totalQuantity += qty;

      verifiedItems.push({
        productId: canonicalProduct.id,
        slug: canonicalProduct.slug,
        name: canonicalProduct.name,
        category: canonicalProduct.category,
        image: canonicalProduct.images[0] || "/images/hero-workshop.webp",
        unitPrice,
        priceDisplay: canonicalProduct.priceDisplay,
        quantity: qty,
        availability: canonicalProduct.availability,
        maxAllowedQuantity: canonicalProduct.stockQuantity || 10,
        selectedColor: rawItem.selectedColor || canonicalProduct.colors?.[0] || "Standard Finish",
        material: canonicalProduct.material,
      });
    }

    // 4. Generate Order Reference ID
    let orderId = generateOrderId();
    while (ordersStore.has(orderId)) {
      orderId = generateOrderId();
    }

    const timestamp = Date.now();
    const newOrder: OrderRequest = {
      orderId,
      status: "Request Submitted",
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        company: customer.company?.trim() || undefined,
        deliveryAddress: customer.deliveryAddress.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pinCode: customer.pinCode.trim(),
        preferredContactMethod: customer.preferredContactMethod || "whatsapp",
        instructions: customer.instructions?.trim() || undefined,
      },
      items: verifiedItems,
      totalQuantity,
      estimatedSubtotal: calculatedSubtotal,
      paymentPolicyNote:
        "No online payment collected at checkout. Our workshop team will review the request, verify filament/materials, and contact you directly to confirm delivery and arrange payment.",
      createdAt: timestamp,
      updatedAt: timestamp,
      estimatedReviewHours: 24,
    };

    // Store in-memory
    ordersStore.set(orderId, newOrder);

    // 5. Send Email Notifications (Customer acknowledgment + Workshop team alert)
    let emailResult: EmailDispatchResult = {
      sentToCustomer: false,
      sentToTeam: false,
      provider: "unconfigured",
      status: "unconfigured",
      notes: "Email service not invoked.",
    };
    try {
      emailResult = await sendOrderRequestEmails(newOrder);
    } catch (emailErr) {
      console.warn("Email service notice:", emailErr);
    }

    return NextResponse.json<OrderRequestResponse>(
      {
        success: true,
        orderId,
        order: newOrder,
        emailResult,
        message: "Your order request has been received! Our workshop team will contact you shortly.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order request error:", err);
    return NextResponse.json<OrderRequestResponse>(
      {
        success: false,
        message: "An unexpected server error occurred while processing your order request. Please try again.",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  const email = searchParams.get("email");

  if (!ref && !email) {
    return NextResponse.json(
      { error: "Provide an Order Reference ID (?ref=NWL-ORD-...) to look up order tracking status." },
      { status: 400 }
    );
  }

  // 1. Reference ID Lookup with Sanitized Customer Projection
  if (ref) {
    const formattedRef = ref.toUpperCase().trim();
    const found = ordersStore.get(formattedRef);
    if (!found) {
      return NextResponse.json(
        { error: `No order request found matching reference ID "${ref}".` },
        { status: 404 }
      );
    }

    // Sanitize projection to protect customer PII
    const nameParts = found.customer.fullName.trim().split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastNameInitial = nameParts.length > 1 ? ` ${nameParts[nameParts.length - 1][0]}.` : "";

    const emailParts = found.customer.email.split("@");
    const maskedEmail = emailParts.length === 2
      ? `${emailParts[0].slice(0, 2)}***@${emailParts[1]}`
      : "Protected";

    const cleanPhone = found.customer.phone.replace(/\D/g, "");
    const maskedPhone = cleanPhone.length >= 4
      ? `***-***-${cleanPhone.slice(-4)}`
      : "Protected";

    const sanitizedOrder = {
      orderId: found.orderId,
      status: found.status,
      paymentStatus: found.paymentStatus,
      totalQuantity: found.totalQuantity,
      estimatedSubtotal: found.estimatedSubtotal,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      estimatedReviewHours: found.estimatedReviewHours,
      customer: {
        fullName: `${firstName}${lastNameInitial}`,
        email: maskedEmail,
        phone: maskedPhone,
        city: found.customer.city,
        state: found.customer.state,
        pinCode: found.customer.pinCode,
        preferredContactMethod: found.customer.preferredContactMethod,
      },
      items: found.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        category: i.category,
        selectedColor: i.selectedColor,
      })),
      courierName: found.courierName,
      trackingNumber: found.trackingNumber,
      dispatchDate: found.dispatchDate,
      estimatedDeliveryDate: found.estimatedDeliveryDate,
    };

    return NextResponse.json({ success: true, order: sanitizedOrder });
  }

  // 2. Unauthenticated email querying is restricted to protect customer privacy
  if (email) {
    return NextResponse.json(
      {
        error: "Direct email enumeration is disabled for customer privacy. Please enter your unique Order Reference ID (e.g. NWL-ORD-...) to track status.",
      },
      { status: 403 }
    );
  }
}
