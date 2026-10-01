import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NewOrderEmailData {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  stateCode: string;
  orderType: "pickup" | "delivery";
  deliveryLocation: string | null;
  orderNote: string | null;
  items: { item_name: string; quantity: number; unit_price: number; subtotal: number }[];
  subtotal: number;
  takeawayFee: number;
  deliveryFee: number;
  total: number;
  receiptUrl: string;
  adminEmail: string;
}

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function buildEmailHtml(d: NewOrderEmailData): string {
  const itemRows = d.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${i.item_name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:center;">${i.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:right;">${formatCurrency(i.subtotal)}</td>
      </tr>`
    )
    .join("");

  const deliveryRow =
    d.orderType === "delivery"
      ? `<tr>
          <td colspan="2" style="padding:8px 12px;font-size:14px;color:#57534e;">Takeaway packaging</td>
          <td style="padding:8px 12px;font-size:14px;color:#57534e;text-align:right;">${formatCurrency(d.takeawayFee)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:8px 12px;font-size:14px;color:#57534e;">Delivery fee</td>
          <td style="padding:8px 12px;font-size:14px;color:#57534e;text-align:right;">${formatCurrency(d.deliveryFee)}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e7e5e4;">

        <!-- Header -->
        <tr>
          <td style="background:#FC0003;padding:24px 32px;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">Famous Kitchen</p>
            <p style="margin:4px 0 0;font-size:13px;color:#fecaca;">New order received</p>
          </td>
        </tr>

        <!-- Order badge -->
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0;font-size:24px;font-weight:700;color:#1c1917;">${d.orderNumber}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#78716c;">
              ${d.orderType === "delivery" ? "🚚 Delivery" : "🏃 Pickup"}
              ${d.deliveryLocation ? ` — ${d.deliveryLocation}` : ""}
            </p>
          </td>
        </tr>

        <!-- Customer info -->
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;border-radius:6px;padding:16px;">
              <tr>
                <td style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;padding-bottom:10px;">Customer</td>
              </tr>
              <tr>
                <td style="font-size:14px;font-weight:600;color:#1c1917;">${d.customerName}</td>
              </tr>
              ${d.stateCode ? `<tr><td style="font-size:13px;font-weight:700;color:#FC0003;padding-top:2px;">${d.stateCode}</td></tr>` : ""}
              <tr>
                <td style="font-size:13px;color:#57534e;padding-top:2px;">${d.customerPhone}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#57534e;padding-top:2px;">${d.customerEmail}</td>
              </tr>
              ${
                d.orderNote
                  ? `<tr><td style="font-size:13px;color:#57534e;padding-top:8px;border-top:1px solid #e7e5e4;margin-top:8px;">
                      <em>Note: ${d.orderNote}</em>
                    </td></tr>`
                  : ""
              }
            </table>
          </td>
        </tr>

        <!-- Order items -->
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:6px;overflow:hidden;">
              <thead>
                <tr style="background:#f5f5f4;">
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;text-align:left;">Item</th>
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;text-align:center;">Qty</th>
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
                ${deliveryRow}
                <tr style="background:#f5f5f4;">
                  <td colspan="2" style="padding:10px 12px;font-size:14px;font-weight:700;color:#1c1917;">Total</td>
                  <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#1c1917;text-align:right;">${formatCurrency(d.total)}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Receipt link -->
        <tr>
          <td style="padding:20px 32px 0;">
            <a href="${d.receiptUrl}" target="_blank"
               style="display:inline-block;background:#FC0003;color:#ffffff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:6px;text-decoration:none;">
              View Payment Receipt
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;margin-top:8px;border-top:1px solid #e7e5e4;margin-top:20px;">
            <p style="margin:0;font-size:12px;color:#a8a29e;">
              Log in to the admin panel to confirm or reject this order.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Sends a new-order notification email to the admin.
 * Failures are logged but never thrown — email errors must not break order creation.
 */
export async function sendNewOrderNotification(data: NewOrderEmailData): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: "Famous Kitchen <onboarding@resend.dev>",
      to: data.adminEmail,
      subject: `New order ${data.orderNumber} — ${data.customerName}`,
      html: buildEmailHtml(data),
    });

    if (error) {
      console.error("[email] sendNewOrderNotification failed:", error);
    }
  } catch (err) {
    console.error("[email] sendNewOrderNotification threw:", err);
  }
}

