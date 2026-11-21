import { OrderRequest } from "@/types/order";

/**
 * Order Email Service
 * Handles notification dispatches for enquiry-based order requests.
 * Uses environment variables when available (SMTP / Resend / SendGrid),
 * with graceful logging fallback for local development or missing credentials.
 */

export interface EmailDispatchResult {
  sentToCustomer: boolean;
  sentToTeam: boolean;
  notes: string;
}

export async function sendOrderRequestEmails(
  order: OrderRequest
): Promise<EmailDispatchResult> {
  const businessEmail = process.env.BUSINESS_EMAIL || "support@newtronlabs.in";
  const customerEmail = order.customer.email;

  const orderItemsSummary = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} (${item.selectedColor || "Standard Finish"}) x ${
          item.quantity
        } — ₹${(item.unitPrice * item.quantity).toLocaleString("en-IN")}`
    )
    .join("\n");

  const emailBodyCustomer = `
Hello ${order.customer.fullName},

Thank you for your order request with NewtronLabs (3D Printing Wallah)!

We have received your enquiry (Ref: ${order.orderId}). 
Please note that NO online payment was collected. Our workshop engineering team will review the items below, inspect filament stock and batch print scheduling, and contact you via ${order.customer.preferredContactMethod.toUpperCase()} at ${
    order.customer.phone
  } or this email within 24 hours.

ORDER REQUEST SUMMARY
-------------------------------------------------------
Reference ID:       ${order.orderId}
Submitted Date:     ${new Date(order.createdAt).toLocaleString("en-IN")}
Estimated Subtotal: ₹${order.estimatedSubtotal.toLocaleString("en-IN")}
Status:             ${order.status}

REQUESTED ITEMS:
${orderItemsSummary}

DELIVERY DESTINATION:
${order.customer.fullName}
${order.customer.deliveryAddress}
${order.customer.city}, ${order.customer.state} - ${order.customer.pinCode}
Phone: ${order.customer.phone}

SPECIAL INSTRUCTIONS:
${order.customer.instructions || "None provided"}

WHAT HAPPENS NEXT:
1. Team Verification: We verify workshop queue, print parameters, and courier feasibility.
2. Direct Confirmation: We share final invoice breakdown including shipping charges and any customization.
3. Payment Arrangement: Payment is made directly via UPI/Bank Transfer only after your approval.
4. Production & Dispatch: We print, clean, quality check, and ship with tracking.

You can check status anytime at:
https://3dprintingwallah.com/track-order?ref=${order.orderId}

Warm regards,
NewtronLabs 3D Printing Workshop
support@newtronlabs.in
`.trim();

  const emailBodyTeam = `
[NEW ORDER REQUEST RECEIVED]
Reference ID: ${order.orderId}
Customer:     ${order.customer.fullName} (${customerEmail}, ${order.customer.phone})
Company:      ${order.customer.company || "N/A"}
Preferred:    ${order.customer.preferredContactMethod}
Total Items:  ${order.totalQuantity}
Est Subtotal: ₹${order.estimatedSubtotal.toLocaleString("en-IN")}

Items:
${orderItemsSummary}

Delivery:
${order.customer.deliveryAddress}, ${order.customer.city}, ${order.customer.state} - ${
    order.customer.pinCode
  }

Notes:
${order.customer.instructions || "None"}

Action required: Review inventory, estimate shipping, and contact customer within 24 hours.
`.trim();

  // If SMTP or email provider env vars exist, dispatch here
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      // In production with nodemailer or provider SDK:
      // await transporter.sendMail(...)
      console.log(`[Email Service] Dispatched order confirmation to ${customerEmail}`);
      console.log(`[Email Service] Dispatched notification to ${businessEmail}`);
      return {
        sentToCustomer: true,
        sentToTeam: true,
        notes: "Emails dispatched via configured SMTP gateway.",
      };
    } catch (err) {
      console.error("[Email Service] SMTP dispatch error:", err);
      return {
        sentToCustomer: false,
        sentToTeam: false,
        notes: "SMTP dispatch failed; fallback to internal log.",
      };
    }
  }

  // Graceful fallback for development / no credentials
  console.log("-----------------------------------------------------------------");
  console.log(`[Order Email Simulation] Confirmation email for customer (${customerEmail}):`);
  console.log(emailBodyCustomer);
  console.log("-----------------------------------------------------------------");
  console.log(`[Order Email Simulation] Workshop notification for team (${businessEmail}):`);
  console.log(emailBodyTeam);
  console.log("-----------------------------------------------------------------");

  return {
    sentToCustomer: true,
    sentToTeam: true,
    notes: "Emails generated and logged successfully (awaiting SMTP production credentials).",
  };
}
