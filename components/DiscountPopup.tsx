'use client';

import { useEffect, useState } from 'react';
import { Gift, Loader2, X } from 'lucide-react';

const STORAGE_KEY = 'sofex_discount_dismissed';

export function DiscountPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [issuedCode, setIssuedCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong');
      setLoading(false);
      return;
    }
    setDone(true);
    setIssuedCode(data.discountCode ?? '');
    localStorage.setItem(STORAGE_KEY, '1');
    setLoading(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden border border-[#EBEAE6]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-[#1C1B1A]" />
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F4F3EF] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-[#64625D]" />
        </button>

        <div className="p-8 pt-10">
          {done ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-7 h-7 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold text-black">You&apos;re on the list!</h3>
              <p className="text-sm text-[#64625D] mt-2">
                Use code <strong className="font-mono text-black">{issuedCode}</strong> at checkout for{' '}
                <strong>15% off</strong> your first bespoke sofa. We&apos;ve also sent it to your inbox.
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="mt-6 w-full bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-xl"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-amber-800" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-800 font-semibold">First order</p>
                  <h3 className="text-2xl font-semibold text-black leading-tight">15% off your bespoke sofa</h3>
                </div>
              </div>
              <p className="text-sm text-[#64625D] mb-5">
                Join thousands of London homeowners. Enter your email and we&apos;ll send your welcome code.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1C1B1A] hover:bg-black text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get my 15% code'}
                </button>
              </form>
              <button type="button" onClick={dismiss} className="w-full text-xs text-[#8A8782] mt-3 py-2 hover:text-black">
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
