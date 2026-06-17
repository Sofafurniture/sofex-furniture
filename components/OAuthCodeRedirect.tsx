'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/** If Supabase sends the auth code to / instead of /auth/callback, forward it. */
export function OAuthCodeRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === '/auth/callback') return;
    const code = searchParams.get('code');
    if (!code) return;

    const next = searchParams.get('next') ?? '/configurator';
    const params = new URLSearchParams({ code, next });
    router.replace(`/auth/callback?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return null;
}
