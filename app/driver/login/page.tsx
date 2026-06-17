import { Suspense } from 'react';
import DriverLoginPage from './DriverLoginForm';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F3EF]" />}>
      <DriverLoginPage />
    </Suspense>
  );
}
