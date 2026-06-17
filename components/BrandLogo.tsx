import Link from 'next/link';
import { BRAND_SHORT, BRAND_TAGLINE } from '@/lib/brand';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const sizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function BrandLogo({ size = 'md', href = '/' }: BrandLogoProps) {
  const content = (
    <div className="flex items-center space-x-2">
      <span className={`${sizes[size]} font-semibold tracking-[0.15em] uppercase`}>{BRAND_SHORT}</span>
      <span className="text-xs font-mono px-2 py-0.5 bg-[#EBEAE6] rounded-full uppercase tracking-wider text-[#64625D]">{BRAND_TAGLINE}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
