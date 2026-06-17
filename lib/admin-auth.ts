import { cookies } from 'next/headers';
import { COOKIE_NAME, createAdminSession, verifyAdminSession } from '@/lib/admin-session';

export { COOKIE_NAME, createAdminSession, verifyAdminSession };

export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@sofex.furniture';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  return email === adminEmail && password === adminPassword;
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminSession(token);
}

export async function requireAdminSession(): Promise<{ email: string }> {
  const session = await getAdminSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}
