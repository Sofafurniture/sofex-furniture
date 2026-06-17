import { redirect } from 'next/navigation';
import { getDriverSession } from '@/lib/driver-auth';
import { fetchAllDrivers } from '@/lib/delivery-db';
import { DriverPortalClient } from '@/components/driver/DriverPortalClient';
import { isSupabaseConfigured } from '@/lib/supabase';

export default async function DriverPage() {
  const session = await getDriverSession();
  if (!session) redirect('/driver/login');

  let driverName = session.email;
  if (isSupabaseConfigured) {
    try {
      const drivers = await fetchAllDrivers();
      const driver = drivers.find((d) => d.id === session.driverId);
      if (driver) driverName = driver.name;
    } catch {
      // use email fallback
    }
  }

  return <DriverPortalClient driverName={driverName} />;
}
