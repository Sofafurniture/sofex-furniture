import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/configurator';

  if (!isSupabaseConfigured || !code) {
    return NextResponse.redirect(new URL(next, origin));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('auth_error', error.message);
    loginUrl.searchParams.set('next', next);
    return NextResponse.redirect(loginUrl);
  }

  const destination = new URL(next, origin);
  destination.searchParams.set('signed_in', '1');
  return NextResponse.redirect(destination);
}
