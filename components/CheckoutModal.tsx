'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculatePrice } from '@/lib/pricing';
import { useSofaStore } from '@/store/sofa-store';
import { getDeliveryDays, looksLikeUkPostcode } from '@/lib/delivery-slots';
import { DELIVERY_PROMISE } from '@/lib/configurator-catalog';
import { AuthButtons } from '@/components/AuthButtons';
import { PaymentBadges } from '@/components/PaymentBadges';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { Calendar, Loader2, Lock, MapPin, User, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

type CheckoutMode = 'guest' | 'account';

export function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
  const config = useSofaStore((s) => s.config);
  const [mode, setMode] = useState<CheckoutMode>('guest');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [remarks, setRemarks] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('morning');
  const [discountCode, setDiscountCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryDays = useMemo(() => getDeliveryDays(), []);
  const monthly = useMemo(() => (total / 12).toFixed(2), [total]);
  const selectedDay = deliveryDays.find((d) => d.date === deliveryDate);

  useEffect(() => {
    if (!isOpen || !isSupabaseConfigured) return;
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      setMode('account');
      if (user.email) setEmail(user.email);
      const meta = user.user_metadata as { full_name?: string; name?: string };
      setName(meta.full_name ?? meta.name ?? '');
    });
  }, [isOpen]);

  useEffect(() => {
    if (deliveryDays.length && !deliveryDate) {
      setDeliveryDate(deliveryDays[0].date);
    }
  }, [deliveryDays, deliveryDate]);

  if (!isOpen) return null;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!looksLikeUkPostcode(postcode)) {
      setError('Please enter a valid UK postcode for delivery within 50 miles of London.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: address,
          postcode,
          deliveryDate,
          deliverySlot,
          deliveryRemarks: remarks,
          checkoutMode: mode,
          discountCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.demoMode) {
          setError(
            `Demo mode: Add Stripe keys to Netlify (STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY). Your total: £${data.total}.`,
          );
        } else {
          setError(data.message ?? data.error ?? 'Checkout failed');
        }
        return;
      }

      if (data.url) window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F4F3EF] transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-[#64625D]" />
        </button>

        <form onSubmit={handleCheckout} className="p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-semibold">Secure checkout</p>
            <h3 className="text-xl font-semibold text-black tracking-tight mt-1">Complete your bespoke order</h3>
            <p className="text-xs text-[#64625D] mt-1">
              £{total} total · or £{monthly}/mo · {DELIVERY_PROMISE.headline}
            </p>
          </div>

          <div className="flex rounded-xl border border-[#EBEAE6] p-1 bg-[#FBFBFA]">
            <button
              type="button"
              onClick={() => setMode('guest')}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                mode === 'guest' ? 'bg-white shadow-sm text-black' : 'text-[#8A8782]'
              }`}
            >
              Guest checkout
            </button>
            <button
              type="button"
              onClick={() => setMode('account')}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                mode === 'account' ? 'bg-white shadow-sm text-black' : 'text-[#8A8782]'
              }`}
            >
              Sign in
            </button>
          </div>

          {mode === 'account' && (
            <div className="space-y-3 p-4 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA]">
              <p className="text-xs text-[#64625D]">Create an account or sign in to save your design and track delivery.</p>
              <AuthButtons />
              <p className="text-[10px] text-[#8A8782] text-center">Or continue as guest with the form below</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-[#64625D] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Your details
            </p>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name *"
              className="w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address *"
              className="w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contact number *"
              className="w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-[#64625D] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Delivery address
            </p>
            <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              We deliver within <strong>50 miles of London</strong>. Your sofa arrives as one piece and is assembled in your home.
            </p>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address *"
              className="w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
            />
            <input
              required
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder="Postcode * (e.g. SW1A 1AA)"
              className="w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Delivery remarks (access codes, floor, parking…)"
              className="w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-[#64625D] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Choose delivery date & time
            </p>
            <select
              required
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm"
            >
              {deliveryDays.map((day) => (
                <option key={day.date} value={day.date}>{day.label}</option>
              ))}
            </select>
            <select
              required
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm"
            >
              {(selectedDay?.slots ?? deliveryDays[0]?.slots ?? []).map((slot) => (
                <option key={slot.id} value={slot.id}>{slot.label}</option>
              ))}
            </select>
          </div>

          <label className="block">
            <span className="text-xs text-[#64625D]">Discount code (optional)</span>
            <input
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              placeholder="SOFEX15-XXXXX"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm"
            />
          </label>

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
                Redirecting to Stripe…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay £{total} securely
              </>
            )}
          </button>

          <PaymentBadges />
          <p className="text-[10px] text-center text-[#8A8782] leading-relaxed">
            Stripe Checkout supports card, Apple Pay, Google Pay, Klarna & Clearpay. Enable each in your{' '}
            <a href="https://dashboard.stripe.com/settings/payment_methods" className="underline" target="_blank" rel="noreferrer">
              Stripe Dashboard
            </a>.
          </p>
        </form>
      </div>
    </div>
  );
}
