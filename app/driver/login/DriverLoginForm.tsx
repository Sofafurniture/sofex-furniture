'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Truck } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND_NAME } from '@/lib/brand';

export default function DriverLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/driver/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    const redirect = searchParams.get('redirect') ?? '/driver';
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#EBEAE6] p-8 shadow-lg">
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <BrandLogo href="/" />
          <div className="flex items-center gap-2 text-[#64625D]">
            <Truck className="w-4 h-4" />
            <p className="text-xs uppercase tracking-wider">{BRAND_NAME} Driver</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64625D]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64625D]">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-[#EBEAE6] bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </label>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'View my deliveries'}
          </button>
        </form>

        <p className="text-[10px] text-[#8A8782] text-center mt-6">
          Driver 1: driver1@sofex.furniture · Driver 2: driver2@sofex.furniture (default password: driver123)
        </p>
      </div>
    </div>
  );
}
