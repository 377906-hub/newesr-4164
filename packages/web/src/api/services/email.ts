import { Resend } from "resend";

/**
 * Transactional email for Green Leaf Society.
 *
 * Configured entirely through env vars so the site keeps working without them:
 * - RESEND_API_KEY   required to actually send. Missing key = send is skipped, not an error.
 * - ORDER_FROM_EMAIL sender address. Must be on a domain verified in Resend.
 * - ORDER_BCC_EMAIL  internal copy of every order receipt.
 */

const FROM_FALLBACK = "Green Leaf Society <onboarding@resend.dev>";

export function emailFrom() {
  const configured = process.env.ORDER_FROM_EMAIL?.trim();
  if (!configured) return FROM_FALLBACK;
  // Allow either "a@b.com" or "Name <a@b.com>".
  return configured.includes("<") ? configured : `Green Leaf Society <${configured}>`;
}

export function emailEnabled() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  /** Both bodies are required — Resend's typed API rejects a send with neither. */
  text: string;
  html: string;
  bcc?: string | string[];
  replyTo?: string;
}

/** Sends an email. Returns false (never throws) when email isn't configured. */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  bcc,
  replyTo,
}: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: emailFrom(),
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
    bcc,
    replyTo,
  });

  if (error) throw new Error(`Email failed: ${error.message}`);
  return true;
}
