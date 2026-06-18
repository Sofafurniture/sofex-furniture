import { NextRequest, NextResponse } from 'next/server';
import { BRAND_NAME, STORE_EMAIL } from '@/lib/brand';
import { escapeHtml, sendEmail } from '@/lib/email';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase';

interface ContactBody {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactBody;
    const name = body.name?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const phone = body.phone?.trim() ?? '';
    const subject = body.subject?.trim() ?? '';
    const message = body.message?.trim() ?? '';

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const supabase = createServiceClient();
      const { error } = await supabase.from('contact_inquiries').insert({
        name,
        email,
        phone: phone || null,
        subject,
        message,
      });
      if (error) {
        console.error('Contact inquiry save error:', error);
      }
    }

    await sendEmail({
      to: STORE_EMAIL,
      replyTo: email,
      subject: `Website enquiry: ${subject}`,
      html: `
        <h2>New contact form message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    await sendEmail({
      to: email,
      replyTo: STORE_EMAIL,
      subject: `We received your message — ${BRAND_NAME}`,
      html: `
        <h2>Thank you for contacting us</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>We've received your enquiry and will get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        <p>— ${BRAND_NAME}<br><a href="mailto:${STORE_EMAIL}">${STORE_EMAIL}</a></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
