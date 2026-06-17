import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase';

export const FIRST_ORDER_DISCOUNT_PERCENT = 15;

export async function validateDiscountCode(code: string): Promise<boolean> {
  const normalized = code.trim().toUpperCase();
  if (!normalized.startsWith('SOFEX15-')) return false;
  if (!isSupabaseConfigured) return normalized.length >= 12;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from('newsletter_signups')
    .select('id')
    .eq('discount_code', normalized)
    .maybeSingle();

  return Boolean(data);
}

export function applyPercentDiscount(totalPence: number, percent: number): number {
  return Math.round(totalPence * (1 - percent / 100));
}
