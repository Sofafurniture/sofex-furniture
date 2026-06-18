import { NextRequest, NextResponse } from 'next/server';
import { BRAND_NAME, STORE_EMAIL } from '@/lib/brand';
import { escapeHtml, sendEmail } from '@/lib/email';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase';

function generateCode(): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SOFEX15-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const discountCode = generateCode();

    if (isSupabaseConfigured) {
      const supabase = createServiceClient();
      const { error } = await supabase.from('newsletter_signups').upsert(
        { email: email.trim().toLowerCase(), discount_code: discountCode, source: 'popup' },
        { onConflict: 'email' },
      );
      if (error) {
        console.error('Newsletter signup error:', error);
      }
    }

    const trimmedEmail = email.trim().toLowerCase();

    await sendEmail({
      to: trimmedEmail,
      replyTo: STORE_EMAIL,
      subject: `Your 15% welcome code — ${BRAND_NAME}`,
      html: `
        <h2>Welcome to ${BRAND_NAME}</h2>
        <p>Thank you for signing up. Use this code on your first order:</p>
        <p style="font-size:20px;font-weight:bold;letter-spacing:0.1em">${escapeHtml(discountCode)}</p>
        <p>Questions? Contact us at <a href="mailto:${STORE_EMAIL}">${STORE_EMAIL}</a>.</p>
      `,
    });

    await sendEmail({
      to: STORE_EMAIL,
      replyTo: trimmedEmail,
      subject: `New newsletter signup — ${trimmedEmail}`,
      html: `<p>New signup: <strong>${escapeHtml(trimmedEmail)}</strong> · Code: ${escapeHtml(discountCode)}</p>`,
    });

    return NextResponse.json({
      success: true,
      message: 'Your 15% welcome code is on its way — check your inbox shortly.',
      discountCode,
    });
  } catch {
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
