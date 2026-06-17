import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, createDriverSession } from '@/lib/driver-session';
import { verifyDriverCredentials } from '@/lib/driver-auth';

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const driver = await verifyDriverCredentials(email, password);
  if (!driver) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createDriverSession(email, driver.driverId);
  const response = NextResponse.json({ success: true, name: driver.name });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}
