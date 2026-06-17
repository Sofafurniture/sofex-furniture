'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { AuthButtons } from '@/components/AuthButtons';
import { UserAuth } from '@/components/UserAuth';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { Check } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/configurator';
  const authError = searchParams.get('auth_error');

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
            <h1 className="text-2xl font-light tracking-tight mt-2">Sign in or create an account</h1>
            <p className="text-sm text-[#64625D] mt-2 leading-relaxed">
              Use Google to sign in or register — your account is created automatically on first sign-in.
              Save your sofa configuration and track delivery.
            </p>

            {authError && (
              <p className="mt-4 text-xs text-red-800 bg-red-50 border border-red-100 rounded-lg p-3">
                Sign-in failed: {decodeURIComponent(authError)}
              </p>
            )}

            <div className="mt-6">
              <AuthButtons redirectTo={next} />
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
                Continue without signing in
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
