import { NextRequest, NextResponse } from 'next/server';
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

    return NextResponse.json({
      success: true,
      message: 'Your 15% welcome code is on its way — check your inbox shortly.',
      discountCode,
    });
  } catch {
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
