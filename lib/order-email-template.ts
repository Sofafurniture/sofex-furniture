import { BRAND_NAME, STORE_EMAIL } from './brand';
import { escapeHtml } from './email';

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  sofaDescription: string;
  deliveryWindow: string;
  deliveryNotes?: string;
  totalPaid: string;
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #EBEAE6;color:#8A8782;font-size:13px;width:140px;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #EBEAE6;color:#1C1B1A;font-size:14px;vertical-align:top">${value}</td>
    </tr>
  `;
}

export function buildCustomerOrderEmail(data: OrderEmailData): string {
  const firstName = escapeHtml(data.customerName.split(' ')[0] || data.customerName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order confirmed — ${escapeHtml(BRAND_NAME)}</title>
</head>
<body style="margin:0;padding:0;background:#F4F3EF;font-family:Georgia,'Times New Roman',serif;color:#1C1B1A">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F3EF;padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;border:1px solid #EBEAE6;border-radius:16px;overflow:hidden">
          <tr>
            <td style="background:#1C1B1A;padding:28px 32px">
              <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#B2FCE4">Order confirmed</p>
              <h1 style="margin:10px 0 0;font-size:28px;font-weight:400;color:#FFFFFF;line-height:1.2">${escapeHtml(BRAND_NAME)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6">Dear ${firstName},</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#64625D">
                Thank you for your order. Your payment of <strong style="color:#1C1B1A">${escapeHtml(data.totalPaid)}</strong> has been received
                and your bespoke sofa is now in our production queue.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px">
                ${detailRow('Order reference', `<span style="font-family:monospace;font-size:13px">${escapeHtml(data.orderId)}</span>`)}
                ${detailRow('Your sofa', escapeHtml(data.sofaDescription))}
                ${detailRow('Delivery window', escapeHtml(data.deliveryWindow))}
                ${data.deliveryNotes ? detailRow('Delivery notes', escapeHtml(data.deliveryNotes)) : ''}
                ${detailRow('Delivery address', escapeHtml(data.shippingAddress))}
                ${detailRow('Contact phone', escapeHtml(data.customerPhone))}
                ${detailRow('Email', escapeHtml(data.customerEmail))}
                ${detailRow('Amount paid', `<strong>${escapeHtml(data.totalPaid)}</strong>`)}
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F3EF;border-radius:12px;margin:0 0 24px">
                <tr>
                  <td style="padding:18px 20px">
                    <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#8A8782">What happens next</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#64625D">
                      Our team will confirm your delivery date and contact you if we need any further details.
                      Your sofa will be delivered assembled in your home within our 50-mile London delivery area.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;line-height:1.7;color:#64625D">
                Questions about your order? Reply to this email or contact us at
                <a href="mailto:${STORE_EMAIL}" style="color:#1C1B1A">${STORE_EMAIL}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #EBEAE6;background:#FBFBFA">
              <p style="margin:0;font-size:12px;color:#8A8782;line-height:1.6">
                ${escapeHtml(BRAND_NAME)} · Bespoke sofas, built to order<br>
                Delivered within 50 miles of London
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildStoreOrderEmail(data: OrderEmailData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>New paid order</title></head>
<body style="font-family:Arial,sans-serif;color:#1C1B1A;line-height:1.6">
  <h2 style="margin:0 0 16px">New paid order — ${escapeHtml(data.customerName)}</h2>
  <p style="margin:0 0 20px">A customer completed checkout on the website.</p>
  <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;max-width:560px">
    ${detailRow('Order reference', escapeHtml(data.orderId))}
    ${detailRow('Customer', escapeHtml(data.customerName))}
    ${detailRow('Email', escapeHtml(data.customerEmail))}
    ${detailRow('Phone', escapeHtml(data.customerPhone))}
    ${detailRow('Address', escapeHtml(data.shippingAddress))}
    ${detailRow('Configuration', escapeHtml(data.sofaDescription))}
    ${detailRow('Delivery', escapeHtml(data.deliveryWindow))}
    ${data.deliveryNotes ? detailRow('Notes', escapeHtml(data.deliveryNotes)) : ''}
    ${detailRow('Total paid', escapeHtml(data.totalPaid))}
  </table>
</body>
</html>`;
}
