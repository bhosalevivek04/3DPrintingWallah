import { NextRequest, NextResponse } from "next/server";
import {
  CustomPrintSubmissionPayload,
  CustomPrintRequest,
  SubmissionResponse,
} from "@/types/custom-print";

// Server-side in-memory repository for requests in development/prototype
// Ready to be backed by PostgreSQL, Supabase, or MongoDB in production
const requestsStore = new Map<string, CustomPrintRequest>();

function generateReferenceId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `NWL-REQ-${year}${month}${day}-${randomSuffix}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // Accepts Indian 10-digit, with optional +91 or standard international formats (min 10 digits)
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15 && /^\d+$/.test(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CustomPrintSubmissionPayload;

    // 1. Validate Model File Metadata
    if (!body.modelFile || !body.modelFile.name) {
      return NextResponse.json<SubmissionResponse>(
        {
          success: false,
          message: "Validation failed: 3D model file is required.",
          error: "Missing model file",
        },
        { status: 400 }
      );
    }

    if (body.modelFile.size > 50 * 1024 * 1024) {
      return NextResponse.json<SubmissionResponse>(
        {
          success: false,
          message: "Validation failed: Model file size exceeds the 50 MB limit.",
          error: "File size exceeds 50 MB limit",
        },
        { status: 400 }
      );
    }

    // 2. Validate Requirements
    if (!body.requirements || typeof body.requirements.quantity !== "number" || body.requirements.quantity < 1) {
      return NextResponse.json<SubmissionResponse>(
        {
          success: false,
          message: "Validation failed: Minimum order quantity must be at least 1.",
          error: "Invalid quantity",
        },
        { status: 400 }
      );
    }

    // 3. Validate Customer Details
    const { customer } = body;
    if (!customer) {
      return NextResponse.json<SubmissionResponse>(
        {
          success: false,
          message: "Validation failed: Customer details are missing.",
          error: "Missing customer details",
        },
        { status: 400 }
      );
    }

    if (!customer.fullName || customer.fullName.trim().length < 2) {
      return NextResponse.json<SubmissionResponse>(
        {
          success: false,
          message: "Validation failed: Please provide your full name.",
          error: "Invalid name",
        },
        { status: 400 }
      );
    }

    if (!customer.email || !isValidEmail(customer.email)) {
      return NextResponse.json<SubmissionResponse>(
        {
          success: false,
          message: "Validation failed: Please provide a valid email address.",
          error: "Invalid email",
        },
        { status: 400 }
      );
    }

    if (!customer.phone || !isValidPhone(customer.phone)) {
      return NextResponse.json<SubmissionResponse>(
        {
          success: false,
          message: "Validation failed: Please provide a valid 10-digit phone number.",
          error: "Invalid phone number",
        },
        { status: 400 }
      );
    }

    if (!customer.consentGiven) {
      return NextResponse.json<SubmissionResponse>(
        {
          success: false,
          message: "Validation failed: You must accept the quotation contact consent.",
          error: "Consent not given",
        },
        { status: 400 }
      );
    }

    // 4. Generate Unique Request Reference ID
    let referenceId = generateReferenceId();
    while (requestsStore.has(referenceId)) {
      referenceId = generateReferenceId();
    }

    const timestamp = Date.now();
    const newRequest: CustomPrintRequest = {
      id: referenceId,
      referenceId,
      status: "submitted",
      modelFile: body.modelFile,
      referenceImages: body.referenceImages,
      requirements: body.requirements,
      customer: {
        ...customer,
        fullName: customer.fullName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
      },
      createdAt: timestamp,
      updatedAt: timestamp,
      estimatedQuotationHours: 24,
    };

    // Store request record
    requestsStore.set(referenceId, newRequest);

    return NextResponse.json<SubmissionResponse>(
      {
        success: true,
        referenceId,
        message: "Your custom printing request has been submitted successfully!",
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Custom print request error:", err);
    return NextResponse.json<SubmissionResponse>(
      {
        success: false,
        message: "An unexpected server error occurred while processing your request. Please try again.",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");

  if (!ref) {
    return NextResponse.json(
      { error: "Reference ID query parameter (?ref=...) is required." },
      { status: 400 }
    );
  }

  const found = requestsStore.get(ref.toUpperCase().trim());
  if (!found) {
    return NextResponse.json(
      { error: `No custom printing request found with reference ID "${ref}".` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    request: found,
  });
}
