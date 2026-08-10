/**
 * Order receipt email — HTML + plain-text.
 *
 * Built with table layout and inline styles only; email clients don't support
 * modern CSS, flexbox or external stylesheets. Brand palette mirrors
 * src/web/styles.css (void #0a0a0a, acid #6ee7a4, bone #f5f5f0, ash #8a8a85).
 */

export interface ReceiptItem {
  productName: string;
  quantity: number;
  unitPriceCents: number;
}

export interface ReceiptData {
  code: string;
  customerName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  zip: string;
  notes?: string | null;
  items: ReceiptItem[];
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  placedAt: Date;
}

const DELIVERY_WINDOW = "Thursday, Saturday & Sunday · 1–10pm";

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPlacedAt(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Los_Angeles",
  }).format(date);
}

export function receiptSubject(data: ReceiptData) {
  return `Order ${data.code} confirmed — Green Leaf Society`;
}

export function receiptText(data: ReceiptData) {
  const lines = [
    `GREEN LEAF SOCIETY`,
    `Order confirmed — ${data.code}`,
    ``,
    `Thanks, ${data.customerName}. We've got your order and we'll text ${data.phone} to lock in your delivery window.`,
    ``,
    `ORDER`,
    ...data.items.map(
      (i) =>
        `  ${i.quantity} x ${i.productName} — ${money(i.unitPriceCents * i.quantity)}`,
    ),
    ``,
    `  Subtotal: ${money(data.subtotalCents)}`,
    `  Delivery: ${data.deliveryCents === 0 ? "Free" : money(data.deliveryCents)}`,
    `  DUE IN CASH ON DELIVERY: ${money(data.totalCents)}`,
    ``,
    `We are cash only. Please have exact change ready — our drivers do not carry a float.`,
    ``,
    `DELIVERING TO`,
    `  ${data.customerName}`,
    `  ${data.addressLine}`,
    `  ${data.city}, CA ${data.zip}`,
    `  ${data.phone}`,
    `  ${data.email}`,
    ...(data.notes ? [``, `NOTES`, `  ${data.notes}`] : []),
    ``,
    `DELIVERY DAYS`,
    `  ${DELIVERY_WINDOW}`,
    `  Orders placed outside those days go out on the next delivery day.`,
    ``,
    `Placed ${formatPlacedAt(data.placedAt)} (PT)`,
    `Questions? Reply to this email or write greenleafsocietyworld@yahoo.com`,
  ];
  return lines.join("\n");
}

