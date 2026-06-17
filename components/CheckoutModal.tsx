'use client';

import { useMemo, useState } from 'react';
import { calculatePrice } from '@/lib/pricing';
import { useSofaStore } from '@/store/sofa-store';
import { Loader2, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
  const config = useSofaStore((s) => s.config);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthly = useMemo(() => (total / 12).toFixed(2), [total]);

  if (!isOpen) return null;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          customerName: name,
          customerEmail: email,
          shippingAddress: address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.demoMode) {
          setError(
            `Demo mode: Configure Stripe & Supabase in .env.local to enable payments. Your sofa total would be £${data.total}.`,
          );
        } else {
          setError(data.message ?? data.error ?? 'Checkout failed');
        }
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#F4F3EF] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-[#64625D]" />
        </button>

        <form onSubmit={handleCheckout} className="p-8 space-y-5">
          <div>
            <h3 className="text-xl font-semibold text-black tracking-tight">Complete Your Order</h3>
            <p className="text-xs text-[#64625D] mt-1">
              Secure checkout via Stripe · £{total} total · or £{monthly}/mo interest-free
            </p>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-wider text-[#64625D]">Full Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Jane Smith"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-wider text-[#64625D]">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="jane@example.com"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-wider text-[#64625D]">Delivery Address</span>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                placeholder="123 High Street, London, SW1A 1AA"
              />
            </label>
          </div>

          {error && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1B1A] hover:bg-black disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </>
            ) : (
              `Pay £${total} Securely`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
