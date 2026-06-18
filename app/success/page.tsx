import { Suspense } from 'react';
import { OrderSuccessClient } from '@/components/OrderSuccessClient';

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBFBFA]" />}>
      <OrderSuccessClient />
    </Suspense>
  );
}
