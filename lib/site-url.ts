/** Canonical site URL for OAuth redirects — must match Supabase redirect allow-list. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (configured) return configured;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:3000';
}

export function authCallbackUrl(nextPath: string): string {
  const next = nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}
