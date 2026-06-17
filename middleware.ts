import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSession, COOKIE_NAME as ADMIN_COOKIE } from '@/lib/admin-session';
import { verifyDriverSession, COOKIE_NAME as DRIVER_COOKIE } from '@/lib/driver-session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/driver/:path*', '/api/driver/:path*'],
};
