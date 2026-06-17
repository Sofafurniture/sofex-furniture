import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { BRAND_NAME } from '@/lib/brand';
import { DiscountPopup } from '@/components/DiscountPopup';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Custom Sofas Delivered Within 7 Days`,
  description: 'Bespoke sofas handcrafted to order. Delivered within 50 miles of London in as little as 7 days — whole sofa, assembled in your home.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <DiscountPopup />
      </body>
    </html>
  );
}
