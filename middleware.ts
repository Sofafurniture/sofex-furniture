import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSession, COOKIE_NAME as ADMIN_COOKIE } from '@/lib/admin-session';
import { verifyDriverSession, COOKIE_NAME as DRIVER_COOKIE } from '@/lib/driver-session';
import { updateSupabaseSession } from '@/lib/supabase-middleware';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Supabase sometimes redirects to Site URL root with ?code= instead of /auth/callback
  const oauthCode = searchParams.get('code');
  if (oauthCode && pathname !== '/auth/callback') {
    const callback = new URL('/auth/callback', request.url);
    callback.searchParams.set('code', oauthCode);
    callback.searchParams.set('next', searchParams.get('next') ?? '/configurator');
    return NextResponse.redirect(callback);
  }

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const session = token ? await verifyAdminSession(token) : null;

    if (!session) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/driver/login' || pathname === '/api/driver/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/driver') || pathname.startsWith('/api/driver')) {
    const token = request.cookies.get(DRIVER_COOKIE)?.value;
    const session = token ? await verifyDriverSession(token) : null;

    if (!session) {
      if (pathname.startsWith('/api/driver')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/driver/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/driver/:path*',
    '/api/driver/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
