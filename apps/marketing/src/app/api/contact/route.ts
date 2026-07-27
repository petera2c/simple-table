import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

let resendClient: Resend | null | undefined;

function getResend(): Resend | null {
  if (resendClient !== undefined) {
    return resendClient;
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    resendClient = null;
    return null;
  }
  resendClient = new Resend(key);
  return resendClient;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  try {
    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ error: "Contact form is not configured" }, { status: 503 });
    }

    const body = await request.json();
    const {
      name,
      email,
      company,
      message = "",
      source = "contact_modal",
      planInterest,
      replacingAgGrid,
    } = body;

    const isQuote = source === "license_quote";

    if (!name || !email || !company) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!isQuote && !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safeCompany = escapeHtml(String(company));
    const safeMessage = escapeHtml(String(message || "")).replace(/\n/g, "<br>");
    const planLabel =
      planInterest === "enterprise"
        ? "Enterprise"
        : planInterest === "unsure"
          ? "Not sure yet"
          : planInterest === "pro"
            ? "Pro"
            : null;

    const subject = isQuote
      ? `License quote: ${company} - ${name}`
      : `Contact Form: ${company} - ${name}`;

    const html = isQuote
      ? `
        <h2>New license quote request</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Plan interest:</strong> ${planLabel ?? "Not specified"}</p>
        <p><strong>AG Grid alternative:</strong> ${replacingAgGrid ? "Yes" : "No"}</p>
        ${
          message
            ? `<p><strong>Notes:</strong></p><p>${safeMessage}</p>`
            : "<p><em>No additional notes.</em></p>"
        }
      `
      : `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `;

    const { data, error } = await resend.emails.send({
      from: "Simple Table Contact Form <onboarding@resend.dev>",
      to: ["peter@peteryng.com"],
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
