'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    setEmailStatus('sending');

    fetch('/api/orders/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const data = (await res.json()) as { emailed?: boolean; emailError?: string };
        if (cancelled) return;
        if (res.ok && data.emailed) setEmailStatus('sent');
        else if (res.ok) setEmailStatus('sent');
        else setEmailStatus('failed');
      })
      .catch(() => {
        if (!cancelled) setEmailStatus('failed');
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#EBEAE6] p-10 text-center shadow-lg">
        <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Order Confirmed</h1>
        <p className="text-sm text-[#64625D] mt-3 leading-relaxed">
          Thank you for your order. Your bespoke sofa is now in our production queue.
        </p>

        {emailStatus === 'sending' && (
          <p className="text-xs text-[#8A8782] mt-4 inline-flex items-center gap-2 justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Sending your confirmation email…
          </p>
        )}
        {emailStatus === 'sent' && (
          <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mt-4">
            A confirmation email with your order details is on its way.
          </p>
        )}
        {emailStatus === 'failed' && (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-4">
            Payment received. If you don&apos;t see a confirmation email within a few minutes, contact us at info@sofexfurniture.co.uk.
          </p>
        )}

        <p className="text-xs font-mono text-[#8A8782] mt-4">We&apos;ll confirm your delivery date shortly.</p>
        <Link
          href="/"
          className="inline-block mt-8 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-black transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
