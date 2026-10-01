import { Resend } from "resend";

// Run with: RESEND_API_KEY=re_xxx node scripts/test-emails.mjs
const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "akinlajatimileyin@gmail.com";
const LOGO = "https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_33%20AM.png";

// ── 1. New Order Notification (admin email) ───────────────────────────────────
const newOrderHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e7e5e4;">
        <tr>
          <td style="background:#FC0003;padding:24px 32px;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">Famous Kitchen</p>
            <p style="margin:4px 0 0;font-size:13px;color:#fecaca;">New order received</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0;font-size:24px;font-weight:700;color:#1c1917;">FK-1001-A3F</p>
            <p style="margin:4px 0 0;font-size:13px;color:#78716c;">Delivery — Entrance of the Hall</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;border-radius:6px;padding:16px;">
              <tr><td style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;padding-bottom:10px;">Customer</td></tr>
              <tr><td style="font-size:14px;font-weight:600;color:#1c1917;">Timileyin Akinlaja</td></tr>
              <tr><td style="font-size:13px;font-weight:700;color:#FC0003;padding-top:2px;">IM/24A/1234</td></tr>
              <tr><td style="font-size:13px;color:#57534e;padding-top:2px;">+2348104863217</td></tr>
              <tr><td style="font-size:13px;color:#57534e;padding-top:2px;">akinlajatimileyin@gmail.com</td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:6px;overflow:hidden;">
              <thead>
                <tr style="background:#f5f5f4;">
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;color:#78716c;text-align:left;">Item</th>
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;color:#78716c;text-align:center;">Qty</th>
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;color:#78716c;text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">Spaghetti</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:center;">1</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:right;">₦1,500</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">Noodles</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:center;">2</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:right;">₦3,400</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:8px 12px;font-size:14px;color:#57534e;">Takeaway packaging</td>
                  <td style="padding:8px 12px;font-size:14px;color:#57534e;text-align:right;">₦200</td>
                </tr>
                <tr style="background:#f5f5f4;">
                  <td colspan="2" style="padding:10px 12px;font-size:14px;font-weight:700;color:#1c1917;">Total</td>
                  <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#1c1917;text-align:right;">₦5,100</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;">
            <a href="https://famous-kitchen-nine.vercel.app/admin/orders" style="display:inline-block;background:#FC0003;color:#ffffff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:6px;text-decoration:none;">
              View in Admin Panel
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;border-top:1px solid #e7e5e4;margin-top:20px;">
            <p style="margin:0;font-size:12px;color:#a8a29e;">Log in to the admin panel to confirm or reject this order.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── 2. Order Confirmed Email (customer email) ─────────────────────────────────
const confirmedHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e7e5e4;">
        <tr>
          <td style="background:#FC0003;padding:20px 32px;text-align:center;">
            <img src="${LOGO}" alt="Famous Kitchen" width="120" style="display:block;margin:0 auto;height:auto;max-height:60px;object-fit:contain;" />
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 0;text-align:center;">
            <div style="display:inline-block;background:#f0fdf4;border-radius:50%;padding:16px;margin-bottom:12px;">
              <span style="font-size:32px;">&#10003;</span>
            </div>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#1c1917;">Order Confirmed!</h1>
            <p style="margin:8px 0 0;font-size:15px;color:#57534e;">Hi Timileyin, your payment has been verified.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px;">
              <tr>
                <td style="text-align:center;">
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1c1917;">Mr Famous is currently preparing your meal</p>
                  <p style="margin:6px 0 0;font-size:13px;color:#78716c;">You will receive a message via <strong>WhatsApp</strong> once your order is ready.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;">
            <p style="margin:0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;">Order</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1c1917;">#FK-1001-A3F</p>
            <p style="margin:4px 0 0;font-size:13px;color:#78716c;">Delivery — Entrance of the Hall</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:6px;overflow:hidden;">
              <thead>
                <tr style="background:#f5f5f4;">
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;color:#78716c;text-align:left;">Item</th>
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;color:#78716c;text-align:center;">Qty</th>
                  <th style="padding:8px 12px;font-size:11px;font-weight:600;text-transform:uppercase;color:#78716c;text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">Spaghetti</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:center;">1</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:right;">₦1,500</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">Noodles</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:center;">2</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;text-align:right;">₦3,400</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:8px 12px;font-size:14px;color:#57534e;">Takeaway packaging</td>
                  <td style="padding:8px 12px;font-size:14px;color:#57534e;text-align:right;">₦200</td>
                </tr>
                <tr style="background:#f5f5f4;">
                  <td colspan="2" style="padding:10px 12px;font-size:14px;font-weight:700;color:#1c1917;">Total paid</td>
                  <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#FC0003;text-align:right;">₦5,100</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;border-top:1px solid #e7e5e4;margin-top:20px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#78716c;">Thank you for choosing Famous Kitchen</p>
            <p style="margin:6px 0 0;font-size:12px;color:#a8a29e;">NYSC Camp · Imo State · Open 7:00 AM – 10:00 PM</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Send both ─────────────────────────────────────────────────────────────────
console.log("Sending test emails to", TO);

const [r1, r2] = await Promise.all([
  resend.emails.send({
    from: "Famous Kitchen <onboarding@resend.dev>",
    to: TO,
    subject: "TEST — New order FK-1001-A3F — Timileyin Akinlaja",
    html: newOrderHtml,
  }),
  resend.emails.send({
    from: "Famous Kitchen <onboarding@resend.dev>",
    to: TO,
    subject: "TEST — Order confirmed — FK-1001-A3F",
    html: confirmedHtml,
  }),
]);

console.log("New order email:", r1.error ?? "sent — id: " + r1.data?.id);
console.log("Confirmed email:", r2.error ?? "sent — id: " + r2.data?.id);