export function receiptHtml(data: ReceiptData) {
  const e = escapeHtml;

  const itemRows = data.items
    .map(
      (i) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid rgba(245,245,240,0.10);color:#f5f5f0;font-size:15px;line-height:1.4;">
            ${e(i.productName)}
            <div style="color:#8a8a85;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;padding-top:4px;">
              Qty ${i.quantity} &middot; ${money(i.unitPriceCents)} each
            </div>
          </td>
          <td align="right" style="padding:14px 0;border-bottom:1px solid rgba(245,245,240,0.10);color:#f5f5f0;font-size:15px;font-weight:600;white-space:nowrap;">
            ${money(i.unitPriceCents * i.quantity)}
          </td>
        </tr>`,
    )
    .join("");

  const notesBlock = data.notes
    ? `
      <tr>
        <td style="padding-top:24px;">
          <div style="color:#8a8a85;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Order notes</div>
          <div style="color:#f5f5f0;font-size:14px;line-height:1.6;padding-top:8px;">${e(data.notes)}</div>
        </td>
      </tr>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(receiptSubject(data))}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${e(data.code)} — ${money(data.totalCents)} due in cash on delivery.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#141414;border:1px solid rgba(245,245,240,0.10);border-radius:18px;overflow:hidden;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

          <!-- Header -->
          <tr>
            <td style="background:#14432b;padding:28px 32px;">
              <div style="color:#6ee7a4;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;">Green Leaf Society</div>
              <div style="color:#f5f5f0;font-size:26px;font-weight:700;letter-spacing:-0.01em;padding-top:10px;">Order confirmed</div>
              <div style="color:#e7f5ee;font-size:14px;padding-top:6px;">San Diego &middot; delivery only &middot; cash only</div>
            </td>
          </tr>

          <!-- Code -->
          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1c1c1c;border:1px solid rgba(245,245,240,0.10);border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="color:#8a8a85;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Order code</div>
                    <div style="color:#6ee7a4;font-size:24px;font-weight:700;letter-spacing:0.06em;padding-top:6px;">${e(data.code)}</div>
                    <div style="color:#8a8a85;font-size:12px;padding-top:8px;">Placed ${e(formatPlacedAt(data.placedAt))} PT</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:24px 32px 0;color:#f5f5f0;font-size:15px;line-height:1.65;">
              Thanks, ${e(data.customerName)}. We've got your order. We'll text
              <span style="color:#6ee7a4;">${e(data.phone)}</span> to confirm your delivery window.
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding:26px 32px 0;">
              <div style="color:#8a8a85;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;padding-bottom:6px;">Your order</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
                <tr>
                  <td style="padding:14px 0 0;color:#8a8a85;font-size:14px;">Subtotal</td>
                  <td align="right" style="padding:14px 0 0;color:#f5f5f0;font-size:14px;">${money(data.subtotalCents)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0 0;color:#8a8a85;font-size:14px;">Delivery</td>
                  <td align="right" style="padding:8px 0 0;color:${data.deliveryCents === 0 ? "#6ee7a4" : "#f5f5f0"};font-size:14px;">
                    ${data.deliveryCents === 0 ? "Free" : money(data.deliveryCents)}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1c1c1c;border:1px solid rgba(110,231,164,0.35);border-radius:12px;">
                      <tr>
                        <td style="padding:16px 18px;color:#6ee7a4;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Due in cash on delivery</td>
                        <td align="right" style="padding:16px 18px;color:#f5f5f0;font-size:22px;font-weight:700;white-space:nowrap;">${money(data.totalCents)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cash notice -->
          <tr>
            <td style="padding:20px 32px 0;">
              <div style="color:#c3d19a;font-size:13px;line-height:1.6;">
                We're cash only — no cards, no apps. Please have exact change ready; drivers don't carry a float.
              </div>
            </td>
          </tr>

          <!-- Delivery details -->
          <tr>
            <td style="padding:26px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="color:#8a8a85;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Delivering to</div>
                    <div style="color:#f5f5f0;font-size:14px;line-height:1.7;padding-top:8px;">
                      ${e(data.customerName)}<br>
                      ${e(data.addressLine)}<br>
                      ${e(data.city)}, CA ${e(data.zip)}<br>
                      ${e(data.phone)}<br>
                      <span style="color:#8a8a85;">${e(data.email)}</span>
                    </div>
                  </td>
                </tr>
                ${notesBlock}
                <tr>
                  <td style="padding-top:24px;">
                    <div style="color:#8a8a85;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Delivery days</div>
                    <div style="color:#f5f5f0;font-size:14px;line-height:1.7;padding-top:8px;">
                      ${DELIVERY_WINDOW}<br>
                      <span style="color:#8a8a85;">Orders placed outside those days go out on the next delivery day.</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 32px 30px;">
              <div style="border-top:1px solid rgba(245,245,240,0.10);padding-top:18px;color:#8a8a85;font-size:12px;line-height:1.7;">
                Questions about this order? Reply to this email or write
                <a href="mailto:greenleafsocietyworld@yahoo.com" style="color:#6ee7a4;text-decoration:none;">greenleafsocietyworld@yahoo.com</a>.<br>
                Keep out of reach of children and pets. Do not drive or operate machinery under the influence.<br>
                <span style="color:#5c5c58;">Green Leaf Society &middot; San Diego, CA &middot; delivery only</span>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