// ─── Order Confirmed Email (to customer) ─────────────────────────────────────

export interface OrderConfirmedEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderType: "pickup" | "delivery";
  deliveryLocation: string | null;
  items: { item_name: string; quantity: number; unit_price: number; subtotal: number }[];
  subtotal: number;
  takeawayFee: number;
  deliveryFee: number;
  total: number;
}

const LOGO_URL =
  "https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_33%20AM.png";

function buildConfirmedEmailHtml(d: OrderConfirmedEmailData): string {
  const itemRows = d.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${i.item_name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:center;">${i.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:right;">${formatCurrency(i.subtotal)}</td>
      </tr>`
    )
    .join("");

  const feeRows =
    d.orderType === "delivery"
      ? `<tr>
          <td colspan="2" style="padding:8px 12px;font-size:14px;color:#57534e;">Takeaway packaging</td>
          <td style="padding:8px 12px;font-size:14px;color:#57534e;text-align:right;">${formatCurrency(d.takeawayFee)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:8px 12px;font-size:14px;color:#57534e;">Delivery fee</td>
          <td style="padding:8px 12px;font-size:14px;color:#57534e;text-align:right;">${formatCurrency(d.deliveryFee)}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e7e5e4;">

        <!-- Header with logo -->
        <tr>
          <td style="background:#FC0003;padding:20px 32px;text-align:center;">
            <img src="${LOGO_URL}" alt="Famous Kitchen" width="120" style="display:block;margin:0 auto;height:auto;max-height:60px;object-fit:contain;" />
          </td>
        </tr>

        <!-- Confirmation hero -->
        <tr>
          <td style="padding:32px 32px 0;text-align:center;">
            <div style="display:inline-block;background:#f0fdf4;border-radius:50%;padding:16px;margin-bottom:12px;">
              <span style="font-size:32px;">✅</span>
            </div>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#1c1917;">Order Confirmed!</h1>
            <p style="margin:8px 0 0;font-size:15px;color:#57534e;">
              Hi ${d.customerName}, your payment has been verified.
            </p>
          </td>
        </tr>

        <!-- Status message -->
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px;">
              <tr>
                <td style="text-align:center;">
                  <p style="margin:0;font-size:24px;">👨‍🍳</p>
                  <p style="margin:8px 0 0;font-size:15px;font-weight:600;color:#1c1917;">Mr Famous is currently preparing your meal</p>
                  <p style="margin:6px 0 0;font-size:13px;color:#78716c;">
                    You will receive a message via <strong>WhatsApp</strong> once your order is ready.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Order number + type -->
        <tr>
          <td style="padding:20px 32px 0;">
            <p style="margin:0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;">Order</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1c1917;">#${d.orderNumber}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#78716c;">
              ${d.orderType === "delivery" ? "🚚 Delivery" : "🏃 Pickup"}
              ${d.deliveryLocation ? ` — ${d.deliveryLocation}` : ""}
            </p>
          </td>
        </tr>

        <!-- Order items -->
        <tr>
          <td style="padding:16px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:6px;overflow:hidden;">
              <thead>
                <tr style="background:#f5f5f4;">
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;text-align:left;">Item</th>
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;text-align:center;">Qty</th>
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
                ${feeRows}
                <tr style="background:#f5f5f4;">
                  <td colspan="2" style="padding:10px 12px;font-size:14px;font-weight:700;color:#1c1917;">Total paid</td>
                  <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#FC0003;text-align:right;">${formatCurrency(d.total)}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;border-top:1px solid #e7e5e4;margin-top:20px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#78716c;">Thank you for choosing Famous Kitchen 🍽️</p>
            <p style="margin:6px 0 0;font-size:12px;color:#a8a29e;">NYSC Camp · Imo State · Open 7:00 AM – 10:00 PM</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Sends an order-confirmed email to the customer.
 * Failures are logged but never thrown.
 */
export async function sendOrderConfirmedEmail(data: OrderConfirmedEmailData): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: "Famous Kitchen <onboarding@resend.dev>",
      to: data.customerEmail,
      subject: `✅ Order confirmed — ${data.orderNumber}`,
      html: buildConfirmedEmailHtml(data),
    });

    if (error) {
      console.error("[email] sendOrderConfirmedEmail failed:", error);
    }
  } catch (err) {
    console.error("[email] sendOrderConfirmedEmail threw:", err);
  }
}
