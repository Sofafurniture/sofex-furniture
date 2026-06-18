import { BRAND_NAME, STORE_EMAIL } from '@/lib/brand';
import { escapeHtml, sendEmail } from '@/lib/email';
import type { DeliveryJob } from '@/lib/delivery-types';

export async function sendOutForDeliveryEmail(job: DeliveryJob): Promise<void> {
  if (!job.customer_email?.trim()) return;

  const firstName = escapeHtml(job.customer_name.split(' ')[0] || job.customer_name);

  await sendEmail({
    to: job.customer_email,
    subject: `Your sofa is on its way — ${BRAND_NAME}`,
    replyTo: STORE_EMAIL,
    html: `
      <h2>Your delivery is on the way</h2>
      <p>Hi ${firstName},</p>
      <p>Good news — your bespoke sofa from ${escapeHtml(BRAND_NAME)} is <strong>out for delivery</strong> today.</p>
      <p><strong>Delivery address:</strong><br>${escapeHtml(job.delivery_address).replace(/\n/g, '<br>')}</p>
      ${job.items_description ? `<p><strong>Order:</strong> ${escapeHtml(job.items_description)}</p>` : ''}
      ${job.customer_phone ? `<p>We have your contact number as ${escapeHtml(job.customer_phone)}. Our driver may call if they need directions.</p>` : ''}
      <p>Please ensure someone is available to receive the delivery. The sofa will be assembled in your home.</p>
      <p>Questions? Contact us at <a href="mailto:${STORE_EMAIL}">${STORE_EMAIL}</a>.</p>
      <p>— ${BRAND_NAME}</p>
    `,
  });

  await sendEmail({
    to: STORE_EMAIL,
    subject: `Out for delivery — ${job.customer_name}`,
    replyTo: job.customer_email,
    html: `
      <p><strong>${escapeHtml(job.customer_name)}</strong> — delivery marked out for delivery.</p>
      <p>${escapeHtml(job.delivery_address)}</p>
      ${job.items_description ? `<p>${escapeHtml(job.items_description)}</p>` : ''}
    `,
  });
}

export async function sendUnableToDeliverEmail(
  job: DeliveryJob,
  notes: string,
): Promise<void> {
  const summary = `
    <p><strong>Customer:</strong> ${escapeHtml(job.customer_name)}</p>
    <p><strong>Address:</strong> ${escapeHtml(job.delivery_address)}</p>
    ${job.items_description ? `<p><strong>Order:</strong> ${escapeHtml(job.items_description)}</p>` : ''}
    <p><strong>Driver notes:</strong> ${escapeHtml(notes)}</p>
  `;

  await sendEmail({
    to: STORE_EMAIL,
    subject: `Unable to deliver — ${job.customer_name}`,
    replyTo: job.customer_email ?? STORE_EMAIL,
    html: `<h2>Delivery could not be completed</h2>${summary}`,
  });

  if (job.customer_email?.trim()) {
    await sendEmail({
      to: job.customer_email,
      subject: `Delivery update — ${BRAND_NAME}`,
      replyTo: STORE_EMAIL,
      html: `
        <p>Hi ${escapeHtml(job.customer_name.split(' ')[0] || job.customer_name)},</p>
        <p>Unfortunately we were unable to complete your sofa delivery today. Our team will contact you shortly to rearrange.</p>
        <p>Questions? Contact <a href="mailto:${STORE_EMAIL}">${STORE_EMAIL}</a>.</p>
        <p>— ${BRAND_NAME}</p>
      `,
    });
  }
}
