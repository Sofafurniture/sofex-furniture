import { cookies } from 'next/headers';
import { COOKIE_NAME, createDriverSession, verifyDriverSession } from '@/lib/driver-session';
import { ensureDriverRecord } from '@/lib/delivery-db';

export { COOKIE_NAME, createDriverSession, verifyDriverSession };

interface DriverAccount {
  email: string;
  password: string;
  name: string;
}

function getDriverAccounts(): DriverAccount[] {
  return [
    {
      email: process.env.DRIVER_1_EMAIL ?? 'driver1@sofex.furniture',
      password: process.env.DRIVER_1_PASSWORD ?? 'driver123',
      name: process.env.DRIVER_1_NAME ?? 'Driver One',
    },
    {
      email: process.env.DRIVER_2_EMAIL ?? 'driver2@sofex.furniture',
      password: process.env.DRIVER_2_PASSWORD ?? 'driver123',
      name: process.env.DRIVER_2_NAME ?? 'Driver Two',
    },
  ];
}

export async function verifyDriverCredentials(
  email: string,
  password: string,
): Promise<{ driverId: string; name: string } | null> {
  const account = getDriverAccounts().find((d) => d.email === email && d.password === password);
  if (!account) return null;

  const driver = await ensureDriverRecord(account.email, account.name);
  return { driverId: driver.id, name: driver.name };
}

export async function getDriverSession(): Promise<{ email: string; driverId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyDriverSession(token);
}

export async function requireDriverSession(): Promise<{ email: string; driverId: string }> {
  const session = await getDriverSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}
