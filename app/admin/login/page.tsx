'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND_NAME } from '@/lib/brand';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#EBEAE6] p-8 shadow-lg">
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <BrandLogo href="/" />
          <p className="text-xs text-[#8A8782] uppercase tracking-wider">{BRAND_NAME} Admin</p>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-[10px] text-[#8A8782] text-center mt-6">
          Default: admin@sofex.furniture / admin123 — set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local
        </p>
      </div>
    </div>
  );
}
