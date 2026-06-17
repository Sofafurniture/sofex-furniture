import { NextResponse } from 'next/server';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.redirect(new URL('/configurator', request.url));
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/configurator';

  if (code) {
    const supabase = createBrowserClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, origin));
}
