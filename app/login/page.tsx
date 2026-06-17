'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { AuthButtons } from '@/components/AuthButtons';
import { UserAuth } from '@/components/UserAuth';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { Check } from 'lucide-react';

type AuthTab = 'signin' | 'signup';

function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/configurator';
  const authError = searchParams.get('auth_error');
  const [tab, setTab] = useState<AuthTab>('signup');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        window.location.href = next;
      }
    });
  }, [next]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1C1B1A] flex flex-col">
      <header className="border-b border-[#EBEAE6] px-6 lg:px-12 py-4 flex items-center justify-between">
        <BrandLogo />
        <UserAuth compact />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#EBEAE6] rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8A8782] font-mono">Sofex account</p>
            <h1 className="text-2xl font-light tracking-tight mt-2">
              {tab === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-[#64625D] mt-2 leading-relaxed">
              {tab === 'signup'
                ? 'New to Sofex? Create a free account with Google to save your sofa design and track delivery.'
                : 'Already have an account? Sign in with Google to continue.'}
            </p>

            <div className="flex rounded-xl border border-[#EBEAE6] p-1 bg-[#FBFBFA] mt-6">
              <button
                type="button"
                onClick={() => setTab('signup')}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                  tab === 'signup' ? 'bg-white shadow-sm text-black' : 'text-[#8A8782]'
                }`}
              >
                Create account
              </button>
              <button
                type="button"
                onClick={() => setTab('signin')}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                  tab === 'signin' ? 'bg-white shadow-sm text-black' : 'text-[#8A8782]'
                }`}
              >
                Sign in
              </button>
            </div>

            {authError && (
              <p className="mt-4 text-xs text-red-800 bg-red-50 border border-red-100 rounded-lg p-3">
                Sign-in failed: {decodeURIComponent(authError)}
              </p>
            )}

            <div className="mt-5">
              <AuthButtons
                redirectTo={next}
                variant={tab === 'signup' ? 'signup-only' : 'signin-only'}
              />
            </div>

            <ul className="mt-6 space-y-2">
              {['Save your bespoke configuration', 'Faster checkout with pre-filled details', 'Track your delivery'].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-[#64625D]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-center text-xs text-[#8A8782]">
              <Link href={next} className="underline hover:text-black">
                Continue without an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBFBFA]" />}>
      <LoginContent />
    </Suspense>
  );
}
