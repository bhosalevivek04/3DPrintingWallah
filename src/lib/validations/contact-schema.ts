export interface ContactEnquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  // Strip control characters and trim
  return input
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

export function validateContactEnquiry(raw: unknown): ValidationResult<ContactEnquiryInput> {
  if (!raw || typeof raw !== "object") {
    return {
      success: false,
      errors: { form: "Invalid request payload format." },
    };
  }

  const obj = raw as Record<string, unknown>;
  const errors: Record<string, string> = {};

  // 1. Name validation
  const name = sanitizeString(obj.name);
  if (!name || name.length < 2) {
    errors.name = "Full name must be at least 2 characters long.";
  } else if (name.length > 100) {
    errors.name = "Full name cannot exceed 100 characters.";
  }

  // 2. Email validation
  const email = sanitizeString(obj.email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Please provide a valid email address.";
  } else if (email.length > 150) {
    errors.email = "Email cannot exceed 150 characters.";
  }

  // 3. Phone validation (optional)
  let phone: string | undefined = undefined;
  if (obj.phone !== undefined && obj.phone !== null && String(obj.phone).trim() !== "") {
    const rawPhone = sanitizeString(obj.phone);
    const cleaned = rawPhone.replace(/[\s\-\(\)\+]/g, "");
    if (cleaned.length < 10 || cleaned.length > 15 || !/^\d+$/.test(cleaned)) {
      errors.phone = "Please enter a valid phone number (10-15 digits).";
    } else {
      phone = rawPhone;
    }
  }

  // 4. Subject validation
  const subject = sanitizeString(obj.subject);
  if (!subject || subject.length < 2) {
    errors.subject = "Subject must be at least 2 characters.";
  } else if (subject.length > 200) {
    errors.subject = "Subject cannot exceed 200 characters.";
  }

  // 5. Message validation
  const message = sanitizeString(obj.message);
  if (!message || message.length < 10) {
    errors.message = "Message must be at least 10 characters detailing your enquiry.";
  } else if (message.length > 3000) {
    errors.message = "Message cannot exceed 3,000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name,
      email,
      phone,
      subject,
      message,
    },
  };
}
