'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { LogOut, User as UserIcon } from 'lucide-react';

function displayName(user: User): string {
  const meta = user.user_metadata as { full_name?: string; name?: string };
  return meta.full_name ?? meta.name ?? user.email?.split('@')[0] ?? 'Account';
}

export function UserAuth({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = createBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signOut() {
    if (!isSupabaseConfigured) return;
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  if (!isSupabaseConfigured || loading) {
    return null;
  }

  if (user) {
    if (compact) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64625D] hidden sm:inline truncate max-w-[120px]">
            {displayName(user)}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="text-xs uppercase tracking-widest font-medium text-[#64625D] hover:text-black transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-8 h-8 rounded-full bg-[#1C1B1A] text-white flex items-center justify-center text-xs font-semibold">
            {displayName(user).charAt(0).toUpperCase()}
          </span>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium leading-tight">{displayName(user)}</p>
            <p className="text-[10px] text-[#8A8782] truncate max-w-[140px]">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="text-xs uppercase tracking-widest font-medium text-[#64625D] hover:text-black border border-[#EBEAE6] px-3 py-2 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium text-[#64625D] hover:text-black border border-[#EBEAE6] px-4 py-2.5 rounded-xl transition-colors"
    >
      <UserIcon className="w-3.5 h-3.5" />
      Sign in
    </Link>
  );
}
