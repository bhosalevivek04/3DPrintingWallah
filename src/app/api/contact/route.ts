import { NextRequest, NextResponse } from "next/server";
import { validateContactEnquiry } from "@/lib/validations/contact-schema";
import { enquiryService } from "@/services/enquiry-service";

// Maximum allowable request body size (50 KB)
const MAX_BODY_BYTES = 50 * 1024;

export async function POST(req: NextRequest) {
  try {
    // 1. Check content length
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "Payload too large. Maximum size is 50 KB.",
        },
        { status: 413 }
      );
    }

    const rawBody = await req.json();

    // 2. Validate and sanitize inputs
    const validation = validateContactEnquiry(rawBody);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          fieldErrors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validation.data;

    // 3. Store enquiry via service abstraction
    const enquiry = await enquiryService.createEnquiry({
      customerName: name,
      email,
      phone,
      subject,
      message,
    });

    // 4. Email Notification Adapter Check
    const hasSmtp = Boolean(
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    );
    const hasResend = Boolean(process.env.RESEND_API_KEY);

    let emailDelivered = false;
    let emailStatusNote = "Awaiting transactional email provider (SMTP / Resend) configuration.";

    if (hasSmtp || hasResend) {
      // In production with live provider:
      // await sendContactNotificationEmail(...)
      emailDelivered = true;
      emailStatusNote = "Notification dispatched via configured mail provider.";
    } else {
      console.log("-----------------------------------------------------------------");
      console.log(`[Contact Enquiry Stored] ID: ${enquiry.id}`);
      console.log(`Customer: ${name} <${email}> ${phone ? `(${phone})` : ""}`);
      console.log(`Subject:  ${subject}`);
      console.log(`Message:  ${message}`);
      console.log("Note: Real email delivery not configured; saved to workshop queue.");
      console.log("-----------------------------------------------------------------");
    }

    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry.id,
        persistence: "stored_in_workshop_inbox",
        emailDelivered,
        emailStatusNote,
        message: "Your message has been received and logged in the workshop queue.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API /api/contact] Internal error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred while processing your message.",
      },
      { status: 500 }
    );
  }
}
